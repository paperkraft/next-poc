import TitlePage from "@/components/custom/page-heading";
import TenantForm from "../component/tenant-form";

export const metadata = {
    title: "Create New Tenant",
    description: "Set up a new tenant with all necessary configurations and settings.",
};

export default function Page() {
    return <>
        <TitlePage {...metadata} />
        <TenantForm />
    </>
}
