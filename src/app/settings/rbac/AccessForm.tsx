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
import { Switch } from "@/components/ui/switch";
import { Form, FormField } from "@/components/ui/form";
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
  modules: IModule[]
}

interface IModule {
  id: string;
  name: string;
  parentId: string | null;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManage: boolean;
  subModules: IModule[];
}

interface IRenderRows {
  data: IModule;
  parentIndex: string;
  index: number;
  level: number;
}

const ModuleObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  canCreate: z.boolean().optional(),
  canRead: z.boolean().optional(),
  canUpdate: z.boolean().optional(),
  canDelete: z.boolean().optional(),
  canManage: z.boolean().optional(),
  subModules: z.array(z.lazy((): z.ZodType<any> => ModuleObjectSchema)),
});

const FormSchema = z.object({
  roleId: z.string().min(1, { message: "Role is required." }),
  modules: z.array(ModuleObjectSchema),
});

export type FormValues = z.infer<typeof FormSchema>;

const processRolesOptions = (role: RoleType): any => {
  return {
    value: role.id,
    label: role.name,
  };
};

// const processModulePermissions = (module: IModule, bitmask: IPermission[]): any => {
//   const permissionsArray = bitmask.map((permission) => (
//     { 
//       name: permission.name, 
//       bitmask: (+module?.permissions & permission.bitmask) === permission.bitmask 
//     }
//   ));

//   // Recursively process submodules
//   const updatedSubmodules = module.subModules && module.subModules.map((submodule) => {
//     const updatedSubmodule = processModulePermissions(submodule, bitmask);
//     return {
//       ...updatedSubmodule,
//       // permissions: permissionsArray,
//       // permissions: updatedSubmodule.permissions,
//     };
//   });

//   return {
//     ...module,
//     permissions: permissionsArray,
//     submodules: updatedSubmodules,
//   };
// };

