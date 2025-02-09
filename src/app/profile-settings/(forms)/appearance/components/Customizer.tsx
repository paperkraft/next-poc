'use client'
import React from "react"
import { useTheme } from "next-themes"
import { themeConfig } from "@/hooks/use-config"
import { Button } from "@/components/ui/button"
import { CheckIcon, Moon, Repeat, Sun } from "lucide-react"
import { Label } from "recharts"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeWrapper } from "@/components/layout/theme-wrapper"
import { useMounted } from "@/hooks/use-mounted"
import { BaseColor, baseColors } from "@/registry/registry-base-colors"

export function Customizer() {
    const mounted = useMounted();
    const { setTheme: setMode, resolvedTheme: mode } = useTheme()
    const [config, setConfig] = themeConfig();

    const resetConfig = () => {
        setConfig({
            ...config,
            font: "font-inter",
            theme: "zinc",
            radius: 0.5,
        });
        setMode('light');
    };

    const handleThemeChange = (themeName: BaseColor['name']) => {
        setConfig({ ...config, theme: themeName });
    };

    const handleRadiusChange = (radiusValue: string) => {
        setConfig({ ...config, radius: parseFloat(radiusValue) });
    };

    return (
        <ThemeWrapper className="flex flex-col space-y-4 md:space-y-6">
            <div className="flex items-start pt-4 md:pt-0">
                <div className="space-y-1 pr-2">
                    <div className="font-semibold leading-none tracking-tight">
                        Theme Customizer
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Customize your components colors.
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto rounded-[0.5rem]" onClick={resetConfig}>
                    <Repeat />
                    <span className="sr-only">Reset</span>
                </Button>
            </div>
            <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
                <div className="space-y-1.5">
                    <Label className="text-xs">Color</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {baseColors.filter(({ name }) => !["stone", "gray", "neutral"].includes(name))
                            .map(({ name, label, activeColor }) => {
                                const isActive = config.theme === name

                                return mounted ? (
                                    <Button
                                        variant={"outline"}
                                        size="sm"
                                        key={name}
                                        onClick={() => handleThemeChange(name)}
                                        className={cn(
                                            "justify-start",
                                            isActive && "border-2 border-primary"
                                        )}
                                        style={
                                            {
                                                "--theme-primary": `hsl(${activeColor[mode === "dark" ? "dark" : "light"]})`,
                                            } as React.CSSProperties
                                        }
                                    >
                                        <span
                                            className={cn(
                                                "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
                                            )}
                                        >
                                            {isActive && <CheckIcon className="h-4 w-4 text-white" />}
                                        </span>
                                        {label}
                                    </Button>
                                ) : (
                                    <Skeleton className="h-8 w-full" key={name} />
                                )
                            })}
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs">Radius</Label>
                    <div className="grid grid-cols-5 gap-2">
                        {["0", "0.3", "0.5", "0.75", "1.0"].map((value) => {
                            return (
                                <Button
                                    variant={"outline"}
                                    size="sm"
                                    key={value}
                                    onClick={() => handleRadiusChange(value)}
                                    className={cn(config.radius === parseFloat(value) && "border-2 border-primary")}
                                >
                                    {value}
                                </Button>
                            )
                        })}
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs">Mode</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {mounted ? (
                            <>
                                <Button
                                    variant={"outline"}
                                    size="sm"
                                    onClick={() => setMode("light")}
                                    className={cn(mode === "light" && "border-2 border-primary")}
                                >
                                    <Sun className="mr-1 -translate-x-1" />
                                    Light
                                </Button>
                                <Button
                                    variant={"outline"}
                                    size="sm"
                                    onClick={() => setMode("dark")}
                                    className={cn(mode === "dark" && "border-2 border-primary")}
                                >
                                    <Moon className="mr-1 -translate-x-1" />
                                    Dark
                                </Button>
                            </>
                        ) : (
                            <>
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </ThemeWrapper>
    )
}