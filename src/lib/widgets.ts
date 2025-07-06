export const availableWidgets = [
    {
        key: 'STATS',
        name: 'Statistics',
        component: 'StatsWidget',
        description: 'Key metrics and numbers',
        category: 'analytics'
    },
    {
        key: 'TIMETABLE',
        name: 'Time Table',
        component: 'TimetableWidget',
        description: 'Class schedule and timings',
        category: 'organization'
    },
    {
        key: 'ASSIGNMENTS',
        name: 'Assignments',
        component: 'AssignmentsWidget',
        description: 'Upcoming and pending work',
        category: 'academics'
    },
    {
        key: 'NOTICES',
        name: 'Notices',
        component: 'NoticesWidget',
        description: 'Important announcements',
        category: 'communication'
    }
] as const


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