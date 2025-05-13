// components/BellNotificationsButton.tsx
import React from "react";
import { BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const BellNotificationsButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
    ({ children, ...props }, ref) => (
        <Button ref={ref} variant="ghost" className="size-8 block relative" {...props}>
            <BellIcon className="-translate-x-1/2 block !size-5" />
            {children}
        </Button>
    )
);

BellNotificationsButton.displayName = "BellNotificationsButton";

export default BellNotificationsButton;
