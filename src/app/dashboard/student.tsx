'use client';

import { ReactNode, useState } from "react";
import { Clock, Flame, Info, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { useMounted } from "@/hooks/use-mounted";

export default function Student() {
    const [showBanner, setShowBanner] = useState(true);
    const mounted = useMounted();

    return (
        mounted &&
        <section className="flex-1 p-4 md:p-6 overflow-auto">
            {showBanner && <UpgradeBanner onClose={() => setShowBanner(false)} />}
            <DashboardHeader />
            <MetricsGrid />
        </section>
    );
}

function UpgradeBanner({ onClose }: { onClose: () => void }) {
    return (
        <div className="relative flex items-center justify-between p-3 border border-blue-100 rounded-lg mb-6 bg-blue-50/50 dark:bg-blue-950/50 dark:border-blue-900">
            <div className="flex items-center gap-2">
                <div>
                    <Info className="size-5 text-blue-500" />
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                    Upgrade your plan today to access premium features and resources!
                </p>
                <Button variant="link" className="text-blue-600 font-medium p-0 dark:text-blue-400">
                    Upgrade Now
                </Button>
            </div>
            <Button variant="ghost" size="icon" className="size-6 rounded-full" onClick={onClose}>
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}

function DashboardHeader() {
    const { data } = useSession();
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold">Welcome back, {data?.user?.name?.split(' ')[0]}!</h1>
                <p className="text-gray-500 dark:text-gray-400">Here's your learning progress this semester</p>
            </div>
            <Select defaultValue="monthly">
                <SelectTrigger className="w-32">
                    <SelectValue placeholder="Monthly" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

function MetricsGrid() {
    const metrics = [
        { title: "Study Hours", value: "64", change: 3.2, period: "last week", icon: <Clock className="h-5 w-5 text-blue-500" />, tooltip: "Total hours spent studying this week" },
        { title: "Tasks Completed", value: "1,349", change: 3.2, period: "last week", icon: <Trophy className="h-5 w-5 text-green-500" />, tooltip: "Total number of assignments and tasks completed" },
        { title: "Streak Days", value: "76", change: 3.2, period: "last week", icon: <Flame className="h-5 w-5 text-orange-500" />, tooltip: "Consecutive days with learning activity" },
        { title: "Total Score", value: "3,980", change: 2.2, period: "last month", icon: <Trophy className="h-5 w-5 text-purple-500" />, tooltip: "Cumulative points earned across all courses" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
            ))}
        </div>
    );
}

function MetricCard({ title, value, change, period, icon, tooltip }: { title: string, value: string, change: number, period: string, icon: ReactNode, tooltip: string }) {
    return (
        <TooltipProvider>
            <Card>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div>{icon}</div>
                            <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">{title}</h3>
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                                    <Info className="h-4 w-4 text-gray-400" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="flex flex-wrap justify-between items-end">
                        <div className="text-xl font-bold">{value}</div>
                        <div className="flex flex-wrap items-center gap-1">
                            <Badge variant={'success'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                    <path d="m18 15-6-6-6 6" />
                                </svg>
                                {change}%
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{period}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
