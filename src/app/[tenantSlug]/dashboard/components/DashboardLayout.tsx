'use client'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import WidgetContainer from './WidgetContainer'
import AddWidgetButton from './AddWidgetButton'
import { useDashboard } from '@/components/provider/DashboardProvider'
import DashboardSettings from './DashboardSettings'
import { useCallback } from 'react'
import { toast } from 'sonner'

export default function DashboardLayout() {
    const {
        userWidgets,
        reorderWidgets,
        isLoading,
        error
    } = useDashboard()

    const handleDragEnd = useCallback(async (event: DragEndEvent) => {
        const { active, over } = event

        // Early returns for invalid states
        if (!over) return
        if (active.id === over.id) return
        if (isLoading) return

        try {
            const oldIndex = userWidgets.findIndex(w => w.id.toString() === active.id)
            const newIndex = userWidgets.findIndex(w => w.id.toString() === over.id)

            if (oldIndex === -1 || newIndex === -1) return

            // Create updates for all widgets to ensure consistent ordering
            const updatedWidgets = arrayMove(userWidgets, oldIndex, newIndex)
            const updates = updatedWidgets.map((widget, index) => ({
                userWidgetId: +widget.id.toString(),
                sortOrder: index
            }))

            await reorderWidgets(updates)
            toast.success('Widgets reordered successfully')
        } catch (err) {
            toast.error('Failed to reorder widgets')
            console.error('Drag and drop error:', err)
        }
    }, [userWidgets, reorderWidgets, isLoading])

    // Filter and sort widgets for display
    const visibleWidgets = userWidgets
        .filter(widget => !widget.isHidden)
        .sort((a, b) => a.sortOrder - b.sortOrder)

    return (
        <div className="space-y-4">
            <div className='flex justify-end'>
                <DashboardSettings />
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                    {error}
                </div>
            )}

            {isLoading && userWidgets.length === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : visibleWidgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <p className="text-muted-foreground">No widgets added to your dashboard</p>
                    <AddWidgetButton />
                </div>
            ) : (
                <DndContext onDragEnd={handleDragEnd}>
                    <SortableContext items={visibleWidgets.map(w => w.id.toString())}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {visibleWidgets.map(widget => (
                                <WidgetContainer
                                    key={widget.id}
                                    widget={widget}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    )
}