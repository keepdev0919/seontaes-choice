"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    {children}
                </TooltipProvider>
            </QueryClientProvider>
        </NextThemesProvider>
    );
}
