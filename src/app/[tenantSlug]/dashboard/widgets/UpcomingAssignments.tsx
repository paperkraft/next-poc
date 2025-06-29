import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UpcomingAssignments() {
    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Upcoming Assignments</CardTitle>
                        <Button variant="outline">View All</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b ">
                                    <th className="text-left py-2 font-medium text-sm text-gray-600 dark:text-gray-300">
                                        Assignment
                                    </th>
                                    <th className="text-left py-2 font-medium text-sm text-gray-600 dark:text-gray-300">Course</th>
                                    <th className="text-left py-2 font-medium text-sm text-gray-600 dark:text-gray-300">
                                        Due Date
                                    </th>
                                    <th className="text-left py-2 font-medium text-sm text-gray-600 dark:text-gray-300">Status</th>
                                    <th className="text-left py-2 font-medium text-sm text-gray-600 dark:text-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AssignmentRow
                                    name="Research Paper: Modern UI/UX Principles"
                                    course="UI/UX Design"
                                    dueDate="Oct 24, 2024"
                                    status="Not Started"
                                />
                                <AssignmentRow
                                    name="Problem Set 3: Algorithms"
                                    course="Computer Science"
                                    dueDate="Oct 26, 2024"
                                    status="In Progress"
                                />
                                <AssignmentRow
                                    name="Lab Report: Wave Properties"
                                    course="Physics"
                                    dueDate="Oct 28, 2024"
                                    status="Not Started"
                                />
                                <AssignmentRow
                                    name="Essay: Literary Analysis"
                                    course="English Literature"
                                    dueDate="Nov 2, 2024"
                                    status="Not Started"
                                />
                                <AssignmentRow
                                    name="Group Project: Data Visualization"
                                    course="Statistics"
                                    dueDate="Nov 5, 2024"
                                    status="Not Started"
                                />
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

function AssignmentRow({ name, course, dueDate, status }: { name: string, course: string, dueDate: string, status: string }) {
    return (
        <tr className="border-b ">
            <td className="py-3 text-sm">{name}</td>
            <td className="py-3 text-sm">{course}</td>
            <td className="py-3 text-sm">{dueDate}</td>
            <td className="py-3 text-sm">
                <Badge variant={status === "Completed" ? "success" : status === "In Progress" ? "warning" : "outline"}>
                    {status}
                </Badge>
            </td>
            <td className="py-3 text-sm">
                <Button variant="link" className="text-blue-600 p-0 h-auto dark:text-blue-400">
                    Start
                </Button>
            </td>
        </tr>
    )
}