'use client'
import { Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DialogBox from '@/components/custom/dialog-box'

type ConfirmDeleteDialogProps = {
    open: boolean
    title?: string
    itemName: string
    loading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDeleteDialog({
    open,
    title = 'Delete Confirmation',
    itemName,
    loading,
    onConfirm,
    onCancel,
}: ConfirmDeleteDialogProps) {
    return (
        <DialogBox open={open} title={title} preventClose setClose={onCancel}>
            <p>
                Are you sure? Do you want to delete&nbsp;
                <strong>{itemName}</strong>?<br />
                This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 mt-4">
                <Button
                    aria-label="Confirm delete"
                    variant="destructive"
                    disabled={loading}
                    onClick={onConfirm}
                >
                    {loading && <Loader className="size-4 animate-spin" />}
                    {loading ? 'Deleting' : 'Confirm'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </DialogBox>
    )
}
