export function SkeletonSidebarLayout() {
    return (
        <div className="w-[200px]">
            <div className="flex gap-1 border p-1 rounded-t bg-background border-gray-300 dark:border-gray-500">
                <div className="bg-red-600 h-1 w-1 rounded-full"></div>
                <div className="bg-yellow-500 h-1 w-1 rounded-full"></div>
                <div className="bg-green-600 h-1 w-1 rounded-full"></div>
            </div>
            <div className="h-3 border p-1 border-t-0 bg-background border-gray-300 dark:border-gray-500"></div>
            <div className="flex">
                <div className="w-[40%] h-full bg-background">
                    <div className="flex flex-col gap-2 p-2 pr-4 border border-t-0 border-gray-300 dark:border-gray-500">
                        <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                        <div className="h-1 bg-gray-500 rounded"></div>
                        <div className="h-1 dark:bg-gray-600 bg-gray-300 rounded"></div>
                        <div className="h-1 dark:bg-gray-600 bg-gray-300 rounded"></div>
                        <div className="h-1 dark:bg-gray-600 bg-gray-300 rounded"></div>
                        <div className="h-1 rounded"></div>
                        <div className="h-1 rounded"></div>
                    </div>
                </div>
                <div className="p-2 w-full border border-l-0 border-t-0 border-gray-300 dark:border-gray-500">
                    <p className="mb-1 font-semibold text-[11px]">Dashboard</p>
                    <div className="border-dashed border-spacing-4 rounded border h-14 border-gray-400"></div>
                </div>
            </div>
        </div>
    )
}

export function SkeletonStackedLayout() {
    return (
        <div className="w-[200px]">
            <div className="flex gap-1 border p-1 rounded-t bg-background border-gray-300 dark:border-gray-500">
                <div className="bg-red-600 h-1 w-1 rounded-full"></div>
                <div className="bg-yellow-500 h-1 w-1 rounded-full"></div>
                <div className="bg-green-600 h-1 w-1 rounded-full"></div>
            </div>
            <div className="h-5 flex border p-1 border-t-0 bg-background border-gray-300 dark:border-gray-500">
                <div className="flex px-2 gap-2 items-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <div className="h-1 w-3 bg-gray-500 rounded"></div>
                    <div className="h-1 w-3 bg-gray-300 rounded"></div>
                    <div className="h-1 w-3 bg-gray-300 rounded"></div>
                </div>
            </div>
            <div className="p-2 w-full border border-t-0 border-gray-300 dark:border-gray-500">
                <p className="mb-1 font-semibold text-[11px]">Dashboard</p>
                <div className="border-dashed border-spacing-4 rounded border h-14 border-gray-400"></div>
            </div>
        </div>
    )
}

export function SkeletonLightTheme() {
    return (
        <div className="w-[200px]">
            <div className="flex-1 bg-gray-100 p-0 rounded-t">
                <div className="flex gap-1 border p-1 rounded-t bg-white border-gray-300">
                    <div className="bg-red-600 h-1 w-1 rounded-full"></div>
                    <div className="bg-yellow-500 h-1 w-1 rounded-full"></div>
                    <div className="bg-green-600 h-1 w-1 rounded-full"></div>
                </div>
                <div className="h-3 border p-1 border-t-0 bg-white border-gray-300"></div>
                <div className="flex">
                    <div className="w-[40%] h-full bg-white">
                        <div className="flex flex-col gap-2 p-2 pr-4 border border-t-0 border-gray-300">
                            <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                            <div className="h-1 bg-gray-500 rounded"></div>
                            <div className="h-1 bg-gray-300 rounded"></div>
                            <div className="h-1 bg-gray-300 rounded"></div>
                            <div className="h-1 bg-gray-300 rounded"></div>
                            <div className="h-1 rounded"></div>
                            <div className="h-1 rounded"></div>
                        </div>
                    </div>
                    <div className="p-2 w-full border border-l-0 border-t-0 border-gray-300 bg-gray-200">
                        <p className="mb-1 font-semibold text-[11px] text-black">Dashboard</p>
                        <div className="border-dashed border-spacing-4 rounded border h-14 border-gray-400"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function SkeletonDarkTheme() {
    return (
        <div className="w-[200px]">
            <div className="flex-1 bg-gray-800 text-white p-0 rounded-t">
                <div className="flex gap-1 border p-1 rounded-t bg-gray-800 border-gray-700">
                    <div className="bg-red-600 h-1 w-1 rounded-full"></div>
                    <div className="bg-yellow-500 h-1 w-1 rounded-full"></div>
                    <div className="bg-green-600 h-1 w-1 rounded-full"></div>
                </div>
                <div className="h-3 border p-1 border-t-0 bg-gray-800 border-gray-700"></div>
                <div className="flex">
                    <div className="w-[40%] h-full bg-gray-800">
                        <div className="flex flex-col gap-2 p-2 pr-4 border border-t-0 border-gray-700">
                            <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                            <div className="h-1 bg-gray-300 rounded"></div>
                            <div className="h-1 bg-gray-600 rounded"></div>
                            <div className="h-1 bg-gray-600 rounded"></div>
                            <div className="h-1 bg-gray-600 rounded"></div>
                            <div className="h-1 rounded"></div>
                            <div className="h-1 rounded"></div>
                        </div>
                    </div>
                    <div className="p-2 w-full border border-l-0 border-t-0 border-gray-700 bg-gray-900">
                        <p className="mb-1 font-semibold text-[11px] text-white">Dashboard</p>
                        <div className="border-dashed border-spacing-4 rounded border h-14 border-gray-600"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function SkeletonSystemTheme() { 
    return(
        <div className="w-[200px]">
            <div className="flex rounded-t">
                {/*  Light */}
                <div className="w-1/2 flex-1">
                    <div className="flex gap-1 p-1 border-r-0 bg-white border border-gray-300 border-b-0 rounded-tl">
                        <div className="bg-red-600 h-1 w-1 rounded-full"></div>
                        <div className="bg-yellow-500 h-1 w-1 rounded-full"></div>
                        <div className="bg-green-600 h-1 w-1 rounded-full"></div>
                    </div>

                    <div className="bg-white h-3 border border-r-0 border-gray-300"></div>
                    
                    <div className="flex border border-t-0 border-r-0 border-gray-300">
                        <div className="w-[150px] h-full bg-white">
                            <div className="flex flex-col gap-2 p-2 pr-4">
                                <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                                <div className="h-1 bg-gray-500 rounded"></div>
                                <div className="h-1 bg-gray-300 rounded"></div>
                                <div className="h-1 bg-gray-300 rounded"></div>
                                <div className="h-1 bg-gray-300 rounded"></div>
                                <div className="h-1 rounded"></div>
                                <div className="h-1 rounded"></div>
                            </div>
                        </div>

                        <div className="w-full bg-gray-200 p-2"></div>
                    </div>
                </div>
                {/*  Dark */}
                <div className="w-1/2 flex flex-col relative">
                    <div className="bg-gray-800 h-[13px] border border-gray-700 border-b-0 border-l-0 rounded-tr"></div>
                    <div className="bg-gray-800 h-3 border border-l-0 border-gray-700"></div>
                    <div className="w-full flex-1 bg-gray-900 border border-l-0 border-gray-700 border-t-0"></div>

                    {/* content */}
                    <div className="absolute p-2 w-[144px] top-6 -left-11">
                        <p className="mb-1 font-semibold text-[11px] text-black">Dashb<span className="text-white">oard</span></p>
                        <div className="border-dashed border-spacing-4 rounded border h-14 border-gray-400"></div>
                    </div>
                </div>
            </div>

        </div>
    )
}