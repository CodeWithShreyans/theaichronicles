import kv from "upstash-kv"

export const GET = async () => {
    if (process.env.NODE_ENV === "production") return

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

    const data = await kv.lrange<object>("messages", 0, -1)

    console.log(
        (data[0] as { role: string; content: string }).content.replaceAll(
            "\n",
            "\\n"
        )
    )

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
