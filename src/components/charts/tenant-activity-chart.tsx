"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
    { type: "University", active: 1240, total: 1456 },
    { type: "College", active: 890, total: 1023 },
    { type: "School", active: 2340, total: 2678 },
    { type: "Society", active: 156, total: 189 },
]

export function TenantActivityChart() {
    return (
        <ChartContainer
            config={{
                active: {
                    label: "Active Users",
                    color: "hsl(var(--chart-1))",
                },
                total: {
                    label: "Total Users",
                    color: "hsl(var(--chart-2))",
                },
            }}
            className="h-[300px]"
        >
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                <Bar dataKey="active" fill="var(--color-active)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}
