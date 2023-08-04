"use client"

import { useState } from "react"
import { captureMessage } from "@sentry/nextjs"
import { ArrowRightIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "./ui/use-toast"

const Form = () => {
    const [formState, setFormState] = useState<
        "idle" | "loading" | "submitted" | "error"
    >("idle")

    const { toast } = useToast()
    return (
        <form
            className="flex w-full max-w-sm items-center gap-1 sm:gap-2"
            onSubmit={(e) => {
                e.preventDefault()
                setFormState("loading")
                fetch("/api/subscribe", {
                    method: "POST",
                    body: JSON.stringify({
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        email: e.target.email.value as string,
                    }),
                }).then((res) => {
                    if (res.ok) {
                        setFormState("submitted")
                        toast({
                            description: "You're successfully subscribed!",
                            variant: "success",
                        })
                    } else {
                        setFormState("error")
                        throw Error(
                            captureMessage(
                                `${res.status} + ${res.statusText}}`,
                            ),
                        )
                    }
                })

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                e.target.reset()
            }}
        >
            <Input
                name="email"
                type="email"
                placeholder="rick@example.com"
                pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$"
                required
                autoFocus
                disabled={formState === "loading" || formState === "submitted"}
                className={
                    formState === "error"
                        ? "ring-2 ring-red-600"
                        : formState === "submitted"
                        ? "ring-2 ring-green-600"
                        : ""
                }
            />
            <Button
                type="submit"
                disabled={formState === "loading" || formState === "submitted"}
                className={
                    formState === "submitted"
                        ? "bg-green-600 text-destructive-foreground"
                        : formState === "error"
                        ? "bg-red-600 text-destructive-foreground"
                        : ""
                }
            >
                {formState === "loading" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <ArrowRightIcon />
                )}
            </Button>
        </form>
    )
}

export default Form
