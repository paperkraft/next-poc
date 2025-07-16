"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
    { time: "00:00", cpu: 45, memory: 62, storage: 78 },
    { time: "04:00", cpu: 52, memory: 58, storage: 79 },
    { time: "08:00", cpu: 78, memory: 72, storage: 80 },
    { time: "12:00", cpu: 85, memory: 81, storage: 82 },
    { time: "16:00", cpu: 92, memory: 85, storage: 83 },
    { time: "20:00", cpu: 67, memory: 71, storage: 84 },
    { time: "24:00", cpu: 48, memory: 59, storage: 85 },
]

export function SystemMetricsChart() {
    return (
        <ChartContainer
            config={{
                cpu: {
                    label: "CPU Usage",
                    color: "hsl(var(--chart-1))",
                },
                memory: {
                    label: "Memory Usage",
                    color: "hsl(var(--chart-2))",
                },
                storage: {
                    label: "Storage Usage",
                    color: "hsl(var(--chart-3))",
                },
            }}
            className="h-[300px]"
        >
            <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                    type="monotone"
                    dataKey="cpu"
                    stackId="1"
                    stroke="var(--color-cpu)"
                    fill="var(--color-cpu)"
                    fillOpacity={0.6}
                />
                <Area
                    type="monotone"
                    dataKey="memory"
                    stackId="1"
                    stroke="var(--color-memory)"
                    fill="var(--color-memory)"
                    fillOpacity={0.6}
                />
                <Area
                    type="monotone"
                    dataKey="storage"
                    stackId="1"
                    stroke="var(--color-storage)"
                    fill="var(--color-storage)"
                    fillOpacity={0.6}
                />
            </AreaChart>
        </ChartContainer>
    )
}
