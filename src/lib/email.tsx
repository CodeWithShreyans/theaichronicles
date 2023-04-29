import { captureMessage } from "@sentry/nextjs";
import { Resend } from "resend";
import Email from "@/emails/nl";

type RedisResponse = {
    result: string[];
};

export const sendEmail = async (
    subject?: string,
    body?: string,
    prompt?: string,
    imgLink?: string
) => {
    const redisRes = await fetch("https://heroic-koi-31101.upstash.io/keys/*", {
        headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: "no-cache",
    });

    if (!redisRes.ok) {
        return new Error(captureMessage("Redis Error\n" + redisRes.statusText));
    }

    const emails = (await redisRes.json()) as RedisResponse;

    console.log(emails);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const resendRes = await resend.sendEmail({
        from: "The AI Chronicles <daily@shreyans.sh>",
        to: "shreyans@shreyans.sh",
        bcc: emails.result,
        reply_to: "shreyans@shreyans.sh",
        subject:
            subject ||
            "Unleash Your Mind: The secret door to untapped potential",
        react: (
            <Email
                subject={subject}
                imgLink={imgLink}
                prompt={prompt}
                body={body}
            />
        ),
    });

    console.log(resendRes);

    /* @ts-ignore Resend error check */
    if (resendRes.error) {
        /* @ts-ignore Resend error check */
        return new Error(captureMessage("Resend Error\n", resendRes.error));
    }

    /* @ts-ignore Resend error check */
    return resendRes.id as string;
};
