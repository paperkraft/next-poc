'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import React, { memo, useState } from "react";

type DialogProps= {
    open: boolean,
    setClose?: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode | null;
}

const DialogBox = memo(function DialogBox({open, setClose, title, description, footer, children}:DialogProps) {
    const [opened, setOpen] = useState(open);

    const handleOpenChange = () => {
      setOpen(false);
      setClose?.();
    }
    
    return(
      <Dialog open={opened} onOpenChange={handleOpenChange}>
        <DialogContent aria-describedby="content">
          <DialogHeader>
            <DialogTitle>{title ?? "Dialog Title"}</DialogTitle>
            <div>
                <DialogDescription className="my-4">{description}</DialogDescription>
                { children } 
            </div>
          </DialogHeader>
          <DialogFooter>
            { footer }
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
});

export default DialogBox;