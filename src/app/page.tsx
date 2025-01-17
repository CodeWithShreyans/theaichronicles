import { Badge } from "@/components/ui/badge"

const Home = () => {
    return (
        <main className="flex max-w-3xl animate-landing-title items-center justify-between sm:shrink-0">
            <div className="flex flex-col gap-2">
                <h1 className="mt-2 align-top text-5xl font-bold leading-[42px] tracking-[-0.64px] max-[345px]:text-4xl min-[510px]:text-7xl sm:leading-[68px] sm:tracking-[-0.896px]">
                    A Newsletter <br /> Curated by AI
                </h1>
                <Badge className="self-center" variant="destructive">
                    Archived
                </Badge>
            </div>
        </main>
    )
}

export default Home
