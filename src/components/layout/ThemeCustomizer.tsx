'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { BaseColor, baseColors } from "@/registry/registry-base-colors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { themeConfig } from "@/hooks/use-config";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckIcon, Monitor, Moon, PaletteIcon, Repeat, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeWrapper } from "@/components/layout/theme-wrapper";
import { useSidebar } from "@/components/ui/sidebar";

export default function ThemeCustomizer() {
    const mounted = useMounted();
    const { setOpen } = useSidebar();
    const { setTheme: setMode, resolvedTheme: mode, theme } = useTheme();
    const [config, setConfig] = themeConfig();

    const resetConfig = () => {
        setConfig({
            ...config,
            font: "font-inter",
            theme: "zinc",
            radius: 0.5,
            layout: 'vertical',
            content: 'wide'
        });
        setMode('light');
    };

    const handleThemeChange = (themeName: BaseColor['name']) => {
        setConfig({ ...config, theme: themeName });
    };

    const handleRadiusChange = (radiusValue: string) => {
        setConfig({ ...config, radius: parseFloat(radiusValue) });
    };

    const handleLayoutChange = (layout: string) => {
        setConfig({ ...config, layout });

        if (layout === "horizontal") {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }

    const handleContentChange = (content: string) => {
        setConfig({ ...config, content });
    }

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant={'ghost'} size="icon"><PaletteIcon className='!size-[18px]' /></Button>
                </SheetTrigger>
                <SheetContent>
                    <ThemeWrapper>
                        <SheetHeader>
                            <SheetTitle asChild className="text-md font-normal">
                                <div className="flex">
                                    <div>
                                        <p>Theme Customizer</p>
                                        <p className="text-muted-foreground text-xs">Customize & Preview in Real Time</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="ml-auto mr-4 rounded-[0.5rem]" onClick={resetConfig}>
                                        <Repeat />
                                        <span className="sr-only">Reset</span>
                                    </Button>
                                </div>
                            </SheetTitle>
                        </SheetHeader>

                        <Separator className="my-2"/>

                        <ScrollArea className="h-[calc(100vh-110px)]">
                            <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Primary Color</Label>
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
                                    <Label className="text-xs">Border Radius</Label>
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
                                                    className={cn(theme === "light" && "border-2 border-primary")}
                                                >
                                                    <Sun className="mr-1 -translate-x-1" />
                                                    Light
                                                </Button>
                                                <Button
                                                    variant={"outline"}
                                                    size="sm"
                                                    onClick={() => setMode("dark")}
                                                    className={cn(theme === "dark" && "border-2 border-primary")}
                                                >
                                                    <Moon className="mr-1 -translate-x-1" />
                                                    Dark
                                                </Button>
                                                <Button
                                                    variant={"outline"}
                                                    size="sm"
                                                    onClick={() => setMode("system")}
                                                    className={cn(theme === "system" && "border-2 border-primary")}
                                                >
                                                    <Monitor className="mr-1 -translate-x-1" />
                                                    System
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

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Layout</Label>
                                    <div className="flex gap-2">
                                        <div className="flex flex-col items-center gap-2">
                                            <Button variant={"outline"} asChild className={cn("w-32 h-24 p-2", { "border-2 border-primary": config.layout === "vertical" })} onClick={() => handleLayoutChange('vertical')}>
                                                <svg width="104" height="66" viewBox="0 0 104 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="104" height="66" rx="4" fill="currentColor" fill-opacity="0.02"></rect>
                                                    <path d="M0 4C0 1.79086 1.79086 0 4 0H27.4717V66H4C1.79086 66 0 64.2091 0 62V4Z" fill="currentColor" fill-opacity="0.08"></path>
                                                    <rect x="4.90625" y="23.8839" width="17.6604" height="2.78946" rx="1.39473" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="8.83008" y="5.88135" width="9.81132" height="9.70588" rx="2" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="4.90625" y="34.4382" width="17.6604" height="2.78946" rx="1.39473" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="4.90625" y="44.9923" width="17.6604" height="2.78946" rx="1.39473" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="4.90625" y="55.5463" width="17.6604" height="2.78946" rx="1.39473" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="32.1523" y="4.67169" width="64.7547" height="8.8" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="35.0781" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="78.248" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="84.1348" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="90.0215" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="57.0859" y="19.6134" width="40.2264" height="17.6" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="32.1523" y="19.6134" width="19.0455" height="17.6" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="32.1523" y="42.4545" width="65.1591" height="17.6" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                </svg>
                                            </Button>
                                            <Label className="text-xs">Vertical</Label>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <Button variant={"outline"} asChild className={cn("w-32 h-24 p-2", { "border-2 border-primary": config.layout === "horizontal" })} onClick={() => handleLayoutChange('horizontal')}>
                                                <svg width="104" height="66" viewBox="0 0 104 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="104" height="66" rx="4" fill="currentColor" fill-opacity="0.02"></rect>
                                                    <rect x="44.0068" y="19.6136" width="46.8212" height="17.6" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="14.9854" y="19.6136" width="22.1679" height="17.6" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="14.9854" y="42.4547" width="75.8413" height="17.6" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="14.9248" y="4.68896" width="74.1506" height="9.00999" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="20.0264" y="6.50403" width="6.00327" height="5.38019" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="33.877" y="7.96356" width="6.6372" height="2.46129" rx="1.23064" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="48.3652" y="7.96356" width="6.6372" height="2.46129" rx="1.23064" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="62.8506" y="7.96356" width="6.6372" height="2.46129" rx="1.23064" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="77.3379" y="7.96356" width="6.6372" height="2.46129" rx="1.23064" fill="currentColor" fill-opacity="0.3"></rect>
                                                </svg>
                                            </Button>
                                            <Label className="text-xs">Horizontal</Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Content</Label>
                                    <div className="flex gap-2">
                                        <div className="flex flex-col items-center gap-2">
                                            <Button variant={"outline"} asChild className={cn("w-32 h-24 p-2", { "border-2 border-primary": config.content === "wide" })} onClick={() => handleContentChange('wide')}>
                                                <svg width="104" height="66" viewBox="0 0 104 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="104" height="66" rx="4" fill="currentColor" fill-opacity="0.02"></rect>
                                                    <rect x="6.6875" y="4.67169" width="90.6244" height="8.8" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="10.165" y="6.87164" width="4.90566" height="4.4" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="75.2002" y="6.87164" width="4.90566" height="4.4" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="82.0674" y="6.87164" width="4.90566" height="4.4" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="88.9346" y="6.87164" width="4.90566" height="4.4" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="41.3652" y="19.6135" width="55.9476" height="17.6" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="6.6875" y="19.6135" width="26.4888" height="17.6" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="6.6875" y="42.4545" width="90.6244" height="17.6" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                </svg>
                                            </Button>
                                            <Label className="text-xs">Wide</Label>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <Button variant={"outline"} asChild className={cn("w-32 h-24 p-2", { "border-2 border-primary": config.content === "compact" })} onClick={() => handleContentChange('compact')}>
                                                <svg width="104" height="66" viewBox="0 0 104 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="104" height="66" rx="4" fill="currentColor" fill-opacity="0.02"></rect>
                                                    <rect x="19.4209" y="4.67169" width="64.7547" height="8.8" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="22.3447" y="6.87164" width="3.92453" height="4.4" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="65.5146" y="6.87164" width="3.92453" height="4.4" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="71.4014" y="6.87164" width="3.92453" height="4.4" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="77.2881" y="6.87164" width="3.92453" height="4.4" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
                                                    <rect x="44.3525" y="19.6135" width="40.2264" height="17.6" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="19.4209" y="19.6135" width="19.0455" height="17.6" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                    <rect x="19.4209" y="42.4545" width="65.1591" height="17.6" rx="2" fill="currentColor" fill-opacity="0.08"></rect>
                                                </svg>
                                            </Button>
                                            <Label className="text-xs">Compact</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    </ThemeWrapper>
                </SheetContent>
            </Sheet>
        </>
    );
}