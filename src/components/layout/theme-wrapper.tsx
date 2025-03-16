"use client"

import { cn } from "@/lib/utils"
import { themeConfig } from "@/hooks/use-config"
import React from "react";

interface ThemeWrapperProps extends React.ComponentProps<"div"> {
    defaultTheme?: string
}

// Map font names to dynamic imports
const fontMap: Record<string, () => Promise<{ variable: string }>> = {
    inter: () => import("@/lib/fonts").then((m) => m.inter),
    poppins: () => import("@/lib/fonts").then((m) => m.poppins),
    roboto: () => import("@/lib/fonts").then((m) => m.roboto),
    montserrat: () => import("@/lib/fonts").then((m) => m.montserrat),
    inconsolata: () => import("@/lib/fonts").then((m) => m.inconsolata),
    noto_sans: () => import("@/lib/fonts").then((m) => m.noto_sans),
    trio: () => import("@/lib/fonts").then((m) => m.trio),
};

export function ThemeWrapper({ defaultTheme, children, className }: ThemeWrapperProps) {
    const [config] = themeConfig();
    const theme = defaultTheme || config.theme;
    const [fontVariable, setFontVariable] = React.useState<string>("");

    React.useEffect(() => {
        const loadFont = async () => {
            const font = config.font?.split('-')[1] || "inter";
            if (fontMap[font]) {
                const loadedFont = await fontMap[font]();
                setFontVariable(loadedFont.variable);
            }
        };
        loadFont();
    }, [config.font]);

    return (
        <div
            className={cn(`theme-${theme}`, "w-full", className, fontVariable)}
            style={
                {
                    "--radius": `${defaultTheme ? 0.5 : config.radius}rem`,
                    "fontFamily": `var(--${config.font})`,
                } as React.CSSProperties
            }
        >
            {children}
        </div>
    )
}