'use client';

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, CornerDownRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Form, FormField} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { SelectController } from "@/components/custom/form.control/SelectController";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/hooks/use-toast";

interface SubModule {
    id: number;
    label: string;
    permission: number[];
}

interface Module {
    id: number;
    label: string;
    permission: number[];
    subModule: SubModule[];
}

interface RoleData {
    role: string;
    module: Module[];
}

const permissionArraySchema = z.array(z.boolean());

const subModuleSchema = z.object({
    id: z.number(),
    label: z.string(),
    permission: permissionArraySchema,
});

const moduleSchema = z.object({
    id: z.number(),
    label: z.string(),
    permission: permissionArraySchema,
    subModule: z.array(subModuleSchema),
});

const defaultValuesSchema = z.object({
    role: z.string().min(1, {
        message: "Please select role",
    }),
    module: z.array(moduleSchema),
});

const roleOptions = [
    { label:'Admin', value:'admin' },
    { label:'Staff', value:'staff' },
    { label:'Faculty', value:'faculty' },
    { label:'Sudent', value:'student' },
    { label:'Guest', value:'guest' },
]

const tHead = ["", "Modules", "Read", "Write", "Modify", "Delete", "All"];

const permissionArray = (length:number) => Array(length).fill(false);

const defaultValues = {
    role: "",
    module: [
        {
            id: 1,
            label: "Admission",
            permission: permissionArray(5),
            subModule: [
                {
                    id: 11,
                    label: "Registration",
                    permission: permissionArray(5)
                },
                {
                    id: 12,
                    label: "Probation",
                    permission: permissionArray(5)
                }
            ]
        },
        {
            id: 2,
            label: "Reports",
            permission: permissionArray(5),
            subModule: []
        },
        {
            id: 3,
            label: "Fees Management",
            permission: permissionArray(5),
            subModule: [
                {
                    id: 31,
                    label: "Academics",
                    permission: permissionArray(5)
                },
                {
                    id: 32,
                    label: "Hostel",
                    permission: permissionArray(5)
                },
            ]
        },
    ]
};

function cleanPermissions(data:RoleData) {
    const cleanedData: RoleData = {
        role: data.role,
        module: data.module.map(module => ({
            ...module,
            permission: module.permission
                .map((perm, index) => (perm ? index + 1 : null))
                .filter((index) => index !== null),
            subModule: module.subModule.map(subModule => ({
                ...subModule,
                permission: subModule.permission
                    .map((perm, index) => (perm ? index + 1 : null))
                    .filter((index) => index !== null)
            }))
        }))
    };

    return cleanedData;
}

function reversePermissions(data: RoleData) {
    const reversedData: RoleData = { ...data, module: [] };

    data.module.forEach(module => {
        const newPermissions = Array(5).fill(false);
        // Set true for the corresponding indices
        module.permission.forEach(index => {
            if (index > 0 && index <= 5) {
                newPermissions[index - 1] = true;
            }
        });

        const newModule: Module = { ...module, permission: newPermissions };
        // Process submodules
        newModule.subModule = module.subModule.map(subModule => {
            const newSubPermissions = Array(5).fill(false);
            // Set true for the corresponding indices
            subModule.permission.forEach(index => {
                if (index > 0 && index <= 5) {
                    newSubPermissions[index - 1] = true;
                }
            });
            return { ...subModule, permission: newSubPermissions };
        });
        reversedData.module.push(newModule);
    });

    return reversedData;
}

const cleanedInputData: RoleData = {
    role: "admin",
    module: [
        {
            id: 1,
            label: "Admission",
            permission: [5],
            subModule: [
                {
                    id: 11,
                    label: "Registration",
                    permission: []
                },
                {
                    id: 12,
                    label: "Probation",
                    permission: []
                }
            ]
        },
        {
            id: 2,
            label: "Reports",
            permission: [1, 2],
            subModule: []
        },
        {
            id: 3,
            label: "Fees Management",
            permission: [],
            subModule: [
                {
                    id: 31,
                    label: "Academics",
                    permission: []
                },
                {
                    id: 32,
                    label: "Hostel",
                    permission: []
                }
            ]
        }
    ]
};

