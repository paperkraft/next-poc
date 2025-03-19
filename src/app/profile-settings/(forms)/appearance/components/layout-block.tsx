'use client'
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSidebar } from "@/components/ui/sidebar";
import { LayoutType, themeConfig } from "@/hooks/use-config";
import { CollapsedLayoutIcon, HorizontalLayoutIcon, VerticalLayoutIcon } from "@/lib/layout-icons";
import { cn } from "@/lib/utils";

export default function LayoutBlock() {

    const { setOpen } = useSidebar();
    const [config, setConfig] = themeConfig();

    const handleLayoutChange = (layout: LayoutType["layout"]) => {
        setConfig({ ...config, layout });
        setOpen(layout === "vertical" || layout === "dual-menu");
    }

    const layouts = [
        { key: 'vertical', label: 'Vertical', icon: VerticalLayoutIcon },
        { key: 'horizontal', label: 'Horizontal', icon: HorizontalLayoutIcon },
        { key: 'collapsed', label: 'Collapsed', icon: CollapsedLayoutIcon },
        { key: 'dual-menu', label: 'Dual Menu', icon: CollapsedLayoutIcon },
    ];

    return (
        <>
            <div className="flex gap-4 overflow-x-auto">
                {layouts.map((item,idx)=>(
                    <div className="flex flex-col items-center gap-2" key={idx}>
                        <Button variant={"outline"} asChild 
                            className={cn("w-24 h-16 p-1", { "border-2 border-primary": config.layout === item.key })}
                            onClick={() => handleLayoutChange(item.key as LayoutType["layout"])}
                        >
                            {item.icon}
                        </Button>
                        <Label className="text-xs">{item.label}</Label>
                    </div>
                ))}
            </div>
        </>
    );
}