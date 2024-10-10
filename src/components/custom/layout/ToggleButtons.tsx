'use client'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useContext } from "react";
import { ThemeContext } from "../theme-provider";

export default function ToggleButtons(){
    const { setTheme } = useTheme();
    const context = useContext(ThemeContext);
    return(
        <ToggleGroup type="single" size={'sm'} variant={'outline'} onValueChange={setTheme} defaultValue={context?.currentTheme}>
            <ToggleGroupItem value="light" aria-label="light"><SunIcon className="h-4 w-4"/></ToggleGroupItem>
            <ToggleGroupItem value="dark" aria-label="dark"><MoonIcon className="h-4 w-4"/></ToggleGroupItem>
            <ToggleGroupItem value="system" aria-label="system"><MonitorIcon className="h-4 w-4"/></ToggleGroupItem>
        </ToggleGroup>
    )
}