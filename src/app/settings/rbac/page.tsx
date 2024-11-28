import AccessPage from "./AccessForm";
import TitlePage from "@/components/custom/page-heading";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getModulesWithSubmodules } from "@/lib/prisma-utils";

export const metadata: Metadata = {
    title: "Access Control",
    description: "Define role access",
};

export default async function Page() {
    
    try {
        const modules = await getModulesWithSubmodules();
        const roles = await prisma.role.findMany({
            select: { id: true, name: true, permissions: true }
        });

        if (!modules) {
            return <>Failed to fetch data Modules</>
        }
    
        if (!roles) {
            return <>Failed to fetch data Roles</>
        }
        return (
            <>
                <TitlePage title="Role Based Access Control" description="Define role based module access" />
                {modules && <AccessPage roles={roles} modules={modules as any} />}
            </>
        )
    } catch (error) {
        console.error(error);
        return <>Failed to fetch data...</>
    }
}