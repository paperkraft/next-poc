import TitlePage from "@/components/custom/page-heading";
import { Metadata } from "next";
import SendPushNotification from "./SendPushNotification";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/rbac";
import AccessDenied from "@/components/custom/access-denied";

export const metadata: Metadata = {
  title: "Push Notification",
  description: "Push Notification",
};

export default async function PushNotification() {

  const session = await auth();
  const rolePermissions = +session?.user?.permissions;
  const permission = hasPermission(rolePermissions, 8);

  if (!permission) {
    return <AccessDenied />;
  }
  
  return (
    <>
      <TitlePage title={"Push Notifications"} description={"Manage notifications and subscription"} />
      <SendPushNotification />
    </>
  );
}