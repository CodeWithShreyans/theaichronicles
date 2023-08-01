import Link from "next/link"

import { Button } from "@/components/ui/button"
import Form from "./headerForm"

const Header = () => {
    return (
        <header className="mb-4 flex animate-down flex-col items-center justify-between gap-4 sm:h-24 sm:flex-row">
            <Link href="/">
                <svg
                    strokeMiterlimit="10"
                    style={{
                        fillRule: "nonzero",
                        clipRule: "evenodd",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                    }}
                    version="1.1"
                    viewBox="0 0 1155 1000"
                    xmlSpace="preserve"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    className="h-12"
                >
                    <defs />
                    <g>
                        <path
                            d="M577.344 1000L1154.69 0L0 0L577.344 1000Z"
                            className="fill-foreground"
                            fillRule="nonzero"
                            opacity="1"
                            stroke="none"
                        />
                    </g>
                </svg>
            </Link>
            <div className="flex flex-col items-center gap-2 sm:flex-row">
                <Button variant="link" asChild>
                    <Link href="/posts">Posts</Link>
                </Button>
                <Form />
            </div>
        </header>
    )
}

export default Header
