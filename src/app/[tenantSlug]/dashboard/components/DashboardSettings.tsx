'use client'
import { Eye, Settings } from 'lucide-react';
import { useState } from 'react';

import { useDashboard } from '@/components/provider/DashboardProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useStateUpdater } from '@/hooks/use-state-update';
import { toast } from 'sonner';

type SettingsStateProps = {
    hiddenWidget: boolean
    addWidget: boolean
}
const InitialSettings: SettingsStateProps = {
    hiddenWidget: false,
    addWidget: false
}

export default function DashboardSettings() {

    const { availableWidgets, userWidgets, isLoading, addWidget, updateWidget, resetWidgets } = useDashboard()
    const [state, setState] = useState<SettingsStateProps>(InitialSettings);
    const updateState = useStateUpdater(setState); // generic hook for state update

    // Get only hidden widgets
    const hiddenWidgets = userWidgets.filter(w => w.isHidden);

    // Filter out widgets that are already added
    const addableWidgets = availableWidgets.filter(aw => !userWidgets.some(uw => uw.widgetId === aw.id));

    const restoreWidget = async (widgetId: number) => {
        await updateWidget(+widgetId, { isHidden: false })
    }

    const handleAddWidget = async (widgetId: number) => {
        try {
            await addWidget(widgetId)
            updateState({ addWidget: false })
            toast.success('Widget added successfully')
        } catch (error) {
            toast.error('Failed to add widget')
            console.error('Error adding widget:', error)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Settings className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateState({ addWidget: true })}>
                        Add Widget
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateState({ hiddenWidget: true })}>
                        View Hidden
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => resetWidgets()}>
                        Reset to Default
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={state.hiddenWidget} onOpenChange={() => updateState({ hiddenWidget: false })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hidden Widgets</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {hiddenWidgets.length > 0 ? (
                            hiddenWidgets.map(widget => (
                                <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">{widget.widget.name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {widget.widget.description}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => restoreWidget(+widget.id)}
                                        disabled={isLoading}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Show
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                No hidden widgets
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog >

            <Dialog open={state.addWidget} onOpenChange={() => updateState({ addWidget: false })}>
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
                                    disabled={isLoading}
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
        </>
    )
}