"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        setIsDark(saved ? saved === "dark" : true);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark, mounted]);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur-sm transition-all hover:scale-110 hover:bg-card md:right-6 md:top-6"
            title={isDark ? "라이트 모드" : "다크 모드"}
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
                <Moon className="h-5 w-5 text-slate-600" />
            )}
        </button>
    );
};

export default ThemeToggle;
