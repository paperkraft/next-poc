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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface IAccessProps {
  roles: RoleType[];
  modules: IModule[];
}

interface IPermission {
  name: string;
  bitmask: number;
}

interface IPermissionBoolean {
  name?: string;
  bitmask: boolean;
}

interface IModule {
  id: string;
  name: string;
  parentId: string | null;
  permissions: IPermission[];
  submodules: IModule[];
}

interface IRenderRows {
  data: IModule;
  parentIndex: string;
  index: number;
  level: number;
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

const processModulePermissions = (
  module: IModule,
  bitmask: IPermission[]
): any => {
  const permissionsArray = bitmask.map((permission) => ({
    name: permission.name,
    bitmask: (+module.permissions & permission.bitmask) === permission.bitmask,
  }));

  // Recursively process submodules
  const updatedSubmodules = module.submodules.map((submodule) => {
    const updatedSubmodule = processModulePermissions(submodule, bitmask);
    return {
      ...updatedSubmodule,
      // permissions: permissionsArray,
      permissions: updatedSubmodule.permissions,
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
    label: role.name,
  };
};

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
  const route = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [roleModules, setRoleModules] = useState<IModule[]>();
  const [previousAssignedModules, setPreviousAssignModules] = useState<IModule[]>();

  const permissionMapped = modules.map((module) => processModulePermissions(module, bitmask));
  const roleOptions = roles.map((role) => processRolesOptions(role));

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: "",
      modules: permissionMapped,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  const roleId = form.watch("userId");

  useEffect(() => {
    const getRoleModules = async (roleId: string) => {
      setLoading(true);
      if (roleId) {
        try {
          const result = await fetch(`/api/master/module/${roleId}`)
          const res = await result.json();

          if (res.success) {
            const data = res.data;
            data && setPreviousAssignModules(data);
            const merge = mergeModules(modules as any, data);
            const processed = merge.map((module) =>
              processModulePermissions(module as any, bitmask)
            );
            processed.length > 0 && setRoleModules(processed);
            processed.length > 0 && form.setValue("modules", processed);
            setLoading(false);
          } else {
            toast.error("Failed to fetch role modules");
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch role modules");
        }
      }
    };
    getRoleModules(roleId);
  }, [roleId, form.control]);

  const onSubmit = async (data: FormValues) => {
    const submitted = data.modules.map(applyBitmaskRecursively);
    const updatedModules =
      previousAssignedModules &&
      updateModules(submitted as any, previousAssignedModules as any);
    const formated = transformModules(updatedModules as any);

    const final = {
      roleId: data.userId,
      modulesData: formated,
    };

    try {
      const result = await fetch(`/api/master/rbac`, {
        method: "POST",
        body: JSON.stringify(final),
      })
      const res = await result.json();
      if (res.success) {
        console.log('res', res);
        toast.success("Assigned module successfull");
        route.refresh();
      } else {
        toast.error("Failed to assigned module");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to assigned module");
    }
  };

  const renderDash = (count: number) => {
    return (
      <span className="text-muted-foreground">{`|${Array(count).fill("-").join("")} `}</span>
    );
  };
  // Recursive function to render the form for modules and submodules
  const RenderRows = useCallback(({ data, index, level, parentIndex }: IRenderRows) => {
      const hasSubModules = data?.submodules?.length > 0;

      return (
        <Collapsible asChild key={index}>
          <React.Fragment>
            <TableRow>
              <TableCell>
                {hasSubModules ? (
                  <CollapsibleTrigger asChild className="data-[state=open]:bg-muted [&[data-state=open]>svg]:rotate-90">
                    <Button variant={"ghost"} className="flex h-6 w-6 p-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                ) : null}
              </TableCell>

              <TableCell>
                {data?.parentId ? renderDash(level) : null}
                {data?.name}
              </TableCell>
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
                {data &&
                  data?.submodules.map((sub, ii) => (
                    <RenderRows key={sub.id} data={sub} index={ii} level={level + 1} parentIndex={`${parentIndex}${index}.submodules.`} />
                  ))}
              </React.Fragment>
            </CollapsibleContent>
          </React.Fragment>
        </Collapsible>
      );
    },
    [form.control]
  );

  const Thead = ["", "Module", "View", "Edit", "Create", "Delete"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="px-4">
          <SelectController name={"userId"} label={"Role"} options={roleOptions} />
        </div>

        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              {Thead.map((item) => (
                <TableHead key={item}>{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {!roleModules &&
              permissionMapped &&
              permissionMapped.map((data: any, i: number) => (
                <RenderRows key={i} data={data} parentIndex={""} index={i} level={0} />
              ))}

            {roleModules &&
              roleModules.map((data, i) => (
                <RenderRows key={i} data={data} parentIndex={""} index={i} level={0} />
              ))}

            {!permissionMapped && loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
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

// ----------------------------- Merge default modules with role assigned modules ----------------------------- //

type Module = {
  id: string;
  name: string;
  parentId: string | null;
  permissions: number;
  submodules: Module[];
};

function mergeModules(allModules: Module[], roleAssignedModules: Module[]): Module[] {

  // Helper function to merge modules
  function mergeSingleModule(module: Module, roleAssignedModule: Module | undefined): Module {
    if (roleAssignedModule) {
      module.permissions = roleAssignedModule.permissions;
      module.submodules = mergeSubmodules(
        module.submodules,
        roleAssignedModule.submodules
      );
    }
    return module;
  }

  // Helper function to merge submodules
  function mergeSubmodules(allSubmodules: Module[], roleAssignedSubmodules: Module[]): Module[] {
    return allSubmodules.map((allSubmodule) => {
      const matchingRoleSubmodule = roleAssignedSubmodules.find(
        (roleSubmodule) => roleSubmodule.id === allSubmodule.id
      );
      return mergeSingleModule(allSubmodule, matchingRoleSubmodule);
    });
  }

  // Iterate over all modules and merge them with role-assigned modules
  return allModules.map((allModule) => {
    const roleAssignedModule = roleAssignedModules.find(
      (roleModule) => roleModule.id === allModule.id
    );
    return mergeSingleModule(allModule, roleAssignedModule);
  });
}

// ----------------------------- Format submitted data to API ----------------------------- //

interface FormatSubmodule {
  submoduleId: string;
  permissions: number;
  submodules?: FormatSubmodule[];
}

interface FormatModule {
  moduleId: string;
  permissions: number;
  submodules: FormatSubmodule[];
}

function transformModules(input: Module[]): FormatModule[] {
  return input.map((module) => ({
    moduleId: module.id,
    permissions: module.permissions,
    submodules: transformSubmodules(module.submodules),
  }));
}

function transformSubmodules(input: Module[]): FormatSubmodule[] {
  return input.map((submodule) => ({
    submoduleId: submodule.id,
    permissions: submodule.permissions,
    submodules: submodule.submodules.length > 0 ? transformSubmodules(submodule.submodules) : [],
  }));
}

// ----------------------------- Update submited data from previous data  ----------------------------- //

function updateModules(submittedData: Module[], previousData: Module[]): Module[] {
  const mapPreviousData = createIdMap(previousData);

  return submittedData
    .map((submodule) => {
      const prevModule = mapPreviousData.get(submodule.id);
      if (prevModule) {
        return {
          ...submodule,
          permissions: submodule.permissions,
          submodules: updateModules(
            submodule.submodules,
            prevModule.submodules
          ),
        };
      } else if (submodule.permissions !== 0) {
        return {
          ...submodule,
          submodules: updateModules(submodule.submodules, []),
        };
      }
      return null;
    })
    .filter(Boolean) as Module[];
}

function createIdMap(data: Module[]): Map<string, Module> {
  const map = new Map<string, Module>();
  data.forEach((module) => map.set(module.id, module));
  return map;
}