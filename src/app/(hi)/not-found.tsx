// import Link from "next/link"

import { Button } from "@/components/ui/button"

const NotFound = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-5xl">404 - Page Not Found</h1>
                <Button variant="link" asChild>
                    <a href="/">Return Home</a>
                </Button>
            </div>
        </div>
    )
}

export default NotFound
