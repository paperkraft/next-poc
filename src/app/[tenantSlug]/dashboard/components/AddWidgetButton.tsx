'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { useDashboard } from '@/components/provider/DashboardProvider'
import { toast } from 'sonner'
import { PlusIcon } from 'lucide-react'

export default function AddWidgetButton() {

    const [open, setOpen] = useState(false)
    const {
        availableWidgets,
        userWidgets,
        addWidget,
        isLoading
    } = useDashboard()


    // Filter out widgets that are already added
    const addableWidgets = availableWidgets.filter(aw => !userWidgets.some(uw => uw.widgetId === aw.id))

    const handleAddWidget = async (widgetId: number) => {
        try {
            await addWidget(widgetId)
            setOpen(false)
            toast.success('Widget added successfully')
        } catch (error) {
            toast.error('Failed to add widget')
            console.error('Error adding widget:', error)
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={isLoading}>
                    <PlusIcon />
                    Add Widget
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Widget to Dashboard</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    {addableWidgets.length > 0 ? (
                        addableWidgets.map(widget => (
                            <button
                                key={widget.widget.key}
                                onClick={() => handleAddWidget(widget.id)}
                                className="flex flex-col items-start gap-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="font-medium">{widget.widget.name}</div>
                                <p className="text-sm text-gray-500 text-left">
                                    {widget.widget.description}
                                </p>
                            </button>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-muted-foreground">
                            {availableWidgets.length === 0
                                ? 'No widgets available'
                                : 'All available widgets have been added'}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}