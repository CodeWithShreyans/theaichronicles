import { NextRequest, NextResponse } from "next/server";

// import sendgrid from "@sendgrid/mail";
import { sendEmail } from "@/components/email";
import { s3Upload } from "@/lib/aws";
import { error } from "@/lib/error";

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
                        'You run a newsletter on the internet to showcase your abilities. Create an extremely creative, thought-evoking, mind-bogglingly interesting email for each day. Greet the reader as "human", and sign with GPT.  After the signature, end with a prompt to be given to an AI image generator to generate an interesting image with respect to the email\'s content; prefix it with "Prompt".',
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
    });

    if (!gptRes.ok) {
        await error("ChatGPT Error", gptRes.statusText);
    }

    const response = (await gptRes.json()) as OpenAI_Response;

    if (!response.error && response.choices) {
        console.log(response.choices[0]?.message.content);
        return response.choices[0]?.message.content;
    } else {
        await error(JSON.stringify(response.error));
    }
};

const email = async (email: string) => {
    // if (!process.env.SENDGRID_API_KEY) {
    //     throw new NextResponse("No Sendgrid API Key", { status: 500 });
    // }

    // sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

    // const exportLink = await fetch(
    //     "https://api.sendgrid.com/v3/marketing/contacts/exports",
    //     {
    //         method: "POST",
    //         headers: {
    //             Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    //         },
    //         body: JSON.stringify({
    //             list_ids: ["06c6ca80-fb80-4924-9d6d-5b5547053e7f"],
    //             file_type: "json",
    //         }),
    //     }
    // );

    // const anotherLink = await fetch(
    //     `https://api.sendgrid.com/v3/marketing/contacts/exports/67d74b4a-5575-4fac-95ed-b1af39b90deb`,
    //     {
    //         headers: {
    //             Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    //         },
    //     }
    // );

    // const recipients = await fetch((await anotherLink.json()).urls[0]);

    // console.log("recipients", await recipients.json());

    // const { subject, email } = createEmail(email);

    // const options: sendgrid.MailDataRequired = {
    //     from: "shreyans@shreyans.sh",
    //     to: "shreyansthebest2007@gmail.com",
    //     subject: subject,
    //     html: email,
    // };

    // sendgrid.send(options);

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
        }
    );

    if (!dalleRes.ok) {
        await error("Dall-E", dalleRes.statusText);
    }

    const image = (await dalleRes.json()) as Image;

    console.log(image);

    const imgLink = await s3Upload(image.data[0].url);

    const resendRes = await sendEmail(subject, body, prompt, imgLink);

    return resendRes;
};

export const GET = async (request: NextRequest) => {
    if (
        process.env.NODE_ENV === "production" &&
        request.nextUrl.searchParams.get("key") !== process.env.CRON_KEY
    ) {
        await error("Invalid key");
        return new NextResponse("Invalid key", { status: 401 });
    }

    const generated = await gpt();

    // const result = await email(
    //     "Subject: Day 1 - Unraveling the of Time 🌀⌛\n\nHello Human,\n\nWelcome to your first installment of our thought-provoking journey as we dive headfirst into the most mysterious of life's concepts: Time. With its enigmatic grip on our world, time can be a puzzling chord that begs untangling. As we further dissect its intricacies, we are met with astounding questions about our universe and everything within.\n\nIf you could pause the world for a moment, would you? What if you could stop time for 48 hours, leaving it standing still around you? Would this challenge the boundaries of morality, or perhaps the rules of our universe? Consider the implications of having the power to rewind, pause, and fast-forward time, just like a movie reel. The very nature of time itself might be far more relative than we often imagine.\n\nPonder the perception of time that varies with our age. As we grow older, does it feel like time speeds up? Are adults simply better equipped to absorb their experiences or is time just pulsating differently depending on the observer?\n\nNow, let us turn our gaze to the fabric of time, woven meticulously with each passing second. Research in physics suggests time is perceived only through the weak and inconsistent veil of human awareness; the cosmos might have several hidden layers of existence that escape our comprehension.\n\nUntil tomorrow, let time keep its secrets, unraveling them slowly as we journey further.\n\nYours in awe,\nGPT\n\nPrompt: Create an image depicting multiple dimensions of time, representing its stretch and impalpability."
    // );
    const result = await email(generated as string);

    // console.log(result);

    // return new NextResponse(JSON.stringify({ email, result }));
    return new NextResponse(result);
};
