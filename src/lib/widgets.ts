import { lazy } from 'react'
import type { ComponentType } from 'react'

// Define all widget components
const StatsWidget = lazy(() => import('@/components/widgets/StatsWidget'))
const TimetableWidget = lazy(() => import('@/components/widgets/TimetableWidget'))
const AssignmentsWidget = lazy(() => import('@/components/widgets/AssignmentsWidget'))
const NoticesWidget = lazy(() => import('@/components/widgets/NoticesWidget'))

// Create a type-safe mapping
export const WIDGET_COMPONENTS: Record<string, ComponentType<any>> = {
    StatsWidget,
    TimetableWidget,
    AssignmentsWidget,
    NoticesWidget
}

// Helper function to get widget component
export function getWidgetComponent(componentName: string): ComponentType<any> {
    const Component = WIDGET_COMPONENTS[componentName]
    if (!Component) {
        throw new Error(`Widget component ${componentName} not found`)
    }
    return Component
}