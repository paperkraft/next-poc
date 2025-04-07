'use client';

import React from "react";
import { Controller, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { IModule } from "@/types/permissions";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRow, TableCell } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PERMISSIONS } from "@/types/permissions";
import fuzzysort from "fuzzysort";

type Props = {
    mod: IModule;
    level: number;
    modules: IModule[];
    control: any;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
    openModules: string[];
    setOpenModules: React.Dispatch<React.SetStateAction<string[]>>;
    debouncedSearch: string;
};

export const PermissionRow: React.FC<Props> = ({ mod, level, modules, control, watch, setValue, openModules, setOpenModules, debouncedSearch }) => {
    const permissionKeys = Object.keys(PERMISSIONS) as (keyof typeof PERMISSIONS)[];
    const hasSubModules = mod?.subModules?.length > 0;

    const updateChildren = (m: IModule, perm: string, value: boolean) => {
        m.subModules.forEach((sub) => {
            setValue(`${sub.id}_${perm}`, value);
            updateChildren(sub, perm, value);
        });
    };

    const updateParent = (current: IModule, perm: string) => {
        const parent = modules.find((pm) => pm.id === current.parentId);
        if (!parent) return;

        const hasAnyChild = parent.subModules.some((sub) => watch(`${sub.id}_${perm}`));
        setValue(`${parent.id}_${perm}`, hasAnyChild);
        updateParent(parent, perm);
    };

    return (
        <Collapsible asChild key={mod.id}
            open={openModules.includes(mod.id)}
            onOpenChange={(isOpen) => {
                setOpenModules((prev) => isOpen ? [...prev, mod.id] : prev.filter((id) => id !== mod.id));
            }}
        >
            <>
                <TableRow className={`border-t ${level > 0 ? 'bg-gray-50' : ''}`}>
                    <CollapsibleTrigger asChild className="[&[data-state=open]>svg]:rotate-90">
                        <TableCell className={cn({ "flex items-center gap-2 cursor-pointer": hasSubModules })} style={{ paddingLeft: `${level * 16}px` }}>
                            <span className="pl-2">{highlightMatch(mod.name, debouncedSearch)}</span>
                            {hasSubModules ? <ChevronRight className="size-4 transition-transform" /> : null}
                        </TableCell>
                    </CollapsibleTrigger>

                    <TableCell className="text-center">
                        <Checkbox
                            checked={permissionKeys.every((perm) => watch(`${mod.id}_${perm}`))}
                            onCheckedChange={(val) => {
                                permissionKeys.forEach((perm) => {
                                    setValue(`${mod.id}_${perm}`, Boolean(val));
                                });

                                if (!val) {
                                    mod.subModules.forEach((sub) => {
                                        permissionKeys.forEach((perm) => {
                                            setValue(`${sub.id}_${perm}`, false);
                                        });
                                    });
                                }
                            }}
                        />
                    </TableCell>

                    {permissionKeys.map((perm) => (
                        <TableCell key={perm} className="text-center">
                            <Controller
                                name={`${mod.id}_${perm}`}
                                control={control}
                                render={({ field }) => {
                                    const isChecked = field.value;
                                    const handleChange = (val: boolean) => {
                                        field.onChange(val);

                                        if (!val) {
                                            updateChildren(mod, perm, false);
                                        } else {
                                            updateParent(mod, perm);
                                        }
                                    };

                                    let disabled = false;
                                    if (mod.parentId) {
                                        const parentChecked = permissionKeys.some((p) => watch(`${mod.parentId}_${p}`));
                                        disabled = !parentChecked;
                                    }

                                    return (
                                        <Checkbox
                                            checked={isChecked}
                                            disabled={disabled}
                                            onCheckedChange={handleChange}
                                        />
                                    );
                                }}
                            />
                        </TableCell>
                    ))}
                </TableRow>

                {hasSubModules && (
                    <CollapsibleContent asChild>
                        <>
                            {mod.subModules.map((sub) => (
                                <PermissionRow
                                    key={sub.id}
                                    mod={sub}
                                    level={level + 1}
                                    modules={modules}
                                    control={control}
                                    watch={watch}
                                    setValue={setValue}
                                    openModules={openModules}
                                    setOpenModules={setOpenModules}
                                    debouncedSearch={debouncedSearch}
                                />
                            ))}
                        </>
                    </CollapsibleContent>
                )}
            </>
        </Collapsible>
    );
};

const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const result = fuzzysort.single(query, text);
    if (!result) return text;

    return result.target
        .split("")
        .map((char, i) =>
            result.indexes.includes(i) ? (
                <span key={i} className="font-bold text-primary">
                    {char}
                </span>
            ) : (
                char
            )
        );
};
