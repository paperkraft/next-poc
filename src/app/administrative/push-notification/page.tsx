import TitlePage from "@/components/custom/page-heading";
import { Metadata } from "next";
import SendPushNotification from "./SendPushNotification";

export const metadata: Metadata = {
  title: "Push Notification",
  description: "Push Notification",
};

export default async function PushNotification() {
  return (
    <>
      <TitlePage title={"Push Notifications"} description={"Manage notifications and subscription"} />
      <SendPushNotification />
    </>
  );
}