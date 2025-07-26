import TitlePage from "@/components/custom/page-heading";
import TenantCreation from "./tenant-creation";

export const metadata = {
    title: "Create New Tenant",
    description: "Set up a new tenant with all necessary configurations and settings.",
};

export default function Page() {
    return <>
        <TitlePage {...metadata} />
        <TenantCreation />
    </>
}
