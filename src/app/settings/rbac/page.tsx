import AccessPage from "./AccessForm";
import TitlePage from "@/components/custom/page-heading";
import { Metadata } from "next";
import NoRecordPage from "@/components/custom/no-record";
import { fetchRoles } from "@/app/action/role.action";
import { fetchModules } from "@/app/action/module.action";
import SomethingWentWrong from "@/components/custom/somthing-wrong";

export const metadata: Metadata = {
    title: "Access Control",
    description: "Define role access",
};

export default async function Page() {
    const modules = await fetchModules().then((d)=>d.json());
    const roles = await fetchRoles().then((d)=>d.json());

    return (
        <div className="space-y-8 p-2">
            <TitlePage title="Role Based Access Control" description="Define role based module access" createPage />
            {
                modules.success && roles.success 
                ? modules.data.length > 0 && roles.data.length > 0
                ? <AccessPage roles={roles.data} modules={modules.data} />
                : <NoRecordPage text={ modules.data.length > 0 ? "role" : "module"} />
                : <SomethingWentWrong message={modules.success ? roles.message : modules.message} />
            }
        </div>
    );
}