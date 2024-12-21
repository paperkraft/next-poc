'use client'
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function AccessDenied() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md space-y-4 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Access Denied</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Sorry, you do not have the necessary permission to access this page.
                </p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        </div>
    );
}