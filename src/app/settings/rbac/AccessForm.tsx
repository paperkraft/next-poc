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
import { ChevronRight, LoaderCircle, LoaderCircleIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  subModules: IModule[];
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
  subModules: z.array(z.lazy((): z.ZodType<any> => ModuleObjectSchema)),
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
  const updatedSubmodules = module.subModules && module.subModules.map((subModule) => {
    const updatedSubmodule = processModulePermissions(subModule, bitmask);
    return {
      ...updatedSubmodule,
      // permissions: permissionsArray,
      // permissions: updatedSubmodule.permissions,
    };
  });

  return {
    ...module,
    permissions: permissionsArray,
    subModules: updatedSubmodules,
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
  if (updatedItem.subModules && updatedItem.subModules.length > 0) {
    updatedItem.subModules = updatedItem.subModules.map(
      applyBitmaskRecursively
    );
  }
  return updatedItem;
};

function removePermissions(modules: Module[]): any[] {
  return modules.map(module => {
    const { permissions, subModules, ...rest } = module;
    const updatedSubmodules = removePermissions(subModules);
    return {
      ...rest,
      subModules: updatedSubmodules,
    };
  });
}

export default function AccessPage({ roles, modules }: IAccessProps) {

  const route = useRouter();
  const initialModules = removePermissions(modules as any);
  const initialRoles = roles
  const Thead = ["Module", "View", "Edit", "Create", "Delete"];

  const [disabled, setDisabled] = useState<boolean>(false);
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

  useFieldArray({
    control: form.control,
    name: "modules",
  });

  const roleId = form.watch("userId");

  useEffect(() => {
    const getRoleModules = async (roleId: string) => {
      try {
        const res = await fetch(`/api/master/module/${roleId}`).then((d) => d.json())
        const data = res.data;
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
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch role modules");
      } finally {
        setLoading(false);
      }
    };

    if(roleId){
      getRoleModules(roleId);
      setLoading(true);
      setRoleModules(undefined);
      form.resetField("modules");
    }
  }, [roleId]);

  const onSubmit = async (data: FormValues) => {
    setDisabled(true);
    const submitted = data.modules.map(applyBitmaskRecursively);
    const updatedModules = previousModules && updateModules(submitted as any, previousModules as any);
    const formated = transformModules(updatedModules as any);

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
        toast.success("Modules assigned");
      } else {
        toast.error("Failed to assigned module");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to assigned module");
    } finally {
      setDisabled(false);
      route.refresh();
    }
  };

  const renderButtonContent = () => {
    if (disabled) {
      return (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Submitting...
        </>
      );
    }
    return "Submit";
  };

  return (
    <WithPermission permissionBit={15}>
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
            <Button type="submit" disabled={disabled}>{renderButtonContent()}</Button>
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
    const hasSubModules = data?.subModules?.length > 0;
    return (
      <Collapsible asChild key={index}>
        <React.Fragment>
          <TableRow className="">
            <CollapsibleTrigger asChild className="[&[data-state=open]>svg]:rotate-90">
              <TableCell className={cn(`pl-${data?.parentId && level * 2}`, { "flex items-center first:gap-2 cursor-pointer": hasSubModules })}>
                {data?.parentId ? renderDash(level) : null}
                {data?.name}
                {hasSubModules ? <ChevronRight className="size-4 transition-transform" /> : null}
              </TableCell>
            </CollapsibleTrigger>

            {hasSubModules && <TableCell colSpan={4}></TableCell>}

            {!hasSubModules && data?.permissions && data?.permissions.map((permission, i) => (
              <TableCell key={permission.name}>
                <SwitchButton name={`modules.${parentIndex}${index}.permissions.${i}.bitmask`} />
              </TableCell>
            ))}
          </TableRow>

          <CollapsibleContent asChild>
            <React.Fragment>
              {data?.subModules &&
                data?.subModules.map((sub, ii) => (
                  <RenderRows
                    key={sub.id}
                    data={sub}
                    index={ii}
                    level={level + 1}
                    parentIndex={`${parentIndex}${index}.subModules.`}
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
  subModules: Module[];
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
      module.subModules = mergeSubmodules(
        module.subModules,
        roleAssignedModule.subModules
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
  subModuleId: string;
  permissions: number;
  subModules?: FormatSubmodule[];
}

interface FormatModule {
  moduleId: string;
  permissions: number;
  subModules: FormatSubmodule[];
}

function transformModules(input: Module[]): FormatModule[] {
  return input.map((module) => ({
    moduleId: module.id,
    permissions: module.permissions,
    subModules: transformSubmodules(module.subModules),
  }));
}

function transformSubmodules(input: Module[]): FormatSubmodule[] {
  return input.map((subModule) => ({
    subModuleId: subModule.id,
    permissions: subModule.permissions,
    subModules:
      subModule.subModules.length > 0
        ? transformSubmodules(subModule.subModules)
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
  for (let subModule of module.subModules) {
    if (hasValidPermissions(subModule)) {
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
    .map((subModule) => {
      const prevModule = mapPreviousData.get(subModule.id);

      // If the module exists in previous data, update permissions and recurse on submodules
      if (prevModule) {
        const updatedSubmodules = updateModules(subModule.subModules, prevModule.subModules);
        return {
          ...subModule,
          permissions: subModule.permissions,
          subModules: updatedSubmodules,
        };
      }

      // If the module does not exist in previous data and its permissions > 0, include it
      if (subModule.permissions > 0 || hasValidPermissions(subModule)) {
        return {
          ...subModule,
          subModules: updateModules(subModule.subModules, []),
        };
      }

      // If no valid submodules and permissions == 0, exclude the module
      return null;
    })
    .filter(Boolean) as Module[]; // Filter out null values
}