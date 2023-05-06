import type { NextRequest } from "next/server"

import { sendEmail } from "@/lib/email"

export const GET = (request: NextRequest) => {
    console.log(request.nextUrl.href)
    sendEmail()
}
