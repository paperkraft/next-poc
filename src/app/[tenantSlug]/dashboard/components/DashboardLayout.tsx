'use client'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import WidgetContainer from './WidgetContainer'
import AddWidgetButton from './AddWidgetButton'
import { useDashboard } from '@/components/provider/DashboardProvider'
import DashboardSettings from './DashboardSettings'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { useMounted } from '@/hooks/use-mounted'

export default function DashboardLayout() {

    const mounted = useMounted();
    const {
        userWidgets,
        reorderWidgets,
        isLoading,
        error,
        getVisibleWidgets
    } = useDashboard()

    // Memoized visible widgets to prevent unnecessary recalculations
    const visibleWidgets = useMemo(() => {
        return getVisibleWidgets().sort((a, b) => a.sortOrder - b.sortOrder)
    }, [getVisibleWidgets])

    // Memoized sortable items for dnd-kit
    const sortableItems = useMemo(() =>
        visibleWidgets.map(w => w.id.toString()),
        [visibleWidgets]
    )

    const handleDragEnd = useCallback(async (event: DragEndEvent) => {
        const { active, over } = event

        // Early returns for invalid states
        if (!over || active.id === over.id || isLoading) return

        try {
            const activeId = active.id.toString()
            const overId = over.id.toString()

            const oldIndex = visibleWidgets.findIndex(w => w.id.toString() === activeId)
            const newIndex = visibleWidgets.findIndex(w => w.id.toString() === overId)

            if (oldIndex === -1 || newIndex === -1) {
                console.warn('Invalid drag operation: widget not found')
                return
            }

            // Calculate new sort orders for all affected widgets
            const reorderedWidgets = arrayMove(visibleWidgets, oldIndex, newIndex)
            const updates = reorderedWidgets.map((widget, index) => ({
                userWidgetId: widget.id,
                sortOrder: index
            }))

            // The provider handles optimistic updates automatically
            await reorderWidgets(updates)
            toast.success('Widgets reordered successfully')

        } catch (err) {
            // Error handling is already done in the provider with rollback
            toast.error('Failed to reorder widgets')
            console.error('Drag and drop error:', err)
        }
    }, [visibleWidgets, reorderWidgets, isLoading])

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
            ))}
        </div>
    )

    // Empty state component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">No widgets configured</h3>
                <p className="text-muted-foreground mt-1">
                    Get started by adding your first widget to the dashboard
                </p>
            </div>
            <AddWidgetButton />
        </div>
    )

    // Error state component
    const ErrorState = () => (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium">Dashboard Error</h4>
                    <p className="text-sm mt-1">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                >
                    Retry
                </button>
            </div>
        </div>
    )

    if (!mounted) return null

    return (
        <div className="space-y-4">
            <div className='flex justify-between items-center'>
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Dashboard</h2>
                    {isLoading && (
                        <div className="size-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    )}
                </div>
                <DashboardSettings />
            </div>

            {error && <ErrorState />}

            {isLoading && userWidgets.length === 0 ? (
                <LoadingSkeleton />
            ) : visibleWidgets.length === 0 ? (
                <EmptyState />
            ) : (
                <DndContext onDragEnd={handleDragEnd}>
                    <SortableContext items={sortableItems}>
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