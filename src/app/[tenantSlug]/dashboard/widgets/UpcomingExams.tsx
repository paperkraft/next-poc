import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function UpcomingExams() {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Exams</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <ExamItem name="Critical Thinking Skills" date="Oct 25, 2024" readiness={75} />
                        <ExamItem name="Verbal Aptitude Assessment" date="Oct 28, 2024" readiness={60} />
                        <ExamItem name="Cognitive Abilities Test" date="Nov 3, 2024" readiness={45} />
                        <ExamItem name="Reading Comprehension" date="Nov 10, 2024" readiness={30} />
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full">
                        View All Exams
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}

function ExamItem({ name, date, readiness }: { name: string, date: string, readiness: number }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="font-medium">{name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
                </div>
                <Badge variant={readiness > 70 ? "success" : readiness > 50 ? "warning" : "destructive"} className="ml-2">
                    {readiness > 70 ? "Ready" : readiness > 50 ? "Preparing" : "Needs Work"}
                </Badge>
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <span>Readiness</span>
                    <span>{readiness}%</span>
                </div>
                <Progress value={readiness} className="h-1.5" />
            </div>
        </div>
    )
}
