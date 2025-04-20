'use client'
import { Table } from "@tanstack/react-table";
import { Loader, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ThemeWrapper } from "../layout/theme-wrapper";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

interface DeleteToolbarProps<TData> {
    table: Table<TData>;
    deleteRecord?: (id: string | string[]) => Promise<void>;
}

export default function DeleteRecordDialog<TData>({ table, deleteRecord }: DeleteToolbarProps<TData>) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const selectedRows = table.getFilteredSelectedRowModel().rows as any[];
    const selectedIds = selectedRows.map((row: any) => row.original.id);
    const selectedCount = selectedRows.length;
    const selectedName = selectedCount === 1 ? selectedRows[0].original?.name  : null;

    const onDelete = async () => {

        if (!selectedIds.length) {
            toast.error("No records selected for deletion.");
            return;
        }

        try {
            setLoading(true);
            await deleteRecord?.(selectedIds);
        } catch (error) {
            console.error("Deletion failed:", error);
        } finally {
            setOpen(false);
            setLoading(false);
            table.toggleAllRowsSelected(false);
            router.refresh();
        }

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    aria-label="Delete Dialog"
                    onClick={() => setOpen(true)}
                    className="border-red-400 text-red-400 hover:text-red-500 hover:bg-red-50"
                >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Delete ({table.getFilteredSelectedRowModel().rows.length})
                </Button>
            </DialogTrigger>
            
            <DialogContent>
                <ThemeWrapper>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your&nbsp;
                            {selectedCount === 1 ? (
                                <span className="font-medium">"{selectedName}"</span>
                            ) : (
                                <>
                                    <span className="font-medium">{selectedCount}</span>&nbsp;
                                    records
                                </>
                            )}
                            &nbsp;from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:space-x-0">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        </DialogClose>
                        <Button
                            aria-label="Delete selected rows"
                            variant="destructive"
                            onClick={onDelete}
                            disabled={loading}
                        >
                            {loading && <Loader className="size-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </ThemeWrapper>
            </DialogContent>
        </Dialog>
    )
}