import Performance from "./Performance";
import StudyRecommendations from "./StudyRecommendations";
import UpcomingAssignments from "./UpcomingAssignments";
import UpcomingExams from "./UpcomingExams";
import WeeklySchedule from "./WeeklySchedule";

export default function Widgets() {
    return (
        <>
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Performance Charts - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                    <Performance />
                    <WeeklySchedule />
                </div>

                {/* Right Sidebar - 1/3 width */}
                <div className="space-y-6">
                    <UpcomingExams />
                    <StudyRecommendations />
                </div>
            </div>

            {/* Assignments Section */}
            <UpcomingAssignments />
        </>
    );
}