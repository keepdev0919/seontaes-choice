import type { Metadata } from "next";
import Script from "next/script";
import "../app/globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ThemeToggle from "@/components/ThemeToggle";
import JsonLd from "@/components/JsonLd";
import ChatRoom from "@/components/ChatRoom";

const GA_ID = "G-G64WXQ2F2T";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://seontaes-choice.vercel.app";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "선태의 선택 | 김선태 브랜드 협찬 실시간 투표",
        template: "%s | 선태의 선택",
    },
    description:
        "충주맨 유튜버 김선태가 선택할 첫 번째 광고주는? 유튜브 댓글 기반 실시간 투표로 브랜드 협찬 순위를 확인하세요.",
    keywords: [
        "김선태",
        "선태의 선택",
        "충주시 김선태",
        "충주맨",
        "김선태 투표",
        "김선태 광고주",
        "김선태 협찬",
        "충주 유튜버",
        "브랜드 투표",
        "김선태 선택",
    ],
    authors: [{ name: "선태의 선택" }],
    creator: "선태의 선택",
    publisher: "선태의 선택",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: SITE_URL,
        siteName: "선태의 선택",
        title: "선태의 선택 | 김선태 브랜드 협찬 실시간 투표",
        description:
            "충주맨 유튜버 김선태가 선택할 첫 번째 광고주는? 실시간 투표로 순위를 확인하세요.",
        images: [
            {
                url: "/opengraph-image.png",
                width: 1200,
                height: 630,
                alt: "선태의 선택 - 김선태 브랜드 협찬 실시간 투표",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "선태의 선택 | 김선태 브랜드 협찬 실시간 투표",
        description:
            "충주맨 유튜버 김선태가 선택할 첫 번째 광고주는? 실시간 투표로 순위를 확인하세요.",
        images: ["/opengraph-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/seontae_profile.jpg",
        apple: "/seontae_profile.jpg",
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
                <JsonLd />
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
                    <ChatRoom />
                </Providers>
            </body>
        </html>
    );
}
