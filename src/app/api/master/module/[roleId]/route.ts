import { fetchModuleByRole } from "@/app/action/module.action";
import { NextRequest } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: { roleId: string } }) {
    const { roleId } = params;
    return fetchModuleByRole(roleId);
}