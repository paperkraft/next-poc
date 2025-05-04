'use client'

import { PermissionGuard } from "@/components/PermissionGuard";
import { Button } from "@/components/ui/button";
import useModuleIdByName from "@/hooks/use-module-id";
import { useMounted } from "@/hooks/use-mounted";

export default function TestPage() {
    const mounted = useMounted();
    const moduleId = useModuleIdByName("Introduction") as string;
    
    return (
        mounted &&
        <>
            <div className="flex gap-2">
                <PermissionGuard action="READ" moduleId={moduleId}>
                    <Button>View</Button>
                </PermissionGuard>
                <PermissionGuard action="UPDATE" moduleId={moduleId}>
                    <Button>Edit</Button>
                </PermissionGuard>
                <PermissionGuard action="WRITE" moduleId={moduleId}>
                    <Button>Create</Button>
                </PermissionGuard>
                <PermissionGuard action="DELETE" moduleId={moduleId}>
                    <Button>Delete</Button>
                </PermissionGuard>
            </div>
        </>
    );
}