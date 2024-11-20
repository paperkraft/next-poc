"use client";

import React, { useCallback } from "react";
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

interface permission {
  name: string,
  bitmask: number
}
interface IModule {
  id: string;
  name: string;
  parentId: string | null;
  permissions: permission[]
  submodules: IModule[]
}

const permissionObject = z.object({
  name: z.string().optional(),
  bitmask: z.number(),
});

const permissionArraySchema = z.array(permissionObject);

const ModuleObject = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  parentId: z.string().nullable().optional(),
  permission: permissionArraySchema.default([]),
  submodules: z.array(z.lazy((): z.ZodType<any> => ModuleObject)).default([]),
});

interface IAccessProps {
  roles: RoleType[], 
  modules: IModule[]
}

export const FormSchema = z.object({
  userId: z.string().min(1, { message: "Role is required." }),
  modules: z.array(ModuleObject)
});

export type FormValues = z.infer<typeof FormSchema>;

const bitmask = [
  { name: "VIEW", bitmask: 1 },
  { name: "EDIT", bitmask: 2 },
  { name: "CREATE", bitmask: 4 },
  { name: "DELETE", bitmask: 8 },
];

// Recursive function to process permissions of modules and submodules
const processModulePermissionsOld = (module: IModule, bitmask: any):any => {
  // Ensure permissions is always an array before calling reduce
  const permissionsArray = Array.isArray(module.permissions)
    ? module.permissions
    : [];

  // Calculate the permissions for this module
  const updatedPermissions = bitmask.map((permission:any) => ({
    name: permission.name,
    bitmask:
      permissionsArray.reduce(
        (acc, perm) => acc | perm.bitmask,
        0
      ) & permission.bitmask
        ? true
        : false,
  }));

  // Recursively handle submodules
  const updatedSubmodules = module.submodules.map((submodule) =>
    processModulePermissions(submodule, bitmask)
  );

  return {
    ...module,
    permissions: updatedPermissions,
    submodules: updatedSubmodules,
  };
};


const processModulePermissions = (module: IModule, bitmask: any): any => {
  // Ensure permissions is always an array before calling reduce
  const permissionsArray = Array.isArray(module.permissions)
    ? module.permissions
    : [];

  // Calculate the permissions for this module and set default values if empty
  const updatedPermissions = bitmask.map((permission: any) => ({
    name: permission.name,
    bitmask: permissionsArray.some(
      (perm) => perm.name === permission.name && perm.bitmask
    )
      ? true
      : false,
  }));

  // Recursively handle submodules
  const updatedSubmodules = module.submodules.map((submodule) =>
    processModulePermissions(submodule, bitmask)
  );

  return {
    ...module,
    permissions: updatedPermissions,
    submodules: updatedSubmodules,
  };
};


export default function AccessPage({roles, modules}:IAccessProps) {


  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues:{
      userId: "",
      modules:  modules.map((module) => processModulePermissions(module, bitmask)),
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  const roleOptions = roles.map((role)=>{
    return{
      value: role.id,
      label: role.name
    }
  })

  console.log(form.formState.errors);

  const onSubmit = (data: FormValues) => {

    // const updatedModules = data.modules.map((module) => ({
    //   ...module,
    //   permissions: module.permissions.map((permission) => ({
    //     ...permission,
    //     bitmask: permission.bitmask ? bitmask.find((b) => b.name === permission.name)?.bitmask : 0,
    //   })),
    // }));

    console.log("Sumbitted Data: ", JSON.stringify(data, null, 2));

  };

   // Recursive function to render the form for modules and submodules
   const renderModules = (modules: IModule[], parentIndex: string = "") => {
    return modules.map((module, index) => (
      <React.Fragment key={module.id}>
        <TableRow key={module.id}>
          <TableCell></TableCell>
          <TableCell>{module.name}</TableCell>

          {bitmask.map((permission, i) => (
            <TableCell key={permission.name}>
              <FormField
                name={`modules.${parentIndex}${index}.permissions.${i}.bitmask`}
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
        {/* Render submodules recursively */}
        {module.submodules && module.submodules.length > 0 &&  renderModules(module.submodules, `${parentIndex}${index}.submodules.`)}
      </React.Fragment>
    ));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="px-4">
          <SelectController
            name={"userId"}
            label={"Role"}
            options={roleOptions}
          />
          
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
            {renderModules(modules)}
          </TableBody>
        </Table>

        <div className="flex justify-end my-4 gap-2">
          <Button
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              form.reset();
            }}
          >
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
