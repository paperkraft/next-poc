import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
    step: number;
    totalSteps: number;
}

export default function ProgressBar({ step, totalSteps }: ProgressBarProps) {
    const progress = (step / totalSteps) * 100;

    return (
        <div className="w-full flex flex-col items-center">
            <Progress value={progress} className="w-full h-2 bg-gray-200" />
            <span className="text-sm text-gray-500 mt-2">{Math.round(progress)}% Completed</span>
        </div>
    );
}