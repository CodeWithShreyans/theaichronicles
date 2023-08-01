/* eslint-disable @typescript-eslint/ban-ts-comment */
import Email from "@/emails/nl"
import { captureMessage } from "@sentry/nextjs"
import { Resend } from "resend"
import kv from "upstash-kv"

// type RedisResponse = {
//     result: string[]
// }

const getEmails = async () => {
    // const redisRes = await fetch("https://heroic-koi-31101.upstash.io/keys/*", {
    //     headers: {
    //         Authorization: `Bearer ${process.env.UPSTASH_REST_API_URL}`,
    //     },
    //     cache: "no-cache",
    // })

    // if (!redisRes.ok) {
    //     throw new Error(captureMessage("Redis Error\n" + redisRes.statusText))
    // }

    // const emails = (await redisRes.json()) as RedisResponse

    const emails = await kv.lrange<string>("emails", 0, -1)

    console.log(emails)

    return emails
}

export const sendEmail = async (
    subject?: string,
    body?: string,
    prompt?: string,
    imageLink?: string
) => {
    const emails = await getEmails()

    const resend = new Resend(process.env.RESEND_API_KEY)

    const resendRes = await resend.sendEmail({
        from: "The AI Chronicles <daily@ai.shreyans.sh>",
        to: "shreyans@shreyans.sh",
        bcc: emails,
        reply_to: "shreyans@shreyans.sh",
        subject:
            subject ||
            "Unleash Your Mind: The secret door to untapped potential",
        react: (
            <Email
                subject={subject}
                imgLink={imageLink}
                prompt={prompt}
                body={body}
            />
        ),
    })

    console.log(resendRes)

    /* @ts-ignore Resend error check */
    if (resendRes.error) {
        /* @ts-ignore Resend error check */
        throw new Error(captureMessage("Resend Error\n", resendRes.error))
    }
    
    return resendRes.id as string
}
