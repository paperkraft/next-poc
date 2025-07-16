"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const recentActivities = [
    {
        id: 1,
        user: "Dr. Sarah Johnson",
        action: "Created new course",
        target: "Advanced Mathematics",
        timestamp: "2 hours ago",
        type: "course",
    },
    {
        id: 2,
        user: "Admin User",
        action: "Approved admission",
        target: "John Smith",
        timestamp: "4 hours ago",
        type: "admission",
    },
    {
        id: 3,
        user: "Prof. Michael Brown",
        action: "Updated syllabus",
        target: "Computer Science 101",
        timestamp: "6 hours ago",
        type: "course",
    },
    {
        id: 4,
        user: "Jane Doe",
        action: "Submitted assignment",
        target: "Physics Lab Report",
        timestamp: "8 hours ago",
        type: "assignment",
    },
    {
        id: 5,
        user: "System",
        action: "Generated report",
        target: "Monthly Attendance",
        timestamp: "1 day ago",
        type: "system",
    },
]

export function RecentActivitiesTable() {
    return (
        <div className="space-y-4">
            {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>
                            {activity.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{activity.user}</span>
                            <Badge variant="outline" className="text-xs">
                                {activity.type}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {activity.action} <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