function removePermissions(modules: IModule[]): any[] {
  return modules && modules.map(module => {
    const { canCreate, canRead, canUpdate, canDelete, canManage, subModules, ...rest } = module;
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
  const Thead = ["", "Module", "Create", "Read", "Update", "Delete"];
  
  const [loading, setLoading] = useState<boolean>(false);
  const [roleModules, setRoleModules] = useState<IModule[]>();
  const [previousModules, setPreviousModules] = useState<IModule[]>();
  
  // const defaultModules = initialModules.map((module) => processModulePermissions(module as any, bitmask));
  const defaultModules = modules
  const roleOptions = initialRoles.map((role) => processRolesOptions(role));

  // console.log('modules', modules);
  // console.log('initialModules', initialModules);
  // console.log('roleModules', roleModules);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roleId: "",
      modules: initialModules,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  const roleId = form.watch("roleId");

  useEffect(() => {
    const getRoleModules = async (roleId: string) => {
      setLoading(true);
      setRoleModules(undefined);
      form.resetField("modules");

      try {
        if (roleId) {
          const res = await fetch(`/api/master/module/${roleId}`).then((d) => d.json())
          const data = res.data;

          console.log('org', data);
          

          if (res.success) {
            // get previous modules of role
            if (data && initialModules) {
              setPreviousModules(data);
              const mergePreviousWithDefault = mergeModules(modules, data);
              console.log('mergePreviousWithDefault', mergePreviousWithDefault)
              // const previousModules = mergePreviousWithDefault.map((module) => processModulePermissions(module as any, bitmask));
              setRoleModules(mergePreviousWithDefault);
              form.setValue("modules", mergePreviousWithDefault);
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

    // const submitted = data.modules.map(applyBitmaskRecursively);
    const updatedModules = updateModules(data.modules as any, previousModules as any);
    const updatedNew = mergeData(previousModules as any, data.modules as any)
    // const formated = transformModules(updatedModules);

    console.log('submitted',JSON.stringify(data.modules, null, 2));
    console.log('previousModules',JSON.stringify(previousModules, null, 2));
    console.log('updatedModules',JSON.stringify(updatedModules, null, 2));
    console.log('updatedNew',JSON.stringify(updatedNew, null, 2));

    const final = {
      roleId: data.roleId,
      modulesData: updatedModules
      // modulesData: updatedModules.length > 0 ? updateModules : data.modules
    };
    
    try {
      const result = await fetch(`/api/master/rbac`, {
        method: "POST",
        body: JSON.stringify(final),
      });

      const res = await result.json();
      // const res = {success:true};

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="px-4">
          <SelectController name={"roleId"} label={"Role"} options={roleOptions} />
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

            <TableCell>
              {data?.parentId ? renderDash(level) : null}
              {data?.name}
            </TableCell>



            {/* {!hasSubModules && data?.permissions && data?.permissions.map((permission, i) => (
              <TableCell key={permission.name}>
                <SwitchButton
                  name={`modules.${parentIndex}${index}.permissions.${i}.bitmask`}
                />
              </TableCell>
            ))} */}

            {
              // hasSubModules
              //   ? <TableCell colSpan={4}></TableCell>
              //   : 
                <>
                  <TableCell>
                    <SwitchButton name={`modules.${parentIndex}${index}.canCreate`} />
                  </TableCell>
                  <TableCell>
                    <SwitchButton name={`modules.${parentIndex}${index}.canRead`} />
                  </TableCell>
                  <TableCell>
                    <SwitchButton name={`modules.${parentIndex}${index}.canUpdate`} />
                  </TableCell>
                  <TableCell>
                    <SwitchButton name={`modules.${parentIndex}${index}.canDelete`} />
                  </TableCell>
                </>
            }
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

function mergeModules(allModules: IModule[], roleAssignedModules: IModule[]): IModule[] {
  // Helper function to merge modules
  function mergeSingleModule(module: IModule, roleAssignedModule: IModule | undefined): IModule {
    if (roleAssignedModule) {
      module.canCreate = roleAssignedModule.canCreate;
      module.canRead = roleAssignedModule.canRead;
      module.canUpdate = roleAssignedModule.canUpdate;
      module.canDelete = roleAssignedModule.canDelete;
      module.subModules = mergeSubmodules(module.subModules, roleAssignedModule.subModules);
    }
    return module;
  }

  // Helper function to merge submodules
  function mergeSubmodules(allSubmodules: IModule[], roleAssignedSubmodules: IModule[]): IModule[] {
    return allSubmodules && allSubmodules.map((allSubmodule) => {
      const matchingRoleSubmodule = roleAssignedSubmodules.find(
        (roleSubmodule) => roleSubmodule.id === allSubmodule.id
      );
      return mergeSingleModule(allSubmodule, matchingRoleSubmodule);
    });
  }

  // Iterate over all modules and merge them with role-assigned modules
  return allModules && allModules.map((allModule) => {
    const roleAssignedModule = roleAssignedModules.find(
      (roleModule) => roleModule.id === allModule.id
    );
    return mergeSingleModule(allModule, roleAssignedModule);
  });
}

// ----------------------------- Format submitted data to API ----------------------------- //

interface FormatSubmodule {
  id: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManage: boolean;
  subModules?: FormatSubmodule[];
}

interface FormatModule {
  id: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManage: boolean;
  subModules: FormatSubmodule[];
}

function transformModules(input: IModule[]): FormatModule[] {
  return input.map((module) => ({
    id: module.id,
    canCreate: module.canCreate,
    canRead: module.canRead,
    canUpdate: module.canUpdate,
    canDelete: module.canDelete,
    canManage: module.canManage,
    subModules: transformSubmodules(module.subModules),
  }));
}

function transformSubmodules(input: IModule[]): FormatSubmodule[] {
  return input.map((subModule) => ({
    id: subModule.id,
    canCreate: subModule.canCreate,
    canRead: subModule.canRead,
    canUpdate: subModule.canUpdate,
    canDelete: subModule.canDelete,
    canManage: subModule.canManage,
    subModules:
      subModule.subModules.length > 0
        ? transformSubmodules(subModule.subModules)
        : [],
  }));
}

// ----------------------------- Update submited data from previous data  ----------------------------- //

function updateModules(submittedData: IModule[], previousData: IModule[]): IModule[] {
  const mapPreviousData = createIdMap(previousData);

  return submittedData.map((subModule) => {
      const prevModule = mapPreviousData.get(subModule.id);
      if (prevModule) {
        return {
          ...subModule,
          // permissions: submodule.permissions,
          subModules: updateModules(subModule.subModules, prevModule.subModules),
        };
      }
      //  else if (subModule.permissions !== 0) {
      //   return {
      //     ...subModule,
      //     subModules: updateModules(subModule.subModules, []),
      //   };
      // }
      return null;
    })
    .filter(Boolean) as IModule[];
}

function createIdMap(data: IModule[]): Map<string, IModule> {
  const map = new Map<string, IModule>();
  data.forEach((module) => map.set(module.id, module));
  return map;
}


type Module = {
  id: string;
  name: string;
  parentId: string | null;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManage: boolean;
  subModules: Module[];
};

function mergeData(previousData: Module[], submittedData: Module[]): Module[] {
  const filterPermissions = (module: Module): boolean => {
    // Keep the module or submodule only if at least one granular permission is true
    return (
      module.canCreate || module.canRead || module.canUpdate || module.canDelete || module.canManage
    );
  };

  const mergeModules = (prevModule: Module, subModuleData: Module): void => {
    if (prevModule.id === subModuleData.id) {
      // Update permissions from submitted data
      prevModule.canCreate = subModuleData.canCreate;
      prevModule.canRead = subModuleData.canRead;
      prevModule.canUpdate = subModuleData.canUpdate;
      prevModule.canDelete = subModuleData.canDelete;
      prevModule.canManage = subModuleData.canManage;

      // Recursively merge submodules
      prevModule.subModules.forEach((prevSubModule) => {
        const matchingSubModule = subModuleData.subModules.find(
          (subModule) => subModule.id === prevSubModule.id
        );
        if (matchingSubModule) {
          mergeModules(prevSubModule, matchingSubModule);
        }
      });

      // Add any new submodules from the submitted data that do not exist in the previous data
      subModuleData.subModules.forEach((subModule) => {
        if (!prevModule.subModules.some((prevSubModule) => prevSubModule.id === subModule.id)) {
          if (filterPermissions(subModule)) {
            prevModule.subModules.push(subModule);
          }
        }
      });
    }
  };

  // Merge the modules
  return previousData.map((prevModule) => {
    const matchingModule = submittedData.find((subModule) => subModule.id === prevModule.id);
    if (matchingModule) {
      // Merge the module if found in submitted data
      mergeModules(prevModule, matchingModule);
    }

    // Add any new modules from the submitted data that do not exist in the previous data
    const newModules = submittedData.filter(
      (subModule) => !previousData.some((prev) => prev.id === subModule.id)
    );
    newModules.forEach((newModule) => {
      if (filterPermissions(newModule)) {
        previousData.push(newModule);
      }
    });

    return prevModule;
  });
}