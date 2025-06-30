import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Calendar, BarChart3, Clock, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data - replace with actual database queries
async function getFacultyStats() {
    return {
        assignedClasses: 4,
        totalStudents: 120,
        todayClasses: 2,
        upcomingAssignments: 3,
        pendingGrades: 15,
        attendanceRate: 92,
        recentClasses: [
            {
                id: 1,
                name: "Introduction to Computer Science",
                code: "CS101",
                time: "09:00 AM",
                students: 30,
                room: "Room 101"
            },
            {
                id: 2,
                name: "Data Structures",
                code: "CS201",
                time: "02:00 PM",
                students: 25,
                room: "Room 205"
            }
        ],
        upcomingTasks: [
            {
                id: 1,
                title: "Grade Midterm Exams",
                course: "CS101",
                dueDate: "2024-12-15",
                priority: "high"
            },
            {
                id: 2,
                title: "Prepare Final Lecture",
                course: "CS201",
                dueDate: "2024-12-18",
                priority: "medium"
            },
            {
                id: 3,
                title: "Submit Attendance Report",
                course: "CS101",
                dueDate: "2024-12-20",
                priority: "low"
            }
        ]
    }
}

export default async function FacultyDashboard() {

    const stats = await getFacultyStats()

    const statCards = [
        {
            title: "Assigned Classes",
            value: stats.assignedClasses,
            icon: BookOpen,
            description: "Active courses",
            color: "text-blue-600"
        },
        {
            title: "Total Students",
            value: stats.totalStudents,
            icon: Users,
            description: "Across all classes",
            color: "text-green-600"
        },
        {
            title: "Today's Classes",
            value: stats.todayClasses,
            icon: Calendar,
            description: "Scheduled for today",
            color: "text-purple-600"
        },
        {
            title: "Pending Grades",
            value: stats.pendingGrades,
            icon: BarChart3,
            description: "Awaiting evaluation",
            color: "text-orange-600"
        }
    ]

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800'
            case 'medium': return 'bg-yellow-100 text-yellow-800'
            case 'low': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Manage your classes, students, and academic activities
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Today's Classes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5" />
                            <span>Today's Classes</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentClasses.map((classItem) => (
                                <div key={classItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                                        <p className="text-sm text-gray-500">{classItem.code} • {classItem.room}</p>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <span className="text-sm text-gray-600">
                                                <Users className="h-4 w-4 inline mr-1" />
                                                {classItem.students} students
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-blue-600">{classItem.time}</p>
                                        <button className="mt-1 text-sm text-blue-600 hover:text-blue-800">
                                            Start Class
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5" />
                            <span>Upcoming Tasks</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.upcomingTasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                                        <p className="text-sm text-gray-500">{task.course}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge className={getPriorityColor(task.priority)}>
                                        {task.priority}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</p>
                            <p className="text-sm text-gray-600">Average Attendance</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{stats.assignedClasses}</p>
                            <p className="text-sm text-gray-600">Active Courses</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">{stats.totalStudents}</p>
                            <p className="text-sm text-gray-600">Total Students</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">{stats.upcomingAssignments}</p>
                            <p className="text-sm text-gray-600">Upcoming Deadlines</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                            <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                            <h3 className="font-medium">Create Assignment</h3>
                            <p className="text-sm text-gray-500">Add new assignment for students</p>
                        </button>

                        <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                            <Users className="h-8 w-8 text-green-600 mb-2" />
                            <h3 className="font-medium">Take Attendance</h3>
                            <p className="text-sm text-gray-500">Record class attendance</p>
                        </button>

                        <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                            <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                            <h3 className="font-medium">Grade Submissions</h3>
                            <p className="text-sm text-gray-500">Review and grade student work</p>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}