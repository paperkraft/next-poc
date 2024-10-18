'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import React, { memo } from "react";

type DialogProps= {
    open: boolean,
    setClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const DialogBox = memo(function DialogBox({open, setClose, title, footer, children}:DialogProps) {
    return(
        <Dialog open={open} onOpenChange={setClose}>
        <DialogContent aria-describedby="content">
          <DialogHeader>
            <DialogTitle>{title ?? "Dialog Title"}</DialogTitle>
            <div>
                <DialogDescription className="my-4"></DialogDescription>
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

// export const DialogBox = ({open, setClose, title, footer, children}:DialogProps) => {

//     return(
//         <Dialog open={open} onOpenChange={setClose}>
//         <DialogContent aria-describedby="content">
//           <DialogHeader>
//             <DialogTitle>{title ?? "Dialog Title"}</DialogTitle>
//             <div>
//                 <DialogDescription className="my-4"></DialogDescription>
//                 { children } 
//             </div>
//           </DialogHeader>
//           <DialogFooter>
//             { footer }
//           </DialogFooter>
//         </DialogContent>
//         </Dialog>
//     )
// }