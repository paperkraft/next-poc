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
            <DialogContent aria-describedby="content" className={"overflow-y-scroll max-h-[500px]"}>
                <DialogHeader>
                    <DialogTitle className="mb-4">Details</DialogTitle>
                    <div id="content" className="font-mono text-sm whitespace-pre-wrap">
                        {details ? renderRecursive(details?.data, 0) : <p>No details</p>}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
});

const renderRecursive = (value: any, level: number = 0): JSX.Element => {
    const indent = ' '.repeat(level * 2);
    const nextIndent = ' '.repeat((level + 1) * 2);

    if (Array.isArray(value)) {
        return (
            <>
                <div>{indent}[</div>
                {value.map((item, i) => (
                    <div key={i}>
                        {renderRecursive(item, level + 1)}
                        {i < value.length - 1 ? ',' : ''}
                    </div>
                ))}
                <div>{indent}]</div>
            </>
        );
    }

    if (typeof value === 'object' && value !== null) {
        const entries = Object.entries(value);
        return (
            <>
                <div>{indent}{'{'}</div>
                {entries.map(([key, val], i) => (
                    <div key={key}>
                        {nextIndent}"{key}": {renderRecursive(val, level + 1)}
                        {i < entries.length - 1 ? ',' : ''}
                    </div>
                ))}
                <div>{indent}{'}'}</div>
            </>
        );
    }

    return <span>{JSON.stringify(value)}</span>;
};
