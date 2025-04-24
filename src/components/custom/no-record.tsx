import { FileX2 } from "lucide-react";

export default function NoRecordPage({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center p-6 rounded-md bg-blue-50 dark:bg-blue-100/5">
      <div className="max-w-md space-y-2 text-center justify-items-center text-blue-500 dark:text-blue-700">
        <FileX2 className="size-10" />
        <h3 className="text-lg font-semibold">{`No ${text}s have been created yet`}</h3>
        <p className="text-sm">
          {`You can create a new ${text} by clicking the [+] button`}
        </p>
      </div>
    </div>
  );
}