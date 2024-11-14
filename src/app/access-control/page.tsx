import { auth } from "@/auth";
import AccessPage from "./AccessForm";
import TitlePage from "@/components/custom/page-heading";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Access Control",
    description: "Define role access",
};

export default async function Page() {
    const session = await auth();
    const userPermissions = session?.user?.role?.permissions;
    const permissionBit = 8;
    const hasPermission = ((userPermissions & permissionBit) === permissionBit);

    if (!hasPermission) {
        return <div>You do not have permission to access this page</div>;
    }

    return(
        <>
            <TitlePage title="Access Control" description="Define role access" />
            <AccessPage/>
        </>
    )
}