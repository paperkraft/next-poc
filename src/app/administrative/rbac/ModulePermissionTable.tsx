'use client';

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { PERMISSIONS } from "@/types/permissions";
import { Module, Role } from "@/types/permissions";

export default function RolePermissionManager() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const { control, handleSubmit, reset, watch, setValue } = useForm<{ [key: string]: boolean }>({});

    useEffect(() => {
        axios.get("/api/roles").then((res) => setRoles(res.data));
    }, []);

    useEffect(() => {
        if (!selectedRole) return;
        axios.get(`/api/modules?roleId=${selectedRole}`).then((res) => {
            const moduleData = res.data as Module[];
            setModules(moduleData);

            const defaultValues: { [key: string]: boolean } = {};

            const fillValues = (mod: Module) => {
                for (const key in PERMISSIONS) {
                    defaultValues[`${mod.id}_${key}`] = Boolean(mod.permissions & PERMISSIONS[key as keyof typeof PERMISSIONS]);
                }
                mod.subModules.forEach(fillValues);
            };
            moduleData.forEach(fillValues);
            reset(defaultValues);
        });
    }, [selectedRole, reset]);

    const buildPayload = (mods: Module[]): any[] => {
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
        alert("Permissions updated!");
    };

    const renderModule = (mod: Module, level = 0,): JSX.Element => {

        return (
            <>
                <tr className={`border-t ${level > 0 ? 'bg-gray-50' : ''}`}>
                    <td className={`pl-${level * 4} py-2`}>
                        {mod.name}
                    </td>

                    <td className="text-center">
                        <Checkbox
                            checked={Object.keys(PERMISSIONS).every((perm) => watch(`${mod.id}_${perm}`))}
                            onCheckedChange={(val) => {
                                Object.keys(PERMISSIONS).forEach((perm) => {
                                    setValue(`${mod.id}_${perm}`, Boolean(val));
                                });

                                if (!val) {
                                    const clearChildren = (m: Module) => {
                                        m.subModules.forEach((sub) => {
                                            Object.keys(PERMISSIONS).forEach((perm) => {
                                                setValue(`${sub.id}_${perm}`, false);
                                            });
                                            clearChildren(sub);
                                        });
                                    };
                                    clearChildren(mod);
                                }
                            }}
                        />
                    </td>

                    {Object.keys(PERMISSIONS).map((perm) => (
                        <td key={perm} className="text-center">
                            <Controller
                                name={`${mod.id}_${perm}`}
                                control={control}
                                render={({ field }) => {
                                    const isChecked = field.value;

                                    const handleChange = (val: boolean) => {
                                        field.onChange(val);

                                        const updateChildren = (m: Module, value: boolean) => {
                                            m.subModules.forEach((sub) => {
                                                setValue(`${sub.id}_${perm}`, value);
                                                updateChildren(sub, value);
                                            });
                                        };

                                        const updateParent = (current: Module, parentModules: Module[]) => {
                                            const parent = parentModules.find((pm) => pm.id === current.parentId);
                                            if (!parent) return;

                                            const hasAnyChildWithPermission = parent.subModules.some((sub) => watch(`${sub.id}_${perm}`));
                                            setValue(`${parent.id}_${perm}`, hasAnyChildWithPermission);
                                            updateParent(parent, parentModules);
                                        };

                                        if (!val) {
                                            // If parent is unchecked, uncheck children
                                            updateChildren(mod, false);
                                        } else {
                                            // Parent checked, allow children to be enabled
                                            updateParent(mod, modules);
                                        }
                                    };

                                    // Disable checkbox if parent is not checked
                                    let disabled = false;
                                    if (mod.parentId) {
                                        const parentChecked = Object.keys(PERMISSIONS).some((p) => watch(`${mod.parentId}_${p}`));
                                        disabled = !parentChecked;
                                    }

                                    return (
                                        <Checkbox
                                            checked={isChecked}
                                            disabled={disabled}
                                            onCheckedChange={handleChange}
                                        />
                                    )
                                }}
                            />
                        </td>
                    ))}
                </tr>

                {mod.subModules.map((sub) => renderModule(sub, level + 1))}
            </>
        );
    };

    return (
        <div className="p-4 space-y-4">
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

            {modules.length > 0 && (
                <table className="w-full border mt-4">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left p-2">Module</th>
                            <th className="text-center capitalize">Check All</th>
                            {Object.keys(PERMISSIONS).map((perm) => (
                                <th key={perm} className="text-center capitalize">{perm}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {modules.map((mod) => renderModule(mod))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
