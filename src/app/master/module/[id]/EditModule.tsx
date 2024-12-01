"use client";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { InputController } from "@/components/custom/form.control/InputController";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import DialogBox from "@/components/custom/dialog-box";
import { SelectController } from "@/components/custom/form.control/SelectController";
import useModuleIdByName from "@/hooks/use-module-id";
import { Guard } from "@/components/custom/permission-guard";
import { IModule, IOption } from "@/app/_Interface/Module";

interface IData {
  moduleData: IModule,
  groupOptions: IOption[]
}

const SubModuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  permissions: z.number().nullable(),
  subModules: z.array(z.lazy((): z.ZodType<any> => SubModuleSchema)),
});

const ModuleFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  group: z.object({ value: z.string() }),
  parentId: z.string().nullable(),
  permissions: z.number().nullable(),
  subModules: z.array(SubModuleSchema),
});

type ModuleFormValues = z.infer<typeof ModuleFormSchema>;

export default function EditModule({ moduleData, groupOptions }: IData) {

  const route = useRouter();
  const moduleId = useModuleIdByName("Groups") as string;

  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  const hasSubmenu = moduleData.subModules && moduleData.subModules.length > 0;

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(ModuleFormSchema),
    defaultValues: {
      id: moduleData.id,
      name: moduleData.name,
      group: { value: moduleData.group as string },
      parentId: moduleData.parentId,
      permissions: moduleData.permissions,
      subModules: moduleData.subModules
    }
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: "subModules",
  });

  const onSubmit = async (data: ModuleFormValues) => {

    try {
      const res = await fetch(`/api/master/module`, {
        method: "PUT",
        body: JSON.stringify({ ...data, group: data.group.value })
      }).then((d) => d.json()).catch((err) => err);

      if (res.success) {
        toast.success('Module updated')
        route.push('.');
        form.reset();
      } else {
        toast.error('Failed to update module');
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update module. Please try again later.");
    } finally {
      route.push('.');
      form.reset();
    }

  };

  const getLabel = useCallback((index: number, parentIndexes: number[] = []) => {
    const labelParts = [...parentIndexes, index + 1];
    return `Sub Module-${labelParts.join('.')}`;
  }, []);

  const renderSubmodules = useCallback(
    (subModules: any[], path: string, depth: number = 1, parentIndexes: number[] = []) => {
      return subModules.map((field, index) => {
        const label = getLabel(index, parentIndexes);
        const key = `${depth}-${index}-${field.id}`;

        return (
          <React.Fragment key={key}>
            <InputController name={`${path}[${index}].name`} label={label} />
            {field.subModules && field.subModules.length > 0 &&
              renderSubmodules(field.subModules, `${path}[${index}].subModules`, depth + 1, [...parentIndexes, index + 1])}
          </React.Fragment>
        );
      });
    },
    [getLabel]
  );

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/master/module", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (res.status === 200) {
        handleClose();
        toast.success('Module deleted');
        route.push('.');
      } else {
        toast.error('Failed to delete module');
        handleClose();
      }

    } catch (error) {
      toast.error("Failed to delete module. Please try again later.");
      handleClose();
      console.error(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <>
      <div className="space-y-4 p-2">
        <TitlePage title="Module" description={show ? "Update module and submodule" : "Overview module and submodule"} viewPage>
          {!show && (
            <>
              <Guard permissionBit={2} moduleId={moduleId}>
                <Button className="size-7" variant={"outline"} size={"sm"} onClick={() => setShow(true)}>
                  <Edit className="size-5" />
                </Button>
              </Guard>
              <Guard permissionBit={8} moduleId={moduleId}>
                <Button className="size-7" variant={"outline"} size={"sm"} onClick={() => setOpen(true)}>
                  <Trash2 className="size-5 text-red-500" />
                </Button>
              </Guard>
            </>
          )}
        </TitlePage>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 space-y-2">
            <SelectController name={`group.value`} label="Group" options={groupOptions} disabled={hasSubmenu} />

            <InputController name={'name'} label="Module" />

            {moduleData && (renderSubmodules(fields, "subModules"))}

            {show && (
              <div className="flex justify-end my-4 gap-2">
                <Button variant={"outline"} onClick={(e) => { e.preventDefault(); setShow(false); }}>
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            )}
          </form>
        </Form>
      </div>

      {open && (
        <DialogBox open={open} title={"Delete Confirmation"} preventClose setClose={handleClose}>
          <h1 className="pb-4">Are you sure? Do you want to delete module {moduleData.name}</h1>
          <div className="flex justify-end">
            <Button onClick={() => handleDelete(moduleData.id)} variant={'destructive'}>Confirm</Button>
          </div>
        </DialogBox>
      )}
    </>
  );
}