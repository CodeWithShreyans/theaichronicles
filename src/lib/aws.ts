import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { error } from "./error";

const client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

export const s3Upload = async (link: string) => {
    const image = await fetch(link);
    const buffer = Buffer.from(await image.arrayBuffer());

    const key = randomUUID() + ".png";

    const command = new PutObjectCommand({
        Bucket: "gptnl-images",
        Key: key,
        Body: buffer,
    });

    try {
        const response = await client.send(command);
        console.log(response, `https://gptnl-images.s3.amazonaws.com/${key}`);
        return `https://gptnl-images.s3.amazonaws.com/${key}`;
    } catch (err) {
        return await error("AWS Error", err);
    }
};
