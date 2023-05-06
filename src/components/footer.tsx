import Link from "next/link"
import { GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const Footer = () => {
    return (
        <footer className="animate-footer-up flex items-center justify-between">
            <div className="flex flex-col items-start justify-evenly">
                <div>
                    <Button variant="ghost" asChild>
                        <Link
                            href="https://github.com/destroyerxyz"
                            target="_blank"
                        >
                            <GithubIcon />
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link
                            href="https://www.linkedin.com/in/sjain07/"
                            target="_blank"
                        >
                            <LinkedinIcon />
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link
                            href="https://twitter.com/Destroyer_Xyz"
                            target="_blank"
                        >
                            <TwitterIcon />
                        </Link>
                    </Button>
                </div>
            </div>
            <p className="px-4">
                &copy; 2023{" "}
                <Link
                    href="https://shreyans.sh"
                    target="_blank"
                    className="hover:text-foreground/80 cursor-pointer"
                >
                    Shreyans Jain
                </Link>
            </p>
        </footer>
    )
}

export default Footer
