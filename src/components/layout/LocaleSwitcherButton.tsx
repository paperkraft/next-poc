// components/LocaleSwitcherButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { LanguagesIcon } from "lucide-react";

const LocaleSwitcherButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
    (props, ref) => (
        <Button variant="ghost" size="icon" ref={ref} {...props}>
            <LanguagesIcon className="!size-[18px]" />
        </Button>
    )
);

LocaleSwitcherButton.displayName = "LocaleSwitcherButton";

export default LocaleSwitcherButton;
