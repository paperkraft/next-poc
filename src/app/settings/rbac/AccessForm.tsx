"use client";

import React, { useCallback, useEffect, useState } from "react";
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
      // permissions: permissionsArray,
      permissions: updatedSubmodule.permissions
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

  const [loading, setLoading] = useState<boolean>(false);
  const [roleModules, setRoleModules] = useState<IModule[]>();
  const [previousAssignedModules, setPreviousAssignModules] = useState<IModule[]>();
  // Log the merged result to console
  // console.log(JSON.stringify(modules, null, 4));
  // console.log(JSON.stringify(roleModules, null, 4));

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

  const roleId = form.watch('userId');

  useEffect(() => {
    const getRoleModules = async (roleId: string) => {
      setLoading(true);
      if (roleId) {
        const res = await fetch(`/api/master/module/${roleId}`).then((dd) => dd.json()).catch((err) => err)
        console.log('res', res);
        if (res.success) {
          const data = res.data;
          data && setPreviousAssignModules(data)
          const merge = mergeModules(modules as any, data);
          const processed = merge.map((module) => processModulePermissions(module as any, bitmask));
          processed.length > 0 && setRoleModules(processed);
          processed.length > 0 && form.setValue('modules', processed);
          setLoading(false);
        }
      }
    }
    getRoleModules(roleId);

  }, [roleId, form.control]);

  const onSubmit = async (data: any) => {
    // console.log(form.formState.errors);
    const submitted = data.modules.map(applyBitmaskRecursively)
    console.log("Sumbitted Data: ", JSON.stringify(submitted, null, 2));

    const updatedModules = previousAssignedModules && updateModules(previousAssignedModules as any, submitted as any);
    console.log("updated Modules", JSON.stringify(updatedModules, null, 2));

    const formated = reverseFormat(updatedModules as any);
    console.log("Format Modules", JSON.stringify(formated, null, 2));

    const final = {
      roleId: data.userId,
      modulesData: formated
    }

    const result = await fetch(`/api/master/rbac`, {
      method: "POST",
      body: JSON.stringify(final)
    }).then((res) => res.json()).catch((err) => err)

    console.log('result', JSON.stringify(result, null, 2));

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
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="px-4">
          <SelectController name={"userId"} label={"Role"} options={roleOptions} />
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
              !roleModules &&  
              permissionMapped && permissionMapped.map((data: any, i: number) => {
                return (<RenderRows key={i} data={data} parentIndex={""} index={i} level={0} />)
              })
            }

            { 
              roleModules && roleModules.map((data, i) => <RenderRows key={i} data={data} parentIndex={""} index={i} level={0} />)
            }

            {
              !permissionMapped && loading &&
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
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


// ----------------------------- //


type Module = {
  id: string;
  name: string;
  parentId: string | null;
  permissions: number;
  submodules: Module[];
};

function mergeModules(allModules: Module[], roleAssignedModules: Module[]): Module[] {
  // Helper function to merge a single module's permissions, if a role-assigned module exists
  function mergeSingleModule(module: Module, roleAssignedModule: Module | undefined): Module {
    if (roleAssignedModule) {
      // If module exists in role-assigned modules, update its permissions
      module.permissions = roleAssignedModule.permissions;

      // Recursively merge submodules
      module.submodules = mergeSubmodules(module.submodules, roleAssignedModule.submodules);
    }

    return module;
  }

  // Helper function to merge submodules
  function mergeSubmodules(allSubmodules: Module[], roleAssignedSubmodules: Module[]): Module[] {
    return allSubmodules.map(allSubmodule => {
      // Find corresponding submodule in role-assigned submodules
      const matchingRoleSubmodule = roleAssignedSubmodules.find(
        roleSubmodule => roleSubmodule.id === allSubmodule.id
      );

      return mergeSingleModule(allSubmodule, matchingRoleSubmodule);
    });
  }

  // Iterate over all modules and merge them with role-assigned modules
  return allModules.map(allModule => {
    const roleAssignedModule = roleAssignedModules.find(
      roleModule => roleModule.id === allModule.id
    );
    return mergeSingleModule(allModule, roleAssignedModule);
  });
}

// -----------------

interface Submodule {
  id: string;
  name: string;
  parentId: string | null;
  permissions: number;
  submodules: Submodule[];
}

interface Modules {
  id: string;
  name: string;
  parentId: string | null;
  permissions: number;
  submodules: Submodule[];
}
 
function updateModules(previous: Module[], newSubmitted: Module[]): Module[] {
  // Helper function to update the submodules of a module
  function updateSubmodules(prevSubmodules: Submodule[], newSubmodules: Submodule[]): Submodule[] {
    const result: Submodule[] = [];

    // Add or update submodules
    for (const newSub of newSubmodules) {
      const existingSub = prevSubmodules.find(sub => sub.id === newSub.id);
      if (existingSub) {
        // Update permissions of existing submodule if permissions are not zero
        if (newSub.permissions !== 0) {
          existingSub.permissions = newSub.permissions;
          result.push(existingSub);
        }
      } else {
        // If submodule is new and permissions are not 0, add it
        if (newSub.permissions !== 0) {
          result.push(newSub);
        }
      }
    }

    // Keep submodules that are in the previous data with permissions not equal to zero
    for (const prevSub of prevSubmodules) {
      const existingSub = newSubmodules.find(sub => sub.id === prevSub.id);
      if (!existingSub && prevSub.permissions !== 0) {
        result.push(prevSub);
      }
    }

    return result;
  }

  // Iterate over all modules in the new submitted data
  const updatedModules: Module[] = [];

  // Add or update modules from new data
  for (const newModule of newSubmitted) {
    const prevModule = previous.find(mod => mod.id === newModule.id);

    if (prevModule) {
      // If the module exists in previous data, update permissions and submodules
      if (newModule.permissions === 0) {
        // If permission is 0, retain the module with 0 permissions
        prevModule.permissions = 0;
      } else {
        // Update permissions and submodules if permission is non-zero
        prevModule.permissions = newModule.permissions;
        prevModule.submodules = updateSubmodules(prevModule.submodules, newModule.submodules);
      }

      updatedModules.push(prevModule);
    } else {
      // If the module is not in previous data and permissions are 0, don't include it
      if (newModule.permissions !== 0) {
        updatedModules.push(newModule);
      }
    }
  }

  // Add any modules from the previous data that are not in the new data
  for (const prevModule of previous) {
    const existingModule = newSubmitted.find(mod => mod.id === prevModule.id);
    if (!existingModule) {
      // Keep modules from the previous data
      updatedModules.push(prevModule);
    }
  }

  return updatedModules;
}


// ------------To Upsert data ----------//


interface Formated {
  moduleId: string;
  permissions: number;
  submodules: {
    submoduleId: string;
    permissions: number;
  }[];
}

function reverseFormat(modules: Module[]): Formated[] {
  return modules.map(module => {
    const submodules = module.submodules.map(submodule => ({
      submoduleId: submodule.id,
      permissions: submodule.permissions
    }));

    return {
      moduleId: module.id,
      permissions: module.permissions,
      submodules
    };
  });
}

//------------- updae
 
