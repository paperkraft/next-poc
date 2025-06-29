import AllowNotification from "@/components/custom/allow-notification";
import Student from "./student";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {

  const session = await auth();

  if (!session) {
    redirect('/access-denied')
  }

  return (
    <>
      <AllowNotification />
      <Student />
    </>
  );
}