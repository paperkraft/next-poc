'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { baseColors } from "@/registry/registry-base-colors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { ThemeConfig, themeConfig } from "@/hooks/use-config";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckIcon, Monitor, Moon, PaletteIcon, Repeat, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeWrapper } from "@/components/layout/theme-wrapper";
import { useSidebar } from "@/components/ui/sidebar";
import { setUserLocale } from "@/services/locale";
import { CollapsedLayoutIcon, CompactContentIcon, HorizontalLayoutIcon, VerticalLayoutIcon, WideContentIcon } from "@/lib/layout-icons";
import { useMemo } from "react";

type OptionButtonProps = {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    asChild?: boolean;
};

const OptionButton = ({ isActive, onClick, children, className, asChild = false }: OptionButtonProps) => (
    <Button variant="outline" size="sm" onClick={onClick} asChild={asChild}
        className={cn(isActive && "border-2 border-primary", className)}
    >
        {children}
    </Button>
)

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
            content: 'wide',
            lang: "en",
        });
        setMode('light');
        setOpen(true);
        setUserLocale("en");
    };

    const handleChange = (key: keyof ThemeConfig, value: any) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
        if (key === "layout") {
            setOpen(value === "vertical" || value === "dual-menu");
        }
    };

    const filteredColors = useMemo(() => baseColors.filter(({ name }) => !["stone", "gray", "neutral"].includes(name)), []);

    const layouts = [
        { key: 'vertical', label: 'Vertical', icon: VerticalLayoutIcon },
        { key: 'horizontal', label: 'Horizontal', icon: HorizontalLayoutIcon },
        { key: 'collapsed', label: 'Collapsed', icon: CollapsedLayoutIcon },
        { key: 'dual-menu', label: 'Dual Menu', icon: CollapsedLayoutIcon },
    ];

    const content = [
        { key: 'wide', label: 'Wide', icon: WideContentIcon },
        { key: 'compact', label: 'Compact', icon: CompactContentIcon },
    ];

    const layout = [
        {
            label: "Layout",
            options: [
                { key: 'vertical', label: 'Vertical', icon: VerticalLayoutIcon },
                { key: 'horizontal', label: 'Horizontal', icon: HorizontalLayoutIcon },
                { key: 'collapsed', label: 'Collapsed', icon: CollapsedLayoutIcon },
                { key: 'dual-menu', label: 'Dual Menu', icon: CollapsedLayoutIcon },
            ],
        },
        {
            label: "Content",
            options: [
                { key: 'wide', label: 'Wide', icon: WideContentIcon },
                { key: 'compact', label: 'Compact', icon: CompactContentIcon },
            ]
        }
    ]


    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant={'ghost'} size="icon"><PaletteIcon className='!size-[18px]' /></Button>
                </SheetTrigger>
                <SheetContent className="p-4 [&>button:first-child]:hidden">
                    <ThemeWrapper>
                        <SheetHeader>
                            <SheetTitle asChild className="text-md font-normal">
                                <div className="flex">
                                    <div>
                                        <p>Theme Customizer</p>
                                        <p className="text-muted-foreground text-xs">Customize & Preview in Real Time</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="ml-auto rounded-[0.5rem]" onClick={resetConfig}>
                                        <Repeat />
                                        <span className="sr-only">Reset</span>
                                    </Button>
                                </div>
                            </SheetTitle>
                        </SheetHeader>

                        <Separator className="my-2" />

                        <ScrollArea className="h-[calc(100vh-110px)]">
                            <div className="flex flex-col space-y-4">
                                {/* Primary Color */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Primary Color</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {filteredColors.map(({ name, label, activeColor }) => (
                                            mounted ? (
                                                <OptionButton
                                                    key={name}
                                                    isActive={config.theme === name}
                                                    onClick={() => handleChange("theme", name)}
                                                    className="justify-start"
                                                >
                                                    <span
                                                        className="mr-1  size-5 shrink-0 rounded-full flex -translate-x-1 items-center justify-center"
                                                        style={{ backgroundColor: `hsl(${activeColor[mode === "dark" ? "dark" : "light"]})` }}
                                                    >
                                                        {config.theme === name && <CheckIcon className="h-4 w-4 text-white" />}
                                                    </span>
                                                    {label}
                                                </OptionButton>
                                            ) : (
                                                <Skeleton key={name} className="h-8 w-full" />
                                            )
                                        ))}
                                    </div>
                                </div>

                                {/* Border Radius */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Border Radius</Label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {[0, 0.3, 0.5, 0.75, 1.0].map((value) => (
                                            <OptionButton
                                                key={value}
                                                isActive={config.radius === value}
                                                onClick={() => handleChange("radius", value)}
                                            >
                                                {value}
                                            </OptionButton>
                                        ))}
                                    </div>
                                </div>

                                {/* Mode */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Mode</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["light", "dark", "system"].map((modeOption) => (
                                            <OptionButton
                                                key={modeOption}
                                                isActive={theme === modeOption}
                                                onClick={() => setMode(modeOption)}
                                            >
                                                {modeOption === "light" && <Sun className="mr-1" />}
                                                {modeOption === "dark" && <Moon className="mr-1" />}
                                                {modeOption === "system" && <Monitor className="mr-1" />}
                                                {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
                                            </OptionButton>
                                        ))}
                                    </div>
                                </div>

                                {/* Layout and Content*/}
                                {layout.map((type, idx) => (
                                    <div className="space-y-1.5" key={idx}>
                                        <Label className="text-xs">{type.label}</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {type.options.map(({ key, label, icon }) => (
                                                <div className="flex flex-col items-center gap-2" key={key}>
                                                    <OptionButton
                                                        key={key}
                                                        isActive={config.content === key || config.layout === key}
                                                        onClick={() => handleChange(type.label.toLowerCase() as keyof ThemeConfig, key)}
                                                        className="w-24 h-16 p-1"
                                                        asChild
                                                    >
                                                        {icon}
                                                    </OptionButton>
                                                    <Label className="text-xs">{label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                            </div>

                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    </ThemeWrapper>
                </SheetContent>
            </Sheet>
        </>
    );
}