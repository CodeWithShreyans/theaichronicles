import { NextRequest, NextResponse } from "next/server";

// import sendgrid from "@sendgrid/mail";
import { sendEmail } from "@/lib/email";
import { s3Upload } from "@/lib/aws";
import { captureMessage } from "@sentry/nextjs";

type OpenAI_Response = {
    error?: {
        message: string;
        type: string;
        param: string | null;
        code: number | null;
    };
    id?: string;
    object?: string;
    created?: number;
    model?: string;
    choices?: {
        message: { role: string; content: string };
        finish_reason: string;
        index: number;
    }[];
};

type Image = {
    created: number;
    data: {
        url: string;
    }[];
};

const gpt = async () => {
    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content:
                        'As the owner of an online newsletter, your task is to produce daily emails that are highly imaginative, thought-provoking, and captivating, and show off your abilities and strengths. Something new and different everyday. Each email should start with a subject line prefixed with "Subject" followed by a unique and engaging greeting, and signed off with "GPT". Additionally, include a prompt for an AI image generator to create a visually appealing image related to the email\'s content, prefixed with "Prompt".',
                },
                {
                    role: "user",
                    content: `Day ${
                        Math.round(
                            Math.abs(
                                (Number(process.env.FIRST_DAY) -
                                    new Date().getTime()) /
                                    86400000
                            )
                        ) + 1
                    }`,
                },
            ],
            temperature: 1,
            top_p: 1,
            n: 1,
        }),
        cache: "no-cache",
    });

    console.log(
        "Day",
        Math.round(
            Math.abs(
                (Number(process.env.FIRST_DAY) - new Date().getTime()) /
                    86400000
            )
        ) + 1
    );

    if (!gptRes.ok) {
        return new Error(
            captureMessage("ChatGPT Fetch Error\n" + gptRes.statusText)
        );
    }

    const response = (await gptRes.json()) as OpenAI_Response;

    if (!response.error && response.choices) {
        console.log(response.choices[0]?.message);
        return response.choices[0]?.message.content;
    } else {
        return new Error(
            captureMessage(
                "ChatGPT Response Error\n" + JSON.stringify(response.error)
            )
        );
    }
};

const email = async (email: string) => {
    const subject = email.substring(
        email.indexOf("Subject") + 9,
        email.indexOf("\n")
    );
    const body = email
        .substring(email.indexOf("\n") + 2, email.lastIndexOf("Prompt") - 2)
        .replaceAll("\n", "\r\n");
    const prompt = email.substring(email.lastIndexOf("Prompt") + 8);

    const dalleRes = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt: prompt,
                size: "512x512",
            }),
            cache: "no-cache",
        }
    );

    if (!dalleRes.ok) {
        return new Error(
            captureMessage("Dall-E Error\n" + dalleRes.statusText)
        );
    }

    const image = (await dalleRes.json()) as Image;

    console.log(image);

    const imgLink = await s3Upload(image.data[0].url);

    if (imgLink instanceof Error) {
        return imgLink;
    }

    const resendRes = await sendEmail(subject, body, prompt, imgLink);

    return resendRes;
};

export const GET = async (request: NextRequest) => {
    if (
        process.env.NODE_ENV === "production" &&
        request.nextUrl.searchParams.get("key") !== process.env.CRON_KEY
    ) {
        captureMessage("Invalid key");
        return new NextResponse("Invalid key", { status: 401 });
    }

    const generated = await gpt();

    const result = await email(generated as string);

    if (result instanceof Error) {
        return result;
    }

    return new NextResponse(result);
};

export const POST = async (request: NextRequest) => {
    if (
        process.env.NODE_ENV === "production" &&
        request.nextUrl.searchParams.get("key") !== process.env.CRON_KEY
    ) {
        captureMessage("Invalid key");
        return new NextResponse("Invalid key", { status: 401 });
    }

    const generated = await gpt();

    const result = await email(generated as string);

    if (result instanceof Error) {
        return result;
    }

    return new NextResponse(result);
};
