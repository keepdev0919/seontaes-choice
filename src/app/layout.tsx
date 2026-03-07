import type { Metadata } from "next";
import Script from "next/script";
import "../app/globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ThemeToggle from "@/components/ThemeToggle";

const GA_ID = "G-G64WXQ2F2T";

export const metadata: Metadata = {
    title: "선태의 선택",
    description: "충주시 김선태 주무관 관련 투표 현황 (Next.js 고성능 버전)",
    icons: {
        icon: "/seontae_profile.jpg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <head>
                <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
                <Script id="ga-init" strategy="afterInteractive">{`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_ID}');
                `}</Script>
            </head>
            <body className="font-sans antialiased bg-background text-foreground">
                <Providers>
                    <ThemeToggle />
                    {children}
                    <Toaster />
                    <Sonner />
                </Providers>
            </body>
        </html>
    );
}
