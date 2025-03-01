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
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectController } from "@/components/_form-controls/SelectController";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WithPermission } from "@/components/custom/with-permission";
import ButtonContent from "@/components/custom/button-content";
import { IModule, IPermission, mergeModules, Module, transformModules, updateModules } from "./helper";
import RenderRows from "./RenderRows";
import { fetchModuleByRole } from "@/app/action/module.action";
import { IRole } from "@/app/_Interface/Role";

const bitmask = [
  { name: "VIEW", bitmask: 1 },
  { name: "EDIT", bitmask: 2 },
  { name: "CREATE", bitmask: 4 },
  { name: "DELETE", bitmask: 8 },
];

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

type FormValues = z.infer<typeof FormSchema>;

interface IAccessProps {
  roles: IRole[];
  modules: IModule[] | null;
}

interface IPermissionBoolean {
  name?: string;
  bitmask: boolean;
}

// Recursively process module permissions
const processModulePermissions = (module: IModule, bitmask: IPermission[]): any => {
  const permissionsArray = bitmask.map((permission) => ({
    name: permission.name,
    bitmask: (module?.permissions && +module?.permissions & permission.bitmask) === permission.bitmask,
  }));

  // Recursively process submodules
  const updatedSubmodules = module.subModules && module.subModules.map((subModule) => processModulePermissions(subModule, bitmask));

  return {
    ...module,
    permissions: permissionsArray,
    subModules: updatedSubmodules,
  };
};

const processRolesOptions = (role: IRole): any => {
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

  const defaultModules = initialModules?.map((module) => processModulePermissions(module as any, bitmask));
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

    if (roleId) {
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
        route.refresh();
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

  return (
    <WithPermission permissionBit={15}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <SelectController name={"userId"} label={"Role"} options={roleOptions} className="max-w-md" />

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

              {defaultModules && !loading && !roleModules &&
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
            <Button type="button" variant={"outline"} onClick={() => route.back()}>Cancel</Button>
            <Button type="submit" disabled={disabled}>
              <ButtonContent status={disabled} text={"Submit"} />
            </Button>
          </div>
        </form>
      </Form>
    </WithPermission>
  );
}