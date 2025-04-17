'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { IGroupedModule, PermissionPayload, PERMISSIONS } from "@/types/permissions";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IModule, IRole } from "@/types/permissions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PermissionRow } from "./PermissionRow";
import { toast } from "sonner";
import { filterGroupedModules, groupModules, } from "./helper";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export default function RolePermissionManager({ roles }: { roles: IRole[] }) {

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [openModules, setOpenModules] = useState<string[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [groupedModules, setGroupedModules] = useState<IGroupedModule[]>([]);

    const { control, handleSubmit, reset, watch, setValue } = useForm<{ [key: string]: boolean }>({});

    const openSet = new Set<string>();

    const debouncedSearch = useDebounce(search, 300);
    const filteredGroups = filterGroupedModules(groupedModules, debouncedSearch, openSet);

    const handleReset = () => {
        setSearch("");
        setOpenModules([]);
        openSet.clear();
    };

    useEffect(() => {
        setOpenModules(Array.from(openSet));
    }, [debouncedSearch]);

    useEffect(() => {
        if (!selectedRole) return;
        setLoading(true);

        axios.get(`/api/modules?roleId=${selectedRole}`).then((res) => {
            const moduleData = res.data as IModule[];
            const sortedModules = moduleData && moduleData.sort((a, b) => a.position - b.position);
            setGroupedModules(groupModules(sortedModules));
            console.log(groupModules(sortedModules));

            // Reset the form with default values based on permissions
            const defaultValues: { [key: string]: boolean } = {};

            const fillValues = (mod: IModule) => {
                for (const key in PERMISSIONS) {
                    defaultValues[`${mod.id}_${key}`] = Boolean(mod.permissions & PERMISSIONS[key as keyof typeof PERMISSIONS]);
                }
                mod.subModules.forEach(fillValues);
            };

            moduleData.forEach(fillValues);
            reset(defaultValues);

        }).finally(() => {
            setLoading(false);
        })

    }, [selectedRole, reset]);

    const buildPayload = (groups: IGroupedModule[]): PermissionPayload[] => {
        const mapModule = (mod: IModule): PermissionPayload => {
            let permissionBits = 0;

            for (const key in PERMISSIONS) {
                if (watch(`${mod.id}_${key}`)) {
                    permissionBits |= PERMISSIONS[key as keyof typeof PERMISSIONS];
                }
            }

            return {
                moduleId: mod.id,
                permissions: permissionBits,
                subModules: mod.subModules.map(mapModule),
            };
        };

        return groups.flatMap((group) => group.modules.map(mapModule));
    };

    const onSubmit = async () => {
        setLoading(true);
        const payload = buildPayload(groupedModules);
        await axios.post("/api/role-permissions", { roleId: selectedRole, modules: payload })
            .then((res) => {
                if (res.data.success) {
                    toast.success("Permissions updated successfully!");
                } else {
                    toast.error("Failed to update permissions.");
                }
            }).finally(() => {
                setLoading(false);
                handleReset();
            })
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
                <Button onClick={handleSubmit(onSubmit)} disabled={!selectedRole || loading}>Save</Button>
            </div>

            {loading && <p className="text-gray-500">Loading...</p>}

            {!loading && groupedModules.length > 0 && (
                <>
                    <div className="relative mb-4 flex items-center w-full max-w-md">
                        <Input
                            type="text"
                            placeholder="Search modules..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (<X size={16} className="absolute right-3 cursor-pointer opacity-50 hover:text-primary hover:opacity-100" onClick={handleReset} />)}
                    </div>

                    <Table className="w-full border">
                        <TableHeader className="bg-gray-50 dark:bg-gray-800">
                            <TableRow>
                                <TableHead className="text-left p-2">Module</TableHead>
                                <TableHead className="text-center capitalize">All</TableHead>
                                {Object.keys(PERMISSIONS).map((perm) => (
                                    <TableHead key={perm} className="text-center capitalize">{perm}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {filteredGroups.length === 0 && (
                                <TableRow className="border-t">
                                    <TableCell colSpan={Object.keys(PERMISSIONS).length + 2} className="text-center py-4 text-gray-500">
                                        No modules found for "{debouncedSearch}"
                                    </TableCell>
                                </TableRow>
                            )}


                            {filteredGroups.map((group, idx) => (
                                <React.Fragment key={group.groupName}>
                                    <TableRow className="bg-muted">
                                        <TableCell colSpan={Object.keys(PERMISSIONS).length + 2} className="font-semibold text-md">
                                            {group.groupName}
                                        </TableCell>
                                    </TableRow>

                                    {group.modules.map((mod: IModule) => (
                                        <PermissionRow
                                            key={mod.id}
                                            mod={mod}
                                            level={0}
                                            modules={group.modules}
                                            control={control}
                                            watch={watch}
                                            setValue={setValue}
                                            openModules={openModules}
                                            setOpenModules={setOpenModules}
                                            debouncedSearch={debouncedSearch}
                                        />
                                    ))}

                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </>
            )}
        </div>
    );
}
