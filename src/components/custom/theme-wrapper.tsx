"use client";
import { cn } from "@/lib/utils";
import { themeConfig } from "@/hooks/use-config";
import {
  inconsolata,
  inter,
  montserrat,
  noto_sans,
  poppins,
  roboto,
  trio,
} from "@/lib/fonts";
import { getLightValues } from "@/utils";

interface ThemeWrapperProps extends React.ComponentProps<"section"> {
  defaultTheme?: string;
}

export default function ThemeWrapper({
  defaultTheme,
  children,
  className,
}: ThemeWrapperProps) {
  const [config] = themeConfig();
  const val = getLightValues(config.theme);
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  if (themeColorMeta) {
    // If the meta tag exists, update its content
    themeColorMeta.setAttribute("content", `hsl(${val})`);
  } else {
    // If it doesn't exist, create it
    const newMeta = document.createElement("meta");
    newMeta.setAttribute("name", "theme-color");
    newMeta.setAttribute("content", `hsl(${val})`);
    document.head.appendChild(newMeta);
  }
  
  return (
    <section
      className={cn("w-full", className, `
        theme-${config.theme}
        ${inter.variable} 
        ${roboto.variable} 
        ${inconsolata.variable} 
        ${montserrat.variable} 
        ${noto_sans.variable} 
        ${trio.variable} 
        ${poppins.variable}`
      )}
      style={
        {
          "--radius": `${defaultTheme ? 0.5 : config.radius}rem`,
          fontFamily: `var(--${config.font})`,
        } as React.CSSProperties
      }
    >
      {children}
    </section>
  );
}
