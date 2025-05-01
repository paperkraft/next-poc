import TitlePage from "@/components/custom/page-heading";
import { Metadata } from "next";
import SendNotificationForm from "./SendNotificationForm";
import { getAllUser } from "@/app/action/auth.action";

export const metadata: Metadata = {
  title: "Push Notification",
  description: "Push Notification",
};

export default async function PushNotification() {
  const topics = ["system", "security", "promotions"];
  const users =  await getAllUser();
  
  return (
    <>
      <TitlePage title={"Push Notifications"} description={"Manage notifications and subscription"} />
      <SendNotificationForm topics={topics} users={users?.data ?? []} />
    </>
  );
}