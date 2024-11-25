'use client'

import { Guard } from "@/components/custom/permission-guard";
import { Button } from "@/components/ui/button";
import useModuleIdByName from "@/hooks/use-module-id";

export default function TestPage() {
    const moduleId = useModuleIdByName("Introduction") as string;
    
    return (
        <>
            <Guard permissionBit={1} moduleId={moduleId}>
                <p>Introduction</p>
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