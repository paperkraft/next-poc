'use client'
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function AccessDenied() {
    const router = useRouter();
    return (
        <div className="flex flex-col gap-2 items-center justify-center p-6 bg-accent rounded-md h-[80vh]">
            <div className="max-w-md space-y-4 text-center">
                <h1 className="text-xl font-semibold tracking-tight sm:text-4xl">Access Denied</h1>
                <p className="text-muted-foreground">
                    Sorry, you do not have the necessary permission to access this page.
                </p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        </div>
    );
}