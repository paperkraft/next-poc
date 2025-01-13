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
    const session = await auth();
    const res = await getAllNotifications(session?.user?.id).then((d) => d.json());
    const notifications: Notifications [] = res.data

    return (
        <>
            <TitlePage title='Notifications' description='Configure how you receive notifications.' />
            <div className="p-1">
                <NotificationsList notifications={notifications}/>
            </div>
        </>
    );
}