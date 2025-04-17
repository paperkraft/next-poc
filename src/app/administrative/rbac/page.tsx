import { Metadata } from "next";
import TitlePage from "@/components/custom/page-heading";
import NoRecordPage from "@/components/custom/no-record";
import SomethingWentWrong from "@/components/custom/somthing-wrong";
import { fetchRoles } from "@/app/action/role.action";
import RolePermissionsPage from "./RolePermissionManager";

export const metadata: Metadata = {
    title: "Access Control",
    description: "Define role access",
};

export default async function RBAC() {
    const roles = await fetchRoles().then((d) => d.json());
    const isRoles = roles && roles.success
    const hasRoles = isRoles && roles?.data?.length > 0;

    return (
        <div className="space-y-4 p-2">
            <TitlePage title="Role Based Access Control" description="Define role based module access" createPage />
            {
                isRoles
                    ? hasRoles
                        ? <RolePermissionsPage roles={roles.data}/>
                        : <NoRecordPage text="role" />
                    : <SomethingWentWrong message={roles.message} />
            }
        </div>
    );
}