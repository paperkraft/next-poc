'use client'
import { Eye, EyeOff, Settings } from 'lucide-react';
import { useState } from 'react';

import { useDashboard } from '@/components/provider/DashboardProvider';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function DashboardSettings() {

    const { userWidgets, updateWidget, resetWidgets } = useDashboard()
    const [open, setOpen] = useState(false);

    // Get only hidden widgets
    const hiddenWidgets = userWidgets.filter(w => w.isHidden)

    const restoreWidget = async (widgetId: string) => {
        await updateWidget(widgetId, { isHidden: false })
    }


    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => resetWidgets()}>
                        Reset to Default
                    </DropdownMenuItem>
                    <DropdownMenuItem>Change Layout</DropdownMenuItem>
                    <DropdownMenuItem>Sync Settings</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <EyeOff className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
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
                                        onClick={() => restoreWidget(widget.id.toString())}
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
            </Dialog>
        </>
    )
}