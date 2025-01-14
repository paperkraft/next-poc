import { getAllNotifications } from "@/app/action/notifications.action";
import { auth } from "@/auth";
import NotificationsList from "./List";
import TitlePage from "@/components/custom/page-heading";

export interface Notifications {
    id: string,
    message: string,
    userId: string,
    status: string,
    read: boolean,
    createdAt: string,
    updatedAt: string
}

export default async function Notifications() {
    return (
        <>
            <TitlePage title='Notifications' description='Configure how you receive notifications.' />
            <div className="p-1">
                <NotificationsList />
            </div>
        </>
    );
}