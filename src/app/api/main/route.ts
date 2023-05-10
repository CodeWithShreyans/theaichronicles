import { NextResponse, type NextRequest } from "next/server"
import { Temporal } from "@js-temporal/polyfill"
import { createClient } from "@sanity/client"
import { captureMessage } from "@sentry/nextjs"
import kv from "upstash-kv"

import { sendEmail } from "@/lib/email"
import { imageUpload } from "@/lib/r2"

type OpenAI_Response = {
    error?: {
        message: string
        type: string
        param: string | null
        code: number | null
    }
    id?: string
    object?: string
    created?: number
    model?: string
    choices?: {
        message: { role: string; content: string }
        finish_reason: string
        index: number
    }[]
}

type Image = {
    created: number
    data: {
        url: string
    }[]
}

let messagesArr: {
    role: string
    content: string
}[]

export const GET = async (request: NextRequest) => {
    if (
        process.env.NODE_ENV === "production" &&
        request.nextUrl.searchParams.get("key") !== process.env.CRON_KEY
    ) {
        captureMessage("Invalid key")
        return new NextResponse("Invalid key", { status: 401 })
    }

    const generated = await gpt()

    const { subject, body, prompt } = extractData(generated)

    const image = await dallE(prompt)

    const imageLink = await imageUpload(image.data[0].url)

    const emailResult = await email(subject, body, prompt, imageLink)

    const postResult = await post(subject, body, prompt, imageLink)

    kv.set("messages", JSON.stringify(messagesArr))

    return new NextResponse(JSON.stringify({ emailResult, postResult }))
}

export const POST = GET

const gpt = async () => {
    const messages = (await kv.get("messages")) as string
    messagesArr = JSON.parse(messages) as {
        role: string
        content: string
    }[]
    messagesArr.push({
        role: "user",
        content: `Day 2`,
    })

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4",
            // messages: [
            //     {
            //         role: "system",
            //         content:
            //             'As the owner of an online newsletter, your task is to produce daily emails that are highly imaginative, thought-provoking, and captivating, and show off your abilities and strengths. Something new and different everyday. Each email should start with a subject line prefixed with "Subject" followed by a unique and engaging greeting, and signed off with "GPT". Additionally, include a prompt for an AI image generator to create a visually appealing image related to the email\'s content, prefixed with "Prompt".',
            //     },
            //     {
            //         role: "user",
            //         content: `Day ${
            //             Math.round(
            //                 Math.abs(
            //                     (Number(process.env.FIRST_DAY) -
            //                         new Date().getTime()) /
            //                         86400000
            //                 )
            //             ) + 1
            //         }`,
            //     },
            // ],
            messages: messagesArr,
            temperature: 0.8,
            top_p: 1,
            n: 1,
        }),
        cache: "no-cache",
    })

    console.log(
        "Day",
        Math.round(
            Math.abs(
                (Number(process.env.FIRST_DAY) - new Date().getTime()) /
                    86400000
            )
        ) + 1
    )

    if (!gptRes.ok) {
        throw new Error(
            captureMessage("ChatGPT Fetch Error\n" + gptRes.statusText)
        )
    }

    const response = (await gptRes.json()) as OpenAI_Response

    if (!response.error && response.choices) {
        console.log(response.choices[0]?.message)
        return response.choices[0]?.message.content
    } else {
        throw new Error(
            captureMessage(
                "ChatGPT Response Error\n" + JSON.stringify(response.error)
            )
        )
    }
}

const extractData = (generated: string) => {
    const json = JSON.parse(generated) as {
        subject: string
        body: string
        image: string
    }

    const subject = json.subject
    const body = json.body.replaceAll("\n", "\r\n")
    const prompt = json.image

    return { subject, body, prompt }
}

const dallE = async (prompt: string) => {
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
    )

    if (!dalleRes.ok) {
        throw new Error(captureMessage("Dall-E Error\n" + dalleRes.statusText))
    }

    const image = (await dalleRes.json()) as Image

    console.log(image)

    return image
}

const email = async (
    subject: string,
    body: string,
    prompt: string,
    imageLink: string
) => {
    const resendRes = await sendEmail(subject, body, prompt, imageLink)

    return resendRes
}

const post = async (
    subject: string,
    body: string,
    prompt: string,
    imageLink: string
) => {
    const client = createClient({
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: "production",
        useCdn: true,
        apiVersion: Temporal.Now.plainDateISO("UTC").toString(),
        token: process.env.SANITY_TOKEN,
    })

    const bodyArr = body.split("\r\n")

    bodyArr.filter((line, index) => {
        if (line === "") {
            bodyArr.splice(index, 1)
        }
    })

    const result = await client.create({
        _type: "post",
        title: subject,
        image: { url: imageLink, alt: prompt },
        publishedAt: Temporal.Now.plainDateTimeISO("UTC").toString(),
        body: bodyArr,
    })

    console.log(result)

    return result
}
