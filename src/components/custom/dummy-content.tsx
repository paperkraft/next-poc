export default function Dummy(){
    return(
        <div className="relative h-[calc(100vh-250px)] rounded-md border border-dashed border-gray-400 opacity-75 mr-2">
            <svg
                fill="none"
                className="absolute inset-0 h-full w-full stroke-gray-300 dark:stroke-slate-700"
            >
                <defs>
                    <pattern
                        x="0"
                        y="0"
                        id="pattern"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                    >
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                    </pattern>
                </defs>
                    <rect
                        fill="url(#pattern)"
                        width="100%"
                        height="100%"
                        stroke="none"
                    >
                    </rect>
            </svg>
        </div>
    )
}