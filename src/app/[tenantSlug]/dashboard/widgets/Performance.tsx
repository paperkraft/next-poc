import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Performance() {
    return (
        <>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Academic Performance</CardTitle>
                    <CardDescription>Track your progress across different subjects</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="overview">
                        <TabsList className="mb-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="attendance">Attendance</TabsTrigger>
                            <TabsTrigger value="exams">Exam Scores</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                    <span className="text-sm">Exam Score</span>
                                    <span className="text-sm font-medium ml-1">76%</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                                    <span className="text-sm">Attendance</span>
                                    <span className="text-sm font-medium ml-1">87%</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-purple-200 rounded"></div>
                                    <span className="text-sm">Class Average</span>
                                    <span className="text-sm font-medium ml-1">72%</span>
                                </div>
                            </div>
                            <div className="h-64 w-full relative">
                                <PerformanceChart />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Quarter 1</span>
                                <span>Quarter 2</span>
                                <span>Half Yearly</span>
                                <span>Quarter 3</span>
                                <span>Model</span>
                                <span>Final Exam</span>
                            </div>
                        </TabsContent>
                        <TabsContent value="attendance">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Mathematics</span>
                                        <span className="text-sm font-medium">92%</span>
                                    </div>
                                    <Progress value={92} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Physics</span>
                                        <span className="text-sm font-medium">87%</span>
                                    </div>
                                    <Progress value={87} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Computer Science</span>
                                        <span className="text-sm font-medium">95%</span>
                                    </div>
                                    <Progress value={95} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">English</span>
                                        <span className="text-sm font-medium">78%</span>
                                    </div>
                                    <Progress value={78} className="h-2" />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="exams">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Mathematics Midterm</span>
                                        <span className="text-sm font-medium">85/100</span>
                                    </div>
                                    <Progress value={85} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Physics Lab Assessment</span>
                                        <span className="text-sm font-medium">92/100</span>
                                    </div>
                                    <Progress value={92} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Programming Quiz</span>
                                        <span className="text-sm font-medium">78/100</span>
                                    </div>
                                    <Progress value={78} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">English Essay</span>
                                        <span className="text-sm font-medium">88/100</span>
                                    </div>
                                    <Progress value={88} className="h-2" />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </>
    );
}

function PerformanceChart() {
    return (
        <div className="w-full h-full flex items-end">
            <svg viewBox="0 0 800 300" className="w-full h-full">
                {/* Blue line - Exam score */}
                <path
                    d="M0,200 L100,180 L200,140 L300,120 L400,150 L500,120 L600,110 L700,80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                />

                {/* Orange line - Attendance */}
                <path
                    d="M0,160 L100,120 L200,100 L300,140 L400,130 L500,110 L600,90 L700,70"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                />

                {/* Purple area - Overall Average */}
                <path
                    d="M0,180 L100,150 L200,120 L300,80 L400,120 L500,100 L600,80 L700,60 L700,250 L0,250 Z"
                    fill="#e9d5ff"
                    fillOpacity="0.3"
                    stroke="#d8b4fe"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                />

                {/* Tooltip */}
                <g transform="translate(500, 120)">
                    <rect
                        x="-80"
                        y="-60"
                        width="160"
                        height="80"
                        rx="4"
                        fill="white"
                        stroke="#e5e7eb"
                        className="dark:fill-gray-800 dark:stroke-gray-700"
                    />
                    <text x="-70" y="-35" fontSize="12" fill="#3b82f6" className="dark:fill-blue-400">
                        Exam Score
                    </text>
                    <text x="50" y="-35" fontSize="12" fill="#3b82f6" fontWeight="500" className="dark:fill-blue-400">
                        76%
                    </text>
                    <text x="-70" y="-10" fontSize="12" fill="#f97316" className="dark:fill-orange-400">
                        Attendance
                    </text>
                    <text x="50" y="-10" fontSize="12" fill="#f97316" fontWeight="500" className="dark:fill-orange-400">
                        87%
                    </text>
                    <text x="-70" y="15" fontSize="12" fill="#d8b4fe" className="dark:fill-purple-300">
                        Class Average
                    </text>
                    <text x="50" y="15" fontSize="12" fill="#d8b4fe" fontWeight="500" className="dark:fill-purple-300">
                        72%
                    </text>
                </g>
            </svg>
        </div>
    )
}