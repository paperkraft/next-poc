"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
    { month: "Aug", enrolled: 2650, graduated: 0 },
    { month: "Sep", enrolled: 2720, graduated: 0 },
    { month: "Oct", enrolled: 2785, graduated: 0 },
    { month: "Nov", enrolled: 2810, graduated: 0 },
    { month: "Dec", enrolled: 2825, graduated: 0 },
    { month: "Jan", enrolled: 2847, graduated: 245 },
]

export function TenantDashboardChart() {
    return (
        <ChartContainer
            config={{
                enrolled: {
                    label: "Enrolled Students",
                    color: "hsl(var(--chart-1))",
                },
                graduated: {
                    label: "Graduated Students",
                    color: "hsl(var(--chart-2))",
                },
            }}
            className="h-[300px]"
        >
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                    type="monotone"
                    dataKey="enrolled"
                    stroke="var(--color-enrolled)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-enrolled)" }}
                />
                <Line
                    type="monotone"
                    dataKey="graduated"
                    stroke="var(--color-graduated)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-graduated)" }}
                />
            </LineChart>
        </ChartContainer>
    )
}