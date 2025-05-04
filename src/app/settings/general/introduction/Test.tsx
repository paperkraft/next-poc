'use client'

import { Guard } from "@/components/custom/permission-guard";
import { Button } from "@/components/ui/button";
import useModuleIdByName from "@/hooks/use-module-id";
import { useMounted } from "@/hooks/use-mounted";

export default function TestPage() {
    const mounted = useMounted();
    const moduleId = useModuleIdByName("Introduction") as string;
    
    return (
        mounted &&
        <>
            <Guard permissionBit={1} moduleId={moduleId}>
                <div className="flex gap-2">
                    <Guard permissionBit={1} moduleId={moduleId}>
                        <Button>View</Button>
                    </Guard>
                    <Guard permissionBit={2} moduleId={moduleId}>
                        <Button>Edit</Button>
                    </Guard>
                    <Guard permissionBit={4} moduleId={moduleId}>
                        <Button>Create</Button>
                    </Guard>
                    <Guard permissionBit={8} moduleId={moduleId}>
                        <Button>Delete</Button>
                    </Guard>
                </div>
            </Guard>
        </>
    );
}