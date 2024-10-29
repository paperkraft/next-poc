'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import React, { memo, useState } from "react";

type DialogProps= {
    open: boolean,
    setClose?: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode | null;
    hideClose?: boolean;
    preventClose?:boolean;
}

const DialogBox = memo(function DialogBox({open, setClose, title, description, footer, children, ...rest}:DialogProps) {
    const [opened, setOpen] = useState(open);

    const handleOpenChange = () => {
      setOpen(false);
      setClose?.();
    }
    
    return(
      <Dialog open={opened} onOpenChange={handleOpenChange}>
        <DialogContent aria-describedby="content" 
          className={cn({"[&>button]:hidden": rest.hideClose})}
          onInteractOutside={(e) => { rest.preventClose && e.preventDefault();}}
        >
          <DialogHeader>
            <DialogTitle>{title ?? "Dialog Title"}</DialogTitle>
            <>
            <DialogDescription className="my-4">{description}</DialogDescription>
              { children } 
            </>
          </DialogHeader>
          <DialogFooter>
            { footer }
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
});

export default DialogBox;