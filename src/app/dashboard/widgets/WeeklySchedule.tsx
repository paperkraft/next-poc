import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WeeklySchedule() {
    return (
        <>
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle>Weekly Schedule</CardTitle>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm">Oct 16-22, 2024</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
                            <div className="grid grid-cols-6 gap-2 mb-2">
                                <div className="text-gray-500 text-sm"></div>
                                <div className="text-gray-500 text-sm text-center">09:00 AM</div>
                                <div className="text-gray-500 text-sm text-center">10:00 AM</div>
                                <div className="text-gray-500 text-sm text-center">11:00 AM</div>
                                <div className="text-gray-500 text-sm text-center">12:00 PM</div>
                                <div className="text-gray-500 text-sm text-center">01:00 PM</div>
                            </div>
                            <ScheduleRow day="Mon" />
                            <ScheduleRow day="Tue" />
                            <ScheduleRow day="Wed" />
                            <ScheduleRow day="Thu" />
                            <ScheduleRow day="Fri" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full">
                        View Full Schedule
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}

function ScheduleRow({ day }: { day: string }) {
    return (
        <div className="grid grid-cols-6 gap-2 h-16 mb-2">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">{day}</div>
            <div className="col-span-5 grid grid-cols-5 gap-2 relative">
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-sm px-1 text-xs flex flex-col justify-center dark:bg-blue-950 dark:border-blue-500">
                    <div className="font-medium">Mathematics</div>
                    <div className="text-gray-500 dark:text-gray-400">Calculus</div>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-sm px-1 text-xs flex flex-col justify-center dark:bg-orange-950 dark:border-orange-500">
                    <div className="font-medium">Physics</div>
                    <div className="text-gray-500 dark:text-gray-400">Mechanics</div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-sm px-1 text-xs flex flex-col justify-center dark:bg-blue-950 dark:border-blue-500">
                    <div className="font-medium">UI/UX Design</div>
                    <div className="text-gray-500 dark:text-gray-400">Lesson 6</div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 rounded-r-sm px-1 text-xs flex flex-col justify-center dark:bg-green-950 dark:border-green-500">
                    <div className="font-medium">Computer Sci</div>
                    <div className="text-gray-500 dark:text-gray-400">Algorithms</div>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r-sm px-1 text-xs flex flex-col justify-center dark:bg-purple-950 dark:border-purple-500">
                    <div className="font-medium">English</div>
                    <div className="text-gray-500 dark:text-gray-400">Literature</div>
                </div>
            </div>
        </div>
    )
}
