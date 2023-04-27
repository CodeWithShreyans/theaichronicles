import { error } from "@/lib/error";
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
} from "@react-email/components";
import { Resend, type ErrorResponse } from "resend";

type RedisResponse = {
    result: string[];
};

const Email = ({
    subject,
    body,
    prompt,
    imgLink,
}: {
    subject: string;
    body: string;
    prompt: string;
    imgLink: string;
}) => {
    return (
        <Html>
            <Head>
                <title>{subject}</title>
                {/* <Font
                        fontFamily="Roboto"
                        fallbackFontFamily="Helvetica"
                        fontWeight={500}
                        fontStyle="normal"
                        webFont={{
                            url: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                            format: "woff2",
                        }}
                    /> */}
                <link
                    href="https://fonts.googleapis.com/css?family=Roboto:wght@500"
                    rel="stylesheet"
                />
            </Head>

            <Tailwind>
                <Body
                    className="bg-black p-8 bg-[#05050a] font-['Roboto, Helvetica'] font-normal rounded"
                    // style={{
                    //     fontFamily: "Roboto, Helvetica",
                    //     fontWeight: 500,
                    // }}
                >
                    <Section>
                        <Img
                            // src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-v22yy6BsFE1jFUgJcHN8m0Af/user-FrURj5n0QOLx4T3dNim7Mowg/img-ZO27FHWo8HlRBRoVBziAQdVi.png?st=2023-04-25T18%3A26%3A58Z&se=2023-04-25T20%3A26%3A58Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-25T19%3A26%3A36Z&ske=2023-04-26T19%3A26%3A36Z&sks=b&skv=2021-08-06&sig=U%2BnYXd1lRmrTjKS/ypycrnPa05opw8cgVH1ZPo2oyhU%3D"
                            src={imgLink}
                            alt={prompt}
                            width={512}
                            height={512}
                            className="m-auto display-block mb-8 rounded-lg"
                            // style={{ borderRadius: "0.5rem" }}
                        />
                        <Hr />
                        <Text className="px-4 pt-4 text-xl text-white/[.925]">
                            {body.split("\r\n").map((line) => {
                                return (
                                    <>
                                        {line}
                                        <br />
                                    </>
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
                                Agra, India
                            </Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    );
};

export const sendEmail = async (
    subject: string,
    body: string,
    prompt: string,
    imgLink: string
) => {
    const redisRes = await fetch("https://heroic-koi-31101.upstash.io/keys/*", {
        headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: "no-cache",
    });

    const emails = (await redisRes.json()) as RedisResponse;

    console.log(emails);

    if (!redisRes.ok) {
        error("Failed to fetch emails from redis\n" + redisRes.statusText);
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const resendRes = await resend.sendEmail({
        from: "daily@gptnl.shreyans.sh",
        to: emails.result,
        subject: subject,
        react: (
            <Email
                subject={subject}
                imgLink={imgLink}
                prompt={prompt}
                body={body}
            />
        ),
    });

    console.log(resendRes);

    /* @ts-ignore Resend error check */
    if (resendRes.error) {
        /* @ts-ignore Resend error check */
        error("Resend", resendRes.error);
    }

    /* @ts-ignore Resend error check */
    return resendRes.id as string;
};
