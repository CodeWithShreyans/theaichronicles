/* eslint-disable jsx-a11y/alt-text */
// import { Fragment, Suspense } from "react"
import { Temporal } from "@js-temporal/polyfill"
import { createClient } from "@sanity/client"
import { Balancer } from "react-wrap-balancer"

// import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "./Image"

export type Post = {
    _rev: string
    _type: string
    body: string[]
    title: string
    image: { url: string; alt: string }
    publishedAt: string
    _createdAt: string
    _id: string
    _updatedAt: string
}

const PostsPage = async () => {
    const sanityClient = createClient({
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: "production",
        useCdn: true,
        apiVersion: Temporal.Now.plainDateISO("UTC").toString(),
    })

    const posts: Post[] = await sanityClient.fetch(
        '*[_type == "post"] | order(publishedAt desc)',
    )

    return (
        <main className="flex animate-up flex-col items-center justify-center gap-8">
            {posts.map((value, index) => {
                return (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center rounded-xl bg-secondary p-6 text-start text-secondary-foreground"
                    >
                        <div className="text-center">
                            <h1 className="m-2 text-2xl font-bold">
                                {value.title}
                            </h1>
                            <p className="">
                                {Temporal.PlainDate.from(
                                    value.publishedAt,
                                ).toLocaleString(undefined, {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                        <Separator className="m-4" />

                        <Image value={value} />
                        {/* <img src={value.image.url} alt={value.image.alt} /> */}
                        <text className="mx-12 my-4 flex flex-col gap-4 text-lg">
                            {value.body.map((value, index) => (
                                <p key={index}>
                                    <Balancer ratio={0.32}>{value}</Balancer>
                                </p>
                            ))}
                        </text>
                    </div>
                )
            })}
        </main>
    )
}

export default PostsPage
