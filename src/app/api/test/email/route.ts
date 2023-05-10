import type { NextRequest } from "next/server"

import { sendEmail } from "@/lib/email"

export const GET = (request: NextRequest) => {
    if (process.env.NODE_ENV === "production") return
    console.log(request.nextUrl.href)
    sendEmail()
}
