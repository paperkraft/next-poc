import { getModulesWithSubmodules } from "@/app/master/module/page";
import AccessPage from "./AccessForm";
import TitlePage from "@/components/custom/page-heading";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: "Access Control",
    description: "Define role access",
};

export default async function Page() {
    const modules = await getModulesWithSubmodules();
    const session = await auth()

    // await getModulesByRole(session?.user?.roleId).then(result => console.log(JSON.stringify(result, null, 2)))

    const roles = await prisma.role.findMany({
        select: {
            id: true,
            name: true,
            permissions: true,
        },
    });

    if (!modules) {
        return null
    }

    if (!roles) {
        return null
    }

    return (
        <>
            <TitlePage title="Role Based Access Control" description="Define role access" />
            <AccessPage roles={roles} modules={modules as any} />
        </>
    )
}


// async function getModulesByRole(roleId: string) {
//     const roleWithModules = await prisma.role.findUnique({
//         where: { id: roleId },
//         include: {
//             users: {
//                 include: {
//                     ModulePermissions: {
//                         include: {
//                             module: {
//                                 include: {
//                                     SubModules: true,
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         },
//     });

//     return roleWithModules;
// }