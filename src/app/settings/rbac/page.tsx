import { getModulesWithSubmodules } from "@/app/master/module/page";
import AccessPage from "./AccessForm";
import TitlePage from "@/components/custom/page-heading";
import { Metadata } from "next";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Access Control",
    description: "Define role access",
};

export default async function Page() {
    const modules = await getModulesWithSubmodules();

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
            <AccessPage roles={roles} modules={modules} />
        </>
    )
}