'use client'
import { Loader, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Table } from "@tanstack/react-table";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeWrapper } from "../layout/theme-wrapper";

interface DeleteToolbarProps<TData> {
    table: Table<TData>;
    deleteRecord?: (id: string | string[]) => Promise<void>;
}

export default function DeleteRecordDialog<TData>({ table, deleteRecord }: DeleteToolbarProps<TData>) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onDelete = async () => {
        const selectedIds = table.getFilteredSelectedRowModel().rows.map((row: any) => row.original.id);
        if (!selectedIds.length) {
            toast.error("No records selected for deletion.");
            return;
        }
        setLoading(true);

        try {
            await deleteRecord?.(selectedIds);
            toast.success(`Successfully deleted ${selectedIds.length} record(s).`);
            setOpen(false);
        } catch (error) {
            console.error("Deletion failed:", error);
            toast.error("Failed to delete the selected records. Please try again.");
            setOpen(false);
        } finally {
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
                            This action cannot be undone. This will permanently delete your{" "}
                            <span className="font-medium">{table.getFilteredSelectedRowModel().rows.length}</span>
                            {table.getFilteredSelectedRowModel().rows.length === 1 ? " record" : " records"} from our servers.
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