'use client'
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSidebar } from "@/components/ui/sidebar";
import { themeConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";

export default function LayoutBlock() {

    const { setOpen } = useSidebar();
    const [config, setConfig] = themeConfig();

    const handleLayoutChange = (layout: string) => {
        setConfig({ ...config, layout });
        layout === "vertical"
            ? setOpen(true)
            : config.dual
                ? setOpen(true)
                : setOpen(false)
    }

    const handleChange = () => {
        const prev = config.dual;
        setConfig({ ...config, dual: !prev });
        setOpen(!config.dual)
    }

    return (
        <>
            <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                    <Button variant={"outline"} asChild className={cn("w-24 h-16 p-1", { "border-2 border-primary": config.layout === "vertical" })} onClick={() => handleLayoutChange('vertical')}>
                        <svg width="104" height="66" viewBox="0 0 104 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="104" height="66" rx="4" fill="currentColor" fillOpacity="0.02"></rect>
                            <path d="M0 4C0 1.79086 1.79086 0 4 0H27.4717V66H4C1.79086 66 0 64.2091 0 62V4Z" fill="currentColor" fillOpacity="0.08"></path>
                            <rect x="4.90625" y="23.8839" width="17.6604" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="8.83008" y="5.88135" width="9.81132" height="9.70588" rx="2" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="4.90625" y="34.4382" width="17.6604" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="4.90625" y="44.9923" width="17.6604" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="4.90625" y="55.5463" width="17.6604" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="32.1523" y="4.67169" width="64.7547" height="8.8" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="35.0781" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="78.248" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="84.1348" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="90.0215" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="57.0859" y="19.6134" width="40.2264" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="32.1523" y="19.6134" width="19.0455" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="32.1523" y="42.4545" width="65.1591" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                        </svg>
                    </Button>
                    <Label className="text-xs">Vertical</Label>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <Button variant={"outline"} asChild className={cn("w-24 h-16 p-1", { "border-2 border-primary": config.layout === "horizontal" })} onClick={() => handleLayoutChange('horizontal')}>
                        <svg width="104" height="66" viewBox="0 0 104 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="104" height="66" rx="4" fill="currentColor" fillOpacity="0.02"></rect>
                            <rect x="44.0068" y="19.6136" width="46.8212" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="14.9854" y="19.6136" width="22.1679" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="14.9854" y="42.4547" width="75.8413" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="14.9248" y="4.68896" width="74.1506" height="9.00999" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="20.0264" y="6.50403" width="6.00327" height="5.38019" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="33.877" y="7.96356" width="6.6372" height="2.46129" rx="1.23064" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="48.3652" y="7.96356" width="6.6372" height="2.46129" rx="1.23064" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="62.8506" y="7.96356" width="6.6372" height="2.46129" rx="1.23064" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="77.3379" y="7.96356" width="6.6372" height="2.46129" rx="1.23064" fill="currentColor" fillOpacity="0.3"></rect>
                        </svg>
                    </Button>
                    <Label className="text-xs">Horizontal</Label>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <Button variant={"outline"} asChild className={cn("w-24 h-16 p-1", { "border-2 border-primary": config.layout === "collapsed" })} onClick={() => handleLayoutChange('collapsed')}>
                        <svg width="104" height="66" viewBox="0 0 104 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="104" height="66" rx="4" fill="currentColor" fillOpacity="0.02"></rect>
                            <path d="M0 4C0 1.79086 1.79086 0 4 0H13.7359V66H4C1.79086 66 0 64.2091 0 62V4Z" fill="currentColor" fillOpacity="0.04"></path>
                            <rect x="2.94336" y="23.8839" width="7.84906" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="3.43359" y="5.88135" width="6.86793" height="6.79412" rx="2" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="2.94336" y="34.4382" width="7.84906" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="2.94336" y="44.9923" width="7.84906" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="2.94336" y="55.5463" width="7.84906" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="21.4717" y="4.67169" width="75.437" height="8.8" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="25.6172" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="78.248" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="84.1348" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="90.0215" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="50.4912" y="19.6134" width="46.8212" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="21.4717" y="19.6134" width="22.1679" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="21.4717" y="42.4545" width="75.8413" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                        </svg>
                    </Button>
                    <Label className="text-xs">Collapsed</Label>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <Button variant={"outline"} asChild className={cn("w-24 h-16 p-1", { "border-2 border-primary": config.dual })} onClick={handleChange}>
                        <svg width="104" height="66" viewBox="0 0 104 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="104" height="66" rx="4" fill="currentColor" fillOpacity="0.02"></rect>
                            <path d="M0 4C0 1.79086 1.79086 0 4 0H13.7359V66H4C1.79086 66 0 64.2091 0 62V4Z" fill="currentColor" fillOpacity="0.04"></path>
                            <rect x="2.94336" y="23.8839" width="7.84906" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="3.43359" y="5.88135" width="6.86793" height="6.79412" rx="2" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="2.94336" y="34.4382" width="7.84906" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="2.94336" y="44.9923" width="7.84906" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="2.94336" y="55.5463" width="7.84906" height="2.78946" rx="1.39473" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="21.4717" y="4.67169" width="75.437" height="8.8" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="25.6172" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="78.248" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="84.1348" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="90.0215" y="6.87158" width="3.92453" height="4.4" rx="1" fill="currentColor" fillOpacity="0.3"></rect>
                            <rect x="50.4912" y="19.6134" width="46.8212" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="21.4717" y="19.6134" width="22.1679" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                            <rect x="21.4717" y="42.4545" width="75.8413" height="17.6" rx="2" fill="currentColor" fillOpacity="0.08"></rect>
                        </svg>
                    </Button>
                    <Label className="text-xs">Dual Menu</Label>
                </div>
            </div>
        </>
    );
}