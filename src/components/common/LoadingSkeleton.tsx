export function WidgetAssignmentSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-10 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="border rounded-lg overflow-hidden">
                <div className="h-12 bg-gray-100" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 border-t flex items-center p-4">
                        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                        {[...Array(3)].map((_, j) => (
                            <div key={j} className="mx-auto h-6 w-12 bg-gray-200 rounded-full" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}