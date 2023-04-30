import Script from "next/script";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <head>
                <Script
                    async
                    src="https://analytics.shreyans.sh/script.js"
                    data-website-id="1ca7d183-bded-4285-960d-dbe4ced70615"
                />
            </head>
            <body>{children}</body>
        </html>
    );
};

export const metadata = {
    title: "The AI Chronicles",
    category: "Newsletter",
    creator: "Shreyans Jain <shreyans@shreyans.sh",
    viewport: "width=device-width, initial-scale=1",
    description: "A newsletter curated by AI",
    referrer: "origin-when-cross-origin",
    metadataBase: new URL("https://ai.shreyans.sh"),
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://ai.shreyans.sh",
        title: "The AI Chronicles",
        description: "A newsletter curated by AI",
        siteName: "The AI Chronicles",
        countryName: "India",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

export default RootLayout;
