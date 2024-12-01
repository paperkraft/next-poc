'use client'
import { FileWarningIcon } from "lucide-react";

export default function SomethingWentWrong({ message }: { message: string }) {
    return (
        <div className="flex flex-col gap-2 items-center justify-center p-6 bg-gray-50 rounded-md">
            <FileWarningIcon className="size-10" />
            <div className="text-center">
                <h3 className="text-lg font-semibold">{`Something went wrong`}</h3>
                <p className="mt-2 text-sm">{`${message}`}</p>
                <p className="mt-2 text-sm"> {`Please try again later.`}</p>
            </div>
        </div>
    );
}