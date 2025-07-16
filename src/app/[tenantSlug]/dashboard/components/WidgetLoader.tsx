'use client'

import { Loader2 } from 'lucide-react';
import React, { Suspense } from 'react';

import { getWidgetComponent } from '@/lib/widgets';
import { FullUserWidget } from '@/types/widget';

export default function WidgetLoader({ widget }: { widget: FullUserWidget }) {
    const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        const loadComponent = async () => {
            try {
                setError(null)
                const Component = getWidgetComponent(widget.widget.component)
                setComponent(() => Component)
            } catch (err) {
                console.error(`Failed to load widget: ${widget.widget.component}`, err)
                setError(`Failed to load widget: ${widget.widget.name}`)
            }
        }

        loadComponent()
    }, [widget.widget.component])

    if (error) {
        return (
            <div className="text-center p-4 text-red-500">
                {error}
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm text-blue-500 hover:underline"
                >
                    Try Again
                </button>
            </div>
        )
    }

    if (!Component) {
        return (
            <div className="flex justify-center items-center h-full min-h-[200px]">
                <Loader2 className="animate-spin" />
            </div>
        )
    }

    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-full min-h-[200px]">
                <Loader2 className="animate-spin" />
            </div>
        }>
            <Component config={widget.widget.component} />
        </Suspense>
    )
}