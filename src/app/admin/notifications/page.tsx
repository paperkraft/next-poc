import { Metadata } from "next";
import NotificationsList from "./List";
import TitlePage from "@/components/custom/page-heading";

export const metadata: Metadata = {
    title: "Notification",
    description: "Manage all notifications",
};

export default async function NotificationsPage() {

    return (
        <>
            <TitlePage title="Notifications" description="Configure how you receive notifications." />
            <div className="p-1">
                <NotificationsList />
            </div>
        </>
    );
}