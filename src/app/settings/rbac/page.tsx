import AccessPage from "./AccessForm";
import TitlePage from "@/components/custom/page-heading";
import { Metadata } from "next";
import { getModulesWithSubmodules } from "@/lib/prisma-utils";
import NoRecordPage from "@/components/custom/no-record";
import { fetchRoles } from "@/app/master/role/page";

export const metadata: Metadata = {
    title: "Access Control",
    description: "Define role access",
};

export default async function Page() {
    const modules = await getModulesWithSubmodules();
    const roles = await fetchRoles();

    return (
        <div className="space-y-8 p-2">
            <TitlePage title="Role Based Access Control" description="Define role based module access" createPage />
            {roles && modules ? (
                <AccessPage roles={roles} modules={modules as any} />
            ) : (
                <NoRecordPage text={"access"} />
            )}
        </div>
    );
}