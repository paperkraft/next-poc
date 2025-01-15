import Profile from "./ProfileForm";
import { Metadata } from "next";
import TitlePage from "@/components/custom/page-heading";
import LastLoginSession from "./LastLoginSession";
import { auth } from "@/auth";
import { getLastThreeLogins } from "../action/audit.action";

export const metadata: Metadata = {
    title: "Profile",
    description: "Update profile",
};

export default async function Page() {
    const session = await auth();
    const lastLogins = session && await getLastThreeLogins(session?.user?.id);
    return(
        <>
            <TitlePage title={"Profile"} description={"This is how others will see you"}/>
            <Profile/>
            <p>Last 3 login details</p>
            {lastLogins && <LastLoginSession lastLogins={lastLogins}/>}
        </>
    ) 
}