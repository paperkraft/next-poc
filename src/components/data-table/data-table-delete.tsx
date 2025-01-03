import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Table } from "@tanstack/react-table";
import { toast } from "sonner";
import { useState } from "react";

interface DeleteToolbarProps<TData> {
    table: Table<TData>
}

export default function DeleteRecordDialog<TData>({ table }: DeleteToolbarProps<TData>) {

    const [open , setOpen] = useState(false);

    const onDelete = () => {
        setOpen(false);
        toast.success("Log deleted");
        table.toggleAllRowsSelected(false);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" onClick={()=> setOpen(true)} className="border-red-400 text-red-400 hover:text-red-500 hover:bg-red-50">
                        <Trash2 className="size-4" aria-hidden="true" />
                        Delete ({table.getFilteredSelectedRowModel().rows.length})
                    </Button>
                </DialogTrigger>
                <DialogContent>
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
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            aria-label="Delete selected rows"
                            variant="destructive"
                            onClick={onDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}