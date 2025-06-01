import AllowNotification from "@/components/custom/allow-notification";
import Student from "./student";

export default async function Page() {

  return (
    <>
      <AllowNotification />
      <Student />
    </>
  );
}