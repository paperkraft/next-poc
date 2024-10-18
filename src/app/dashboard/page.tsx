'use client'
import DialogBox from "@/components/custom/dialog-box";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  const mounted = useMounted();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if(mounted && user?.name === null){
      setOpen(true);
    }
  },[user, mounted])

  const handleClose = () => {
    setOpen(false);
  }

  return(
    mounted &&
    <>
      <TitlePage title="Dashboard" description="description" />
      <DialogBox open={open} setClose={handleClose} title={"Profile Incomplete"}>
        <p> Hi <b>{user?.email}</b>,</p>
        <p>Welcome to Webdesk! It looks like your profile is incomplete. </p>
        <p>To enhance your experience, please complete your profile by visiting your profile settings..</p><br/>
        <p>It only takes a few minutes!</p>
        <p>Your profile information helps us serve you better!</p><br/>
        <p>Thanks for joining us!</p>
        <div className="mt-4 flex gap-2">
          <Button asChild>
            <Link href={'/profile'}>Go to Profile Settings</Link>
          </Button>
        </div>
      </DialogBox>
    </>
  )
} 
