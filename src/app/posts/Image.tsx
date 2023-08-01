"use client"

import { Image as Unpic } from "@unpic/react/next"

import type { Post } from "./page"

const Image = ({ value }: { value: Post }) => (
    <Unpic
        src={value.image.url}
        alt={value.image.alt}
        width={512}
        height={512}
        className="m-2 rounded-lg"
    />
)

export default Image
