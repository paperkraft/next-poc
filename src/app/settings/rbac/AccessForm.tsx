"use client";

import React, { useCallback, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { SelectController } from "@/components/custom/form.control/SelectController";
import { RoleType } from "@/app/master/role/List";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


interface IAccessProps {
  roles: RoleType[],
  modules: IModule[]
}

interface IPermission {
  name: string,
  bitmask: number
}

interface IPermissionBoolean {
  name?: string,
  bitmask: boolean
}

interface IModule {
  id: string;
  name: string;
  parentId: string | null;
  permissions: IPermission[]
  submodules: IModule[]
}

interface IRenderRows {
  data: IModule,
  parentIndex: string,
  index: number,
  level: number
}

const ModulePermissionsSchema = z.object({
  name: z.string().optional(),
  bitmask: z.boolean(),
});

const ModuleObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  permissions: z.array(ModulePermissionsSchema),
  submodules: z.array(z.lazy((): z.ZodType<any> => ModuleObjectSchema)),
});

const FormSchema = z.object({
  userId: z.string().min(1, { message: "Role is required." }),
  modules: z.array(ModuleObjectSchema),
});

export type FormValues = z.infer<typeof FormSchema>;

const bitmask = [
  { name: "VIEW", bitmask: 1 },
  { name: "EDIT", bitmask: 2 },
  { name: "CREATE", bitmask: 4 },
  { name: "DELETE", bitmask: 8 },
];

const processModulePermissions = (module: IModule, bitmask: IPermission[]): any => {
  const permissionsArray = bitmask.map((permission) => ({
    name: permission.name,
    bitmask: (+module.permissions & permission.bitmask) === permission.bitmask
  }));

  // Recursively process submodules
  const updatedSubmodules = module.submodules.map((submodule) => {
    const updatedSubmodule = processModulePermissions(submodule, bitmask);
    return {
      ...updatedSubmodule,
      permissions: permissionsArray,
    };
  });

  return {
    ...module,
    permissions: permissionsArray,
    submodules: updatedSubmodules,
  };
};

const processRolesOptions = (role: RoleType): any => {
  return {
    value: role.id,
    label: role.name
  }
}

function calculateBitmask(permissions: IPermissionBoolean[]) {
  let combinedBitmask = 0;
  permissions.forEach((permission) => {
    const matchingBitmask = bitmask.find((b) => b.name === permission.name);
    if (matchingBitmask && permission.bitmask) {
      combinedBitmask |= matchingBitmask.bitmask;
    }
  });
  return combinedBitmask;
}

const applyBitmaskRecursively = (item: any): IModule => {
  const updatedItem = {
    ...item,
    permissions: calculateBitmask(item.permissions),
  };
  if (updatedItem.submodules && updatedItem.submodules.length > 0) {
    updatedItem.submodules = updatedItem.submodules.map(applyBitmaskRecursively);
  }
  return updatedItem;
};

export default function AccessPage({ roles, modules }: IAccessProps) {

  const permissionMapped = modules.map((module) => processModulePermissions(module, bitmask));
  const roleOptions = roles.map((role) => processRolesOptions(role));

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: "",
      modules: permissionMapped,
    }
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  const onSubmit = (data: FormValues) => {
    console.log(form.formState.errors);
    const final = data.modules.map(applyBitmaskRecursively)
    console.log("Sumbitted Data: ", JSON.stringify(final, null, 2));
  };

  // Recursive function to render the form for modules and submodules
  const RenderRows = useCallback(({ data, index, level, parentIndex }: IRenderRows) => {
    const hasSubModules = data?.submodules?.length > 0;

    const renderDash = (count: number) => {
      return <span className="text-muted-foreground">{`|${Array(count).fill('-').join('')} `}</span>
    }

    if (!hasSubModules) {
      return (
        <TableRow>
          <TableCell></TableCell>
          <TableCell>{data?.parentId ? renderDash(level) : null}{data?.name}</TableCell>
          {data.permissions.map((permission, i) => (
            <TableCell key={permission.name}>
              <FormField
                name={`modules.${parentIndex}${index}.permissions.${i}.bitmask` as any}
                control={form.control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
            </TableCell>
          ))}
        </TableRow>
      )
    }

    return (
      <Collapsible asChild key={index}>
        <React.Fragment>
          <TableRow>
            <TableCell>
              <CollapsibleTrigger asChild>
                <Button variant={"ghost"} className="flex h-6 w-6 p-0 data-[state=open]:bg-muted [&[data-state=open]>svg]:rotate-90">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </TableCell>
            <TableCell>{data?.parentId ? renderDash(level) : null}{data?.name}</TableCell>
            {data.permissions.map((permission, i) => (
              <TableCell key={permission.name}>
                <FormField
                  name={`modules.${parentIndex}${index}.permissions.${i}.bitmask` as any}
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <CollapsibleContent asChild>
            <React.Fragment>
              {data && data?.submodules.map((sub, ii) => (
                <RenderRows key={sub.id} data={sub} index={ii} level={level + 1} parentIndex={`${parentIndex}${index}.submodules.`} />
              ))}
            </React.Fragment>
          </CollapsibleContent>
        </React.Fragment>
      </Collapsible>
    )
  }, [form.control]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="px-4">
          <SelectController name={"userId"} label={"Role"} options={roleOptions}/>
        </div>

        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Module</TableHead>
              <TableHead>View</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Create</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {
              fields &&
              permissionMapped.map((data: any, i: number) => {
                return (<RenderRows key={i} data={data} parentIndex={""} index={i} level={0} />)
              })
            }

            {
              !permissionMapped &&
              <TableRow>
                <TableCell colSpan={6}>No Data</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>

        <div className="flex justify-end my-4 gap-2">
          <Button variant={"outline"} onClick={(e) => { e.preventDefault(); form.reset(); }}>
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

