import { randomUUID } from "crypto"
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { captureException } from "@sentry/nextjs"
import { Client } from "minio"

// const client = new S3Client({
//     region: "auto",
//     endpoint: process.env.R2_ENDPOINT,
//     credentials: {
//         accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
//         secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
//     },
// })

const newClient = new Client({
    region: "auto",
    endPoint: process.env.R2_ENDPOINT as string,
    accessKey: process.env.R2_ACCESS_KEY_ID as string,
    secretKey: process.env.R2_SECRET_ACCESS_KEY as string,
    useSSL: true,
})

export const imageUpload = async (link: string) => {
    const image = await fetch(link, {
        cache: "no-cache",
    })
    const buffer = Buffer.from(await image.arrayBuffer())

    const key = randomUUID() + ".png"

    // const command = new PutObjectCommand({
    //     Bucket: "theaichronicles",
    //     Key: key,
    //     Body: buffer,
    // })

    try {
        // const response = await client.send(command)

        const response = await newClient.putObject(
            "theaichronicles",
            key,
            buffer
        )

        console.log(response, `https://images.ai.shreyans.sh/${key}`)
        return `https://images.ai.shreyans.sh/${key}`
    } catch (err) {
        throw new Error(captureException(err))
    }
}
