import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, LineChart, User } from "lucide-react";

export default function StudyRecommendations() {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Study Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg dark:bg-blue-900">
                                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <h4 className="font-medium">Physics: Forces & Motion</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Based on your recent quiz results</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-green-100 p-2 rounded-lg dark:bg-green-900">
                                <LineChart className="h-5 w-5 text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <h4 className="font-medium">Calculus: Integration</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming exam in 2 weeks</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-purple-100 p-2 rounded-lg dark:bg-purple-900">
                                <User className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                            </div>
                            <div>
                                <h4 className="font-medium">English: Essay Structure</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Improve your writing skills</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full">
                        View Personalized Plan
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}