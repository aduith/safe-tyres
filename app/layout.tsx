import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "SafeTyres | Premium Tyre Anti-Puncture Solutions",
    description: "Advanced liquid protection for your tyres. Prevent punctures, enhance safety, and extend tyre life with SafeTyres.",
    icons: {
        icon: "/icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
