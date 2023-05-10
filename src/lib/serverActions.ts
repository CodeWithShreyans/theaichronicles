// "use server"

// import { captureMessage } from "@sentry/nextjs"
// import kv from "upstash-kv"
// import { z } from "zod"

// export const subscribe = async (data: FormData) => {
//     const email = data.get("email")?.toString()

//     if (!z.string().email().safeParse(email).success) {
//         captureMessage("Invalid email\n")
//         return new Response(null, {
//             status: 400,
//             statusText: "Invalid email",
//         })
//     }

//     await kv.lrem("emails", 0, email)
//     const set = await kv.rpushx("emails")
//     // const redisRes = await fetch(
//     //     `https://heroic-koi-31101.upstash.io/set/${
//     //         (
//     //             await req.json()
//     //         ).email
//     //     }/null`,
//     //     {
//     //         headers: {
//     //             Authorization: `Bearer ${process.env.UPSTASH_REST_API_URL}`,
//     //         },
//     //         cache: "no-cache",
//     //     }
//     // )

//     if (!set) {
//         throw new Error(captureMessage("Redis Error\n"))
//     }

//     return new Response(null, {
//         status: 204,
//         statusText: "OK",
//     })
// }
