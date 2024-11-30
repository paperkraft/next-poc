'use client'
import { FileX2 } from "lucide-react";

export default function NoRecordPage({text}: {text:string}) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center p-6 bg-gray-100 rounded-md text-gray-700">
        <FileX2 className="size-10"/>
        <div className="text-center">
        <h3 className="text-lg font-semibold">{`No ${text}s have been created yet`}</h3>
        <p className="mt-2 text-sm">
            {`You can create a new ${text} by clicking the + button above.`}
        </p>
        </div>
    </div>
  );
}