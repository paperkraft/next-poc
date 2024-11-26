"use client";

import React, { useEffect, useState } from "react";
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
import { ChevronRight, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectController } from "@/components/custom/form.control/SelectController";
import { RoleType } from "@/app/master/role/List";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WithPermission } from "@/components/custom/with-permission";
import { SwitchButton } from "@/components/custom/form.control/SwitchButton";

interface IAccessProps {
  roles: RoleType[];
  modules: IModule[] | null
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
  permissions?: IPermission[];
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
    bitmask: (module?.permissions && +module?.permissions & permission.bitmask) === permission.bitmask,
  }));

  // Recursively process submodules
  const updatedSubmodules = module.submodules && module.submodules.map((submodule) => {
    const updatedSubmodule = processModulePermissions(submodule, bitmask);
    return {
      ...updatedSubmodule,
      // permissions: permissionsArray,
      // permissions: updatedSubmodule.permissions,
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
    updatedItem.submodules = updatedItem.submodules.map(
      applyBitmaskRecursively
    );
  }
  return updatedItem;
};

function removePermissions(modules: Module[]): any[] {
  return modules.map(module => {
    const { permissions, submodules, ...rest } = module;
    const updatedSubmodules = removePermissions(submodules);
    return {
      ...rest,
      submodules: updatedSubmodules,
    };
  });
}

export default function AccessPage({ roles, modules }: IAccessProps) {

  const route = useRouter();
  const initialModules = removePermissions(modules as any);
  const initialRoles = roles
  const Thead = ["", "Module", "View", "Edit", "Create", "Delete"];

  const [loading, setLoading] = useState<boolean>(false);
  const [roleModules, setRoleModules] = useState<IModule[]>();
  const [previousModules, setPreviousModules] = useState<Module[]>();

  const defaultModules = initialModules.map((module) => processModulePermissions(module as any, bitmask));
  const roleOptions = initialRoles.map((role) => processRolesOptions(role));

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: "",
      modules: defaultModules,
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
      setRoleModules(undefined);
      form.resetField("modules");

      try {
        if (roleId) {
          const res = await fetch(`/api/master/module/${roleId}`).then((d) => d.json())
          const data = res.data;
          console.log('org', data)
          console.log('ext', res.ext)
          if (res.success) {
            // get previous modules of role
            if (data && initialModules) {
              setPreviousModules(data);
              const mergePreviousWithDefault = mergeModules(initialModules as any, data);
              const previousModules = mergePreviousWithDefault.map((module) => processModulePermissions(module as any, bitmask));
              setRoleModules(previousModules);
              form.setValue("modules", previousModules);
            }
          } else {
            toast.error("Failed to fetch role modules");
          }
        } else {
          form.resetField("modules");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch role modules");
      } finally {
        setLoading(false);
      }
    };
    getRoleModules(roleId);
  }, [roleId]);

  const onSubmit = async (data: FormValues) => {
    const submitted = data.modules.map(applyBitmaskRecursively);
    const updatedModules = previousModules && updateModules(submitted as any, previousModules as any);
    const formated = transformModules(updatedModules as any);

    console.log("submitted", JSON.stringify(submitted, null, 2))
    console.log("previousModules", JSON.stringify(previousModules, null, 2))
    console.log("updatedModules", JSON.stringify(updatedModules, null, 2))
    console.log("formated", JSON.stringify(formated, null, 2))

    const final = {
      roleId: data.userId,
      modulesData: formated,
    };

    try {
      const result = await fetch(`/api/master/rbac`, {
        method: "POST",
        body: JSON.stringify(final),
      });

      const res = await result.json();

      if (res.success) {
        console.log("res", res);
        toast.success("Modules assigned");
        route.refresh();
      } else {
        toast.error("Failed to assigned module");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to assigned module");
    }
  };

  return (
    <WithPermission permissionBit={7 & 8}>
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
              {roleModules && !loading &&
                roleModules.map((data, i) => (
                  <RenderRows key={i} data={data} parentIndex={""} index={i} level={0} />
                ))}

              {defaultModules && !loading &&
                !roleModules &&
                defaultModules.map((data, i) => (
                  <RenderRows key={i} data={data} parentIndex={""} index={i} level={0} />
                ))}

              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <span className="flex items-center justify-center" aria-live="polite">
                      <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex justify-end my-4 gap-2">
            <Button
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault();
                route.back();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </WithPermission>
  );
}

// ----------------------------- Render rows of table ----------------------------- //

