"use client";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { InputController } from "@/components/custom/form.control/InputController";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { IModule } from "../ModuleInterface";

export const ModuleFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  permissions: z.number(),
  submodules: z.unknown()
});


export type ModuleFormValues = z.infer<typeof ModuleFormSchema>;

export default function EditModule({ data }: { data: IModule }) {
  const route = useRouter();
  const hasSubmodule = data && data?.submodules?.length > 0;

  const form = useForm<IModule>({
    resolver: zodResolver(ModuleFormSchema),
    defaultValues: {
      id: "",
      name: "",
      parentId: "",
      permissions: 0,
      submodules: []
    },
  });

  useEffect(() => {
    if (data) {
      Object.entries(data).map(([key, val])=> {
        return form.setValue(key as any, val);
      })
    }
  }, []);


  const onSubmit = async (data:IModule) => {

    const res = await fetch(`/api/master/module`, {
      method: "PUT",
      body: JSON.stringify(data)
    }).then((d) => d.json()).catch((err) => err);

    if (res.success) {
      toast.success('Module updated')

      form.reset();
      route.push('.');

    } else {
      toast.error('Failed to update module');
    }
  };

  return (
    <div className="space-y-8 p-2">
      <TitlePage title="Update Module" description="Update module or submodule">
        <div>
          <Button
            className="size-7"
            variant={"outline"}
            size={"sm"}
            onClick={() => route.back()}
          >
            <ArrowLeft className="size-5" />
          </Button>
        </div>
      </TitlePage>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-2">

          <InputController name={'name'} label="Module" />
          {/* {
            hasSubmodule &&
            (data?.submodules.map((item, index) => (
              <InputController name={`submodules.${index}.name`} label={`Sub-Module-${index+1}`} key={item.id}/>
            )))
          } */}

          {
            hasSubmodule &&
            (data?.submodules.map((item, index) => (
              <React.Fragment key={item.id}>{
                  item?.submodules && item?.submodules.map((subItem, subIndex)=>(
                    <InputController name={`submodules.${index}.submodules.${subIndex}.name`} label={`Sub-Module-Child-${subIndex+1}`} key={subItem.id}/>
                ))}
                <InputController name={`submodules.${index}.name`} label={`Sub-Module-${index+1}`} key={item.id}/>
              </React.Fragment>
            )))
          }

          <div className="flex justify-end my-4 gap-2">
            <Button variant={"outline"} onClick={(e) =>{e.preventDefault(); route.back();}}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
