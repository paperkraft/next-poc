import React from "react";
import { Button } from "@/components/ui/button";
import { PaletteIcon } from "lucide-react";

const ThemeConfigButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
    (props, ref) => (
        <Button variant="ghost" size="icon" ref={ref} {...props}>
            <PaletteIcon className="!size-[18px]" />
        </Button>
    )
);
ThemeConfigButton.displayName = "ThemeConfig";

export default ThemeConfigButton;
