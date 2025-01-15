'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import React, { Dispatch, SetStateAction } from "react";

interface DetailsDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    details: Record<string, string | undefined> | undefined | null;
}

export const DetailsDialog = React.memo(({ open, setOpen, details }: DetailsDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent aria-describedby="content" className={"overflow-y-scroll max-h-screen"}>
                <DialogHeader>
                    <DialogTitle className="mb-4">Details</DialogTitle>
                    <>
                        {details &&
                            Object.entries(details).map(([key, val], idx) => (
                                <div key={idx} className="flex gap-2">
                                    <p className="capitalize">{`${key}:`}</p>
                                    {renderRecursive(val)}
                                </div>
                            ))
                        }
                    </>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
})

const renderRecursive = (val: any) => {
    if (typeof val === 'object' && val !== null) {
        return (
            <div className="pl-4">
                {Object.entries(val).map(([nestedKey, nestedVal], idx) => (
                    <div key={idx} className="flex gap-2">
                        <p className="capitalize">{`${nestedKey}:`}</p>
                        {renderRecursive(nestedVal)}
                    </div>
                ))}
            </div>
        );
    } else {
        return <p>{val}</p>;
    }
}