const inputData: any = {
    role: "staff",
    module: [
      {
        id: 1,
        label: "Admission",
        permission: [false, false, false, false, true],
        subModule: [
          {
            id: 11,
            label: "Registration",
            permission: [false, false, false, false, true]
          },
          {
            id: 12,
            label: "Probation",
            permission: [false, false, false, false, false]
          }
        ]
      },
      {
        id: 2,
        label: "Reports",
        permission: [false, false, false, false, false],
        subModule: []
      },
      {
        id: 3,
        label: "Fees Management",
        permission: [false, false, false, false, false],
        subModule: [
          {
            id: 31,
            label: "Academics",
            permission: [false, false, false, false, false]
          },
          {
            id: 32,
            label: "Hostel",
            permission: [false, false, false, false, false]
          }
        ]
      }
    ]
};

export default function AccessPage() {
    
    const form = useForm({
        resolver: zodResolver(defaultValuesSchema),
        defaultValues
    });

    const onSubmit = (data:RoleData) => {
        const formData = { ...data };
        const result = cleanPermissions(formData);

        toast({
            title: "submitted values:",
            description: (
              <pre className="mt-2 w-max md:w-[354px] rounded-md bg-slate-950 p-4 max-h-64 overflow-scroll">
                <code className="text-white text-[12px]">{JSON.stringify(result, null, 2)}</code>
              </pre>
            ),
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                <div className="px-4">
                    <SelectController name={"role"} label={"Role"} options={roleOptions} />
                </div>

                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                        <TableRow>
                            {tHead.map((items)=>(<TableHead key={items}>{items}</TableHead>))}
                        </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                    {
                        defaultValues.module.map((item, i) => {
                            const hasSubModules = item.subModule.length > 0;
                            return (
                                <React.Fragment key={item.id}>
                                    {hasSubModules && (
                                        <Collapsible asChild key={item.id}>
                                            <React.Fragment>
                                                <TableRow>
                                                    <TableCell>
                                                        <CollapsibleTrigger asChild>
                                                            <Button variant={"ghost"}
                                                                className="flex h-6 w-6 p-0 data-[state=open]:bg-muted [&[data-state=open]>svg]:rotate-90"
                                                            >
                                                                <ChevronRight className="h-4 w-4" />
                                                            </Button>
                                                        </CollapsibleTrigger>
                                                    </TableCell>
                                                    <TableCell className="text-left">
                                                        {item.label}
                                                    </TableCell>
                                                    {item.permission.map((_a, ii) => (
                                                        <TableCell key={ii}>
                                                            <FormField 
                                                                name={`module.${i}.permission.${ii}`} 
                                                                control={form.control} 
                                                                render={({ field }) => (
                                                                    <Switch 
                                                                        checked={!!field.value} 
                                                                        onCheckedChange={field.onChange}
                                                                    />
                                                                )}
                                                            />
                                                        </TableCell>
                                                    ))}
                                                </TableRow>

                                                <CollapsibleContent asChild>
                                                    <React.Fragment>
                                                        {item.subModule.map((sub, ii) => (
                                                            <TableRow key={sub.id}>
                                                                <TableCell></TableCell>
                                                                <TableCell>{`|-- ${sub.label}`}</TableCell>
                                                                {sub.permission.map((_b, iii) => (
                                                                    <TableCell key={iii}>
                                                                        <FormField 
                                                                            name={`module.${i}.subModule.${ii}.permission.${iii}`} 
                                                                            control={form.control} 
                                                                            render={({ field }) => (
                                                                                <Switch 
                                                                                    checked={field.value} 
                                                                                    onCheckedChange={field.onChange}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))}
                                                    </React.Fragment>
                                                </CollapsibleContent>
                                            </React.Fragment>
                                        </Collapsible>
                                    )}

                                    {!hasSubModules && (
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>{item.label}</TableCell>
                                            {item.permission.map((_c, ii) => (
                                                <TableCell key={ii}>
                                                    <FormField 
                                                        name={`module.${i}.permission.${ii}`} 
                                                        control={form.control} 
                                                        render={({ field }) => (
                                                            <Switch 
                                                                checked={field.value} 
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            );
                        })
                    }
                    </TableBody>
                </Table>

                <div className="flex justify-end my-4 gap-2">
                    <Button variant={'outline'} onClick={(e) => { e.preventDefault(); form.reset(); }}>Reset</Button>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    );
}