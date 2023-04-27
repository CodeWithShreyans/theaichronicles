import { Resend } from "resend";

export const error = async (...errors: any[]) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const errorString = errors.join("\n");

    await resend.sendEmail({
        from: "error@gptnl.shreyans.sh",
        to: "shreyans@shreyans.sh",
        subject: "GPTNL Error",
        text: String(errorString),
    });

    throw Error(errorString);
};
