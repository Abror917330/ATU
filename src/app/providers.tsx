"use client";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // Sayt to'liq yuklanguncha kutamiz (Hydration error bermasligi uchun)
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
            {children}
        </ThemeProvider>
    );
}
