import type { Metadata } from "next";
import "../app/globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
    title: "선태의 선택",
    description: "충주시 김선태 주무관 관련 투표 현황 (Next.js 고성능 버전)",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" suppressHydrationWarning>
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
