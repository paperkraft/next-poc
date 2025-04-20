"use client";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import DialogBox from "@/components/custom/dialog-box";
import useModuleIdByName from "@/hooks/use-module-id";
import { IModule, IOption } from "@/app/_Interface/Module";
import ButtonContent from "@/components/custom/button-content";
import { FloatingInputController } from "@/components/_form-controls/floating-label/input-controller";
import { FloatingSelectController } from "@/components/_form-controls/floating-label/select-controller";
import { RecursiveModuleForm } from "./RecursiveModules";

export type ModuleFormData = {
  id?: string;
  name: string;
  path?: string | null;
  groupId?: string | null;
  children?: ModuleFormData[];
};


const RecursiveModuleSchema: z.ZodType<ModuleFormData> = z.lazy(() =>
  z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Required'),
    path: z.string().optional().nullable(),
    groupId: z.string().optional().nullable(),
    children: z.array(RecursiveModuleSchema).optional(),
  })
);

const ModuleFormSchema = RecursiveModuleSchema;
interface PageProps {
  id: string,
  moduleData: IModule,
  groupOptions: IOption[]
}

type ModuleFormValues = z.infer<typeof ModuleFormSchema>;

export default function EditModule({ id, moduleData, groupOptions }: PageProps) {

  console.log("moduleData", moduleData);

  const router = useRouter();
  const moduleId = useModuleIdByName("Module") as string;

  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasSubmenu = moduleData.subModules && moduleData.subModules.length > 0;

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(ModuleFormSchema),
    defaultValues: {
      name: moduleData.name,
      path: moduleData.path || '',
      groupId: moduleData.groupId || '',
      children: moduleData.children || [],
    }
  });


  console.log("error", form.formState.errors);

 

  const onSubmit = async (data: ModuleFormValues) => {
    setLoading(true);

    const payload = { ...data };
    console.log("payload", payload);

    try {
      const res = await fetch(`/api/master/module/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      }).then((d) => d.json()).catch((err) => err);

      if (res.success) {
        toast.success('Module updated');
        router.push('.');
      } else {
        toast.error('Failed to update module');
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update module. Please try again later.");
    } finally {
      router.refresh();
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/master/module/${id}`, {
        method: "DELETE",
        // body: JSON.stringify({ id }),
      }).then((d) => d.json());

      if (res.success) {
        handleClose();
        toast.success('Module deleted');
        router.replace('.');
      } else {
        toast.error('Failed to delete module');
        handleClose();
      }

    } catch (error) {
      toast.error("Failed to delete module. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
      handleClose();
      router.refresh();
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
                <Button className="size-7" variant={"outline"} size={"sm"} onClick={() => setShow(true)}>
                  <Edit className="size-5" />
                </Button>
                <Button className="size-7" variant={"outline"} size={"sm"} onClick={() => setOpen(true)}>
                  <Trash2 className="size-5 text-red-500" />
                </Button>
            </>
          )}
        </TitlePage>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {moduleData.groupId &&
                <FloatingSelectController
                  name={`groupId`}
                  label="Group"
                  options={groupOptions}
                  readOnly={!show}
                  disabled={hasSubmenu} />
              }

              <FloatingInputController
                name={'name'}
                label="Module"
                readOnly={!show} />

              <FloatingInputController
                name={'path'}
                label="URL"
                type="text"
                readOnly={!show} />
            </div>

            <div>
              <h1 className="text-sm font-semibold">SubModules</h1>
              <p className="text-sm text-gray-500">Add submodules to the module. Submodules are optional.</p>
              <p className="text-sm text-gray-500">Submodules are used to create a hierarchy of modules.</p>
            </div>


            {/* <RecursiveModuleForm /> */}
            {/* <ModuleList name="children" /> */}
            <RecursiveModuleForm nestPath="children" />

            {show && (
              <div className="flex justify-end my-4 gap-2">
                <Button type="button" variant={"outline"} onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  <ButtonContent status={loading} text={"Update"} />
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>

      {open && (
        <DialogBox open={open} title={"Delete Confirmation"} preventClose setClose={handleClose}>
          <h1 className="pb-4">Are you sure? Do you want to delete module {moduleData.name}</h1>
          <div className="flex justify-end">
            <Button onClick={() => handleDelete(moduleData.id)} variant={'destructive'} disabled={loading}>
              <ButtonContent status={loading} text={"Confirm"} loadingText="Deleting..." />
            </Button>
          </div>
        </DialogBox>
      )}
    </>
  );
}