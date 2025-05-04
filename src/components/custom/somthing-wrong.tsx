'use client'
import { FileWarningIcon } from "lucide-react";

export default function SomethingWentWrong({ message }: { message: string }) {
    return (
        <div className="flex flex-col gap-2 items-center justify-center p-6 rounded-md bg-red-50 dark:bg-red-100/5">
            <div className="max-w-md space-y-2 text-center justify-items-center text-red-500 dark:text-red-700">
                <FileWarningIcon className="size-10" />
                <h3 className="text-lg font-semibold">{`Something went wrong`}</h3>
                <p className="text-sm">{`${message}`}</p>
                <p className="text-sm"> {`Please try again later.`}</p>
            </div>
        </div>
    );
}