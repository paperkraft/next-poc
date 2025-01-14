import prisma from "@/lib/prisma";
import NotificationsList from "./List";
import TitlePage from "@/components/custom/page-heading";
import { auth } from "@/auth";

export interface Notifications {
    id: string;
    message: string;
    userId: string | null;
    status: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default async function NotificationsPage() {
    const session = await auth();
    const userId = session?.user?.id;
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "desc" },
        });

        return (
            <>
                <TitlePage title="Notifications" description="Configure how you receive notifications." />
                <div className="p-1">
                    <NotificationsList initialNotifications={notifications} />
                </div>
            </>
        );
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return (
            <>
                <TitlePage title="Notifications" description="Configure how you receive notifications." />
                <div className="p-1">
                    <div className="text-center text-muted-foreground">Failed to load notifications. Please try again later.</div>
                </div>
            </>
        );
    }
}
