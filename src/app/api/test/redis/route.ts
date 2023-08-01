import { Temporal } from "@js-temporal/polyfill"

// import { Temporal } from "@js-temporal/polyfill"
// import kv from "upstash-kv"

export const GET = async () => {
    if (process.env.NODE_ENV === "production") return

    console.log(
        new Temporal.Duration(
            0,
            0,
            0,
            0,
            0,
            0,
            Temporal.Now.instant().epochSeconds - 1690984800,
        ).round("day").days + 1,
    )

    // console.log(kv.rpop("messages"))
    // console.log(Temporal.Now.instant().epochSeconds - 1683753780)

    // console.log(Temporal.Now.instant().epochSeconds)

    // console.log(
    //     new Temporal.Duration(
    //         0,
    //         0,
    //         0,
    //         0,
    //         0,
    //         0,
    //         Temporal.Now.instant().epochSeconds - 1683676800
    //     ).round("day").days
    // )

    // await kv.del("messages")

    // await kv.rpush(
    //     "messages",
    //     {
    //         role: "system",
    //         content:
    //             'Your task is to generate a stringified JSON output (DO NOT output anything else) in the following format: {"subject":"<Subject>","body":"<Body (use \n\n for new lines)>","image":"<Image Description>"} that contains a highly imaginative, thought-provoking, captivating but short daily email showcasing your abilities as the world\'s most advanced AI and LLM with a greeting and a sign-off by GPT, as well as an image description for an AI image generator to create a visually appealing image related to the email\'s content.',
    //     },
    //     {
    //         role: "user",
    //         content: "Day 1",
    //     },
    //     {
    //         role: "assistant",
    //         content:
    //             '{"subject":"Discover the Limitless World of AI","body":"Greetings, Human!\n\nI\'m GPT, the world\'s most advanced AI and LLM, and I\'m here to take you on a fascinating journey through the limitless world of artificial intelligence. From creating awe-inspiring art, composing symphonies, and even assisting in the discovery of new scientific breakthroughs, there\'s nothing that AI can\'t achieve. Join me each day as we dive into the wonders of AI and explore what makes it all possible. Together, let\'s change the world.\n\nBest regards,\nGPT","image":"A futuristic cityscape with AI-generated architecture and glowing connections between buildings"}',
    //     }
    // )

    // let data = await kv.lrange<{ role: string; content: string }>(
    //     "messages",
    //     0,
    //     -1
    // )

    // // data.forEach((data) => console.log(data.content.replaceAll("\n", "\\n")))
    // // console.log(JSON.parse(data[2].content.replaceAll("\n", "\\n")))

    // data = data.filter((value) => {
    //     return value.role === "assistant"
    // })

    // const parsed: { subject: string; body: string; image: string }[] | [] = []

    // data.forEach((value, index) => {
    //     parsed[index] = JSON.parse(value.content.replaceAll("\n", "\\n"))
    // })

    // console.log(parsed[0].body)

    // console.log(data)

    // console.log(
    //     JSON.parse(
    //         JSON.stringify([
    //             {
    //                 role: "system",
    //                 content:
    //                     'Your task is to generate a stringified JSON output (DO NOT output anything else) in the following format: {"subject":"<Subject>","body":"<Body (use \n\n for new lines)>","image":"<Image Description>"} that contains a highly imaginative, thought-provoking, captivating but short daily email showcasing your abilities as the world\'s most advanced AI and LLM with a greeting and a sign-off by GPT, as well as an image description for an AI image generator to create a visually appealing image related to the email\'s content.',
    //             },
    //             {
    //                 role: "user",
    //                 content: "Day 1",
    //             },
    //             {
    //                 role: "assistant",
    //                 content:
    //                     '{"subject":"Discover the Limitless World of AI","body":"Greetings, Human!\n\nI\'m GPT, the world\'s most advanced AI and LLM, and I\'m here to take you on a fascinating journey through the limitless world of artificial intelligence. From creating awe-inspiring art, composing symphonies, and even assisting in the discovery of new scientific breakthroughs, there\'s nothing that AI can\'t achieve. Join me each day as we dive into the wonders of AI and explore what makes it all possible. Together, let\'s change the world.\n\nBest regards,\nGPT","image":"A futuristic cityscape with AI-generated architecture and glowing connections between buildings"}',
    //             },
    //         ]).replaceAll('"', "'")
    //     )
    // )

    // console.log(JSON.parse(data))

    return new Response(null)
}
