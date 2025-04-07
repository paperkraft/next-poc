'use client';

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { PERMISSIONS } from "@/types/permissions";
import { IModule, IRole } from "@/types/permissions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PermissionRow } from "./PermissionRow";
import { toast } from "sonner";
import { filterModulesByName } from "./helper";
import { useDebounce } from "@/hooks/use-debounce";

export default function RolePermissionManager({ roles }: { roles: IRole[] }) {
    const [modules, setModules] = useState<IModule[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const { control, handleSubmit, reset, watch, setValue } = useForm<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [openModules, setOpenModules] = useState<string[]>([]);
    const openSet = new Set<string>();

    const debouncedSearch = useDebounce(search, 300);
    const filteredModules = filterModulesByName(modules, debouncedSearch, openSet);

    useEffect(() => {
        setOpenModules(Array.from(openSet));
    }, [debouncedSearch]);

    useEffect(() => {
        if (!selectedRole) return;
        setLoading(true);

        axios.get(`/api/modules?roleId=${selectedRole}`).then((res) => {
            const moduleData = res.data as IModule[];
            setModules(moduleData);

            const defaultValues: { [key: string]: boolean } = {};

            const fillValues = (mod: IModule) => {
                for (const key in PERMISSIONS) {
                    defaultValues[`${mod.id}_${key}`] = Boolean(mod.permissions & PERMISSIONS[key as keyof typeof PERMISSIONS]);
                }
                mod.subModules.forEach(fillValues);
            };
            moduleData.forEach(fillValues);
            reset(defaultValues);
            setLoading(false);
        });

    }, [selectedRole, reset]);

    const buildPayload = (mods: IModule[]): any[] => {
        return mods.map((mod) => {
            let permissionBits = 0;
            for (const key in PERMISSIONS) {
                if (watch(`${mod.id}_${key}`)) {
                    permissionBits |= PERMISSIONS[key as keyof typeof PERMISSIONS];
                }
            }
            return {
                moduleId: mod.id,
                permissions: permissionBits,
                subModules: buildPayload(mod.subModules),
            };
        });
    };

    const onSubmit = async () => {
        const payload = buildPayload(modules);
        await axios.post("/api/role-permissions", { roleId: selectedRole, modules: payload });
        toast.success("Permissions updated!");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                        <SelectValue placeholder={"Select"} />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleSubmit(onSubmit)} disabled={!selectedRole}>Save</Button>
            </div>

            {loading && <p className="text-gray-500">Loading...</p>}

            {!loading && modules.length > 0 && (
                <>
                    <input
                        type="text"
                        placeholder="Search modules..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 py-2 border rounded-md w-full max-w-md text-sm"
                    />

                    <Table className="w-full border">
                        <TableHeader className="bg-gray-50 dark:bg-gray-800">
                            <TableRow>
                                <TableHead className="text-left p-2">Module</TableHead>
                                <TableHead className="text-center capitalize">Check All</TableHead>
                                {Object.keys(PERMISSIONS).map((perm) => (
                                    <TableHead key={perm} className="text-center capitalize">{perm}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredModules.map((mod) => (
                                <PermissionRow
                                    key={mod.id}
                                    mod={mod}
                                    level={0}
                                    modules={modules}
                                    control={control}
                                    watch={watch}
                                    setValue={setValue}
                                    openModules={openModules}
                                    setOpenModules={setOpenModules}
                                    debouncedSearch={debouncedSearch}
                                />
                            ))}

                            {filteredModules.length === 0 && (
                                <TableRow className="border-t">
                                    <TableCell colSpan={Object.keys(PERMISSIONS).length + 2} className="text-center py-4 text-gray-500">
                                        No modules found for "{debouncedSearch}"
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </>
            )}
        </div>
    );
}
