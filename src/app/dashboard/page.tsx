import AllowNotification from "@/components/custom/allow-notification";
import TitlePage from "@/components/custom/page-heading";

export default function Page() {
  return (
    <>
      <TitlePage title="Dashboard" description="description" />
      <AllowNotification />
    </>
  );
}