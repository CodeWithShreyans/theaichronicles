import type { NextRequest } from "next/server"
import { captureMessage } from "@sentry/nextjs"

export const POST = async (req: NextRequest) => {
    const redisRes = await fetch(
        `https://heroic-koi-31101.upstash.io/set/${
            (
                await req.json()
            ).email
        }/null`,
        {
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
            },
            cache: "no-cache",
        }
    )

    if (!redisRes.ok) {
        throw new Error(captureMessage("Redis Error\n" + redisRes.statusText))
    }

    return new Response(null, {
        status: 204,
        statusText: "OK",
    })
}
