'use client';

import axios from 'axios';
import { X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import {
    IGroupedModule, IModule, IRole, PermissionAction, PermissionPayload, PERMISSIONS
} from '@/types/permissions';

import { filterGroupedModules, groupModules } from './helper';
import { PermissionRow } from './PermissionRow';

type FormValues = { [key: string]: boolean };

export default function RolePermissionManager({ roles }: { roles: IRole[] }) {

    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [groupedModules, setGroupedModules] = useState<IGroupedModule[]>([]);
    const [openModules, setOpenModules] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);


    const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>({});
    const debouncedSearch = useDebounce(search, 300);

    const permissionKeys = useMemo(
        () => Object.keys(PERMISSIONS) as PermissionAction[],
        []
    );

    const openSet = useMemo(() => new Set<string>(), []);


    const filteredGroups = useMemo(
        () => filterGroupedModules(groupedModules, debouncedSearch, openSet),
        [groupedModules, debouncedSearch]
    );

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

        const fetchRoleModules = async () => {
            setLoading(true);

            try {
                const { data } = await axios.get(`/api/modules?roleId=${selectedRole}`);
                const sorted = data.sort((a: IModule, b: IModule) => a.position - b.position);
                const grouped = groupModules(sorted);
                setGroupedModules(grouped);

                const defaultValues: FormValues = {};

                const populateDefaults = (mod: IModule) => {
                    permissionKeys.forEach((key) => {
                        defaultValues[`${mod.id}_${key}`] =
                            Boolean(mod.permissions & PERMISSIONS[key]);
                    });
                    mod.subModules.forEach(populateDefaults);
                };

                sorted.forEach(populateDefaults);
                reset(defaultValues);

            } catch (error) {
                console.error("Error fetching modules:", error);
                toast.error("Failed to fetch modules.");
            } finally {
                setLoading(false);
            }

        }

        fetchRoleModules();

    }, [selectedRole, permissionKeys, reset]);

    const buildPayload = (groups: IGroupedModule[]): PermissionPayload[] => {
        const mapModule = (mod: IModule): PermissionPayload => {
            // let permissionBits = 0;
            // for (const key in PERMISSIONS) {
            //     if (watch(`${mod.id}_${key}`)) {
            //         permissionBits |= PERMISSIONS[key as keyof typeof PERMISSIONS];
            //     }
            // }

            const permissionBits = permissionKeys.reduce((acc, key) => {
                return watch(`${mod.id}_${key}`) ? acc | PERMISSIONS[key] : acc;
            }, 0);

            return {
                moduleId: mod.id,
                permissions: permissionBits,
                subModules: mod.subModules.map(mapModule),
            };
        };

        return groups.flatMap((group) => group.modules.map(mapModule));
    };

    const onSubmit = async () => {
        if (!selectedRole) return;
        setLoading(true);
        try {
            const payload = buildPayload(groupedModules);
            const { data } = await axios.post("/api/role-permissions", {
                roleId: selectedRole,
                modules: payload,
            });

            data.success
                ? toast.success("Permissions updated successfully!")
                : toast.error("Failed to update permissions.");

        } catch (error) {
            toast.error("An error occurred while saving.");
        }
        finally {
            setLoading(false);
            handleReset();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                        <SelectValue placeholder={"Select a role"} />
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
                                {permissionKeys.map((perm) => (
                                    <TableHead key={perm} className="text-center capitalize">{perm}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {filteredGroups.length === 0 && (
                                <TableRow className="border-t">
                                    <TableCell colSpan={permissionKeys.length + 2} className="text-center py-4 text-gray-500">
                                        No modules found for "{debouncedSearch}"
                                    </TableCell>
                                </TableRow>
                            )}


                            {filteredGroups.map((group, idx) => (
                                <React.Fragment key={group.groupName}>
                                    <TableRow className="bg-muted">
                                        <TableCell colSpan={permissionKeys.length + 2} className="font-semibold text-md">
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