const renderDash = (count: number) => {
  return (
    <span className="text-muted-foreground">{`|${Array(count)
      .fill("-")
      .join("")} `}</span>
  );
};

const RenderRows = React.memo(
  ({ data, index, level, parentIndex }: IRenderRows) => {
    const hasSubModules = data?.submodules?.length > 0;
    return (
      <Collapsible asChild key={index}>
        <React.Fragment>
          <TableRow>
            <TableCell>
              {hasSubModules ? (
                <CollapsibleTrigger
                  asChild
                  className="data-[state=open]:bg-muted [&[data-state=open]>svg]:rotate-90"
                >
                  <Button variant={"ghost"} className="flex h-6 w-6 p-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              ) : null}
            </TableCell>

            <TableCell className={`pl-${data?.parentId && level*2}`}>
              {data?.parentId ? renderDash(level) : null}
              {data?.name}
              {hasSubModules ? ' *' : null}
            </TableCell>

            {/* {hasSubModules && <TableCell colSpan={4}></TableCell>} */}

            { data?.permissions && data?.permissions.map((permission, i) => (
              <TableCell key={permission.name}>
                <SwitchButton name={`modules.${parentIndex}${index}.permissions.${i}.bitmask`}/>
              </TableCell>
            ))}
          </TableRow>

          <CollapsibleContent asChild>
            <React.Fragment>
              {data?.submodules &&
                data?.submodules.map((sub, ii) => (
                  <RenderRows
                    key={sub.id}
                    data={sub}
                    index={ii}
                    level={level + 1}
                    parentIndex={`${parentIndex}${index}.submodules.`}
                  />
                ))}
            </React.Fragment>
          </CollapsibleContent>
        </React.Fragment>
      </Collapsible>
    );
  }
);

// ----------------------------- Merge default modules with role assigned modules ----------------------------- //

type Module = {
  id: string;
  name: string;
  parentId: string | null;
  permissions: number;
  submodules: Module[];
};

function mergeModules(
  allModules: Module[],
  roleAssignedModules: Module[]
): Module[] {
  // Helper function to merge modules
  function mergeSingleModule(
    module: Module,
    roleAssignedModule: Module | undefined
  ): Module {
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
  function mergeSubmodules(
    allSubmodules: Module[],
    roleAssignedSubmodules: Module[]
  ): Module[] {
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

// ----------------------------- Format submitted data to API Format ----------------------------- //

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
    submodules:
      submodule.submodules.length > 0
        ? transformSubmodules(submodule.submodules)
        : [],
  }));
}

// ----------------------------- Update submited data from previous data  ----------------------------- //
 

function createIdMap(data: Module[]): Map<string, Module> {
  const map = new Map<string, Module>();
  data.forEach((module) => map.set(module.id, module));
  return map;
}

function hasValidPermissions(module: Module): boolean {
  // Check if a module or any of its submodules has permissions > 0
  if (module.permissions > 0) {
    return true;
  }

  // Check if any submodule has permissions > 0
  for (let submodule of module.submodules) {
    if (hasValidPermissions(submodule)) {
      return true;
    }
  }
  return false;
}


function updateModules(
  submittedData: Module[],
  previousData: Module[]
): Module[] {
  const mapPreviousData = createIdMap(previousData);

  return submittedData
    .map((submodule) => {
      const prevModule = mapPreviousData.get(submodule.id);

      // If the module exists in previous data, update permissions and recurse on submodules
      if (prevModule) {
        const updatedSubmodules = updateModules(submodule.submodules, prevModule.submodules);
        return {
          ...submodule,
          permissions: submodule.permissions,
          submodules: updatedSubmodules,
        };
      }

      // If the module does not exist in previous data and its permissions > 0, include it
      if (submodule.permissions > 0 || hasValidPermissions(submodule)) {
        return {
          ...submodule,
          submodules: updateModules(submodule.submodules, []),  
        };
      }

      // If the module has permissions = 0, include it only if it has valid child modules (permissions > 0)
      // if (submodule.permissions === 0) {
      //   const validSubmodules = submodule.submodules.filter(child => child.permissions > 0);
      //   if (validSubmodules.length > 0) {
      //     return {
      //       ...submodule,
      //       submodules: updateModules(validSubmodules, []),
      //     };
      //   }
      // }

      // If no valid submodules and permissions == 0, exclude the module
      return null;
    })
    .filter(Boolean) as Module[]; // Filter out null values
}