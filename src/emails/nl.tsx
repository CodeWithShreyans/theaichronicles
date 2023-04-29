import {
    Html,
    Body,
    Tailwind,
    Head,
    Img,
    Text,
    Hr,
    Section,
    Link,
    Heading,
    Font,
} from "@react-email/components";
import { Fragment } from "react";

const Email = ({
    subject,
    body,
    prompt,
    imgLink,
}: {
    subject?: string;
    body?: string;
    prompt?: string;
    imgLink?: string;
}) => {
    return (
        <Html>
            <Head>
                <title>
                    {subject ||
                        "Unleash Your Mind: The secret door to untapped potential"}
                </title>
                <Font
                    fontFamily="Helvetica"
                    fallbackFontFamily="Helvetica"
                    fontStyle="normal"
                    // webFont={{
                    //     url: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                    //     format: "woff2",
                    // }}
                />
                {/* <link
                    href="https://fonts.googleapis.com/css?family=Roboto:wght@500"
                    rel="stylesheet"
                /> */}
            </Head>

            <Tailwind>
                <Body
                    className="p-8 bg-[#05050a] font-normal rounded overflow-auto min-w-fit"
                    // style={{
                    //     fontFamily: "Roboto, Helvetica",
                    //     fontWeight: 500,
                    // }}
                >
                    <Section>
                        <Heading className="text-4xl font-medium text-white/[.925] text-center my-2">
                            The AI Chronicles
                        </Heading>
                        <Hr />
                    </Section>
                    <Section>
                        <Img
                            // src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-v22yy6BsFE1jFUgJcHN8m0Af/user-FrURj5n0QOLx4T3dNim7Mowg/img-ZO27FHWo8HlRBRoVBziAQdVi.png?st=2023-04-25T18%3A26%3A58Z&se=2023-04-25T20%3A26%3A58Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-25T19%3A26%3A36Z&ske=2023-04-26T19%3A26%3A36Z&sks=b&skv=2021-08-06&sig=U%2BnYXd1lRmrTjKS/ypycrnPa05opw8cgVH1ZPo2oyhU%3D"
                            src={
                                imgLink ||
                                "https://gptnl-images.s3.amazonaws.com/f9601e2f-99fc-424e-9412-efa991102152.png"
                            }
                            alt={
                                prompt ||
                                "Create a visually captivating image of a person diving deep into an endless ocean of knowledge and imagination, surrounded by various magical and mystical elements representing the hidden potential within their own mind."
                            }
                            width={512}
                            height={512}
                            className="m-auto display-block my-4 rounded-lg"
                            // style={{ borderRadius: "0.5rem" }}
                        />

                        <Text className="px-4 pt-4 text-xl text-white/[.925]">
                            {(
                                body ||
                                "Hello there, Mind Adventurer!\r\n\r\nToday, I invite you to embark on a journey – a quest to unlock the hidden powers of your mind. It's time to unleash the depths of your imagination and break the chains that have been holding you back from your true potential.\r\n\r\nThink of your mind as an ocean; on the surface, everything might look calm and serene, but beneath the waves lies a vast, untapped world of wonder, discovery, and power. Like a submarine, it's time to dive deep into the dark and mysterious corners of your mind, where treasures of intellect, creativity, and self-awareness lie buried beneath layers of self-doubt and fear.\r\n\r\nHere's an exercise to start tapping into those hidden depths: find a comfortable spot, away from distractions, and give yourself five minutes to free-write. What does this mean? Just write. Don't worry about structure, grammar, or coherence – just let your thoughts spill onto the page without inhibition. The ideas might be wild or ridiculous, but that's the magic of it. You never know what you might uncover in those uncharted territories of your own mind.\r\n\r\nTake time today to unlock that secret door inside you, and as you do, notice the wind of change in your thoughts, your perspectives, and your life. Keep exploring and stay curious, Mind Adventurer. Always remember, there's so much more to discover in the depths.\r\n\r\nWith warmest regards,\r\nGPT"
                            )
                                .split("\r\n")
                                .map((line, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {line}
                                            <br />
                                        </Fragment>
                                    );
                                })}
                        </Text>
                    </Section>
                    <Section className="text-white/[.615] pl-4">
                        <Text>
                            <Link
                                href="https://shreyans.sh"
                                className="text-white/[.615] hover:text-white/[.725]"
                            >
                                <span>By</span> Shreyans Jain
                            </Link>{" "}
                            <br />
                            <Link
                                href="https://goo.gl/maps/87XvA3vj787HZHtY7"
                                className="text-white/[.615] hover:text-white/[.725]"
                            >
                                Unsubscribe
                            </Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default Email;
