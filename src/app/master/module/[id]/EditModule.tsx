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
import React, { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { IModule } from "../ModuleInterface";

export const ModuleFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  permissions: z.number().nullable(),
  submodules: z.array(z.lazy((): z.ZodType<IModule> => ModuleFormSchema)),
});

export type ModuleFormValues = z.infer<typeof ModuleFormSchema>;

export default function EditModule({ data }: { data: IModule }) {

  const route = useRouter();
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(ModuleFormSchema),
    defaultValues: {
      id: "",
      name: "",
      parentId: "",
      permissions: 0,
      submodules: [
        {
          id: "",
          name: "",
          parentId: "",
          permissions: null,
          submodules: []
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "submodules",
  });

  useEffect(() => {
    if (data) {
      Object.entries(data).map(([key, val])=> {
        return form.setValue(key as any, val);
      })
    }
  }, []);

  const onSubmit = async (data:ModuleFormValues) => {

    const res = await fetch(`/api/master/module`, {
      method: "PUT",
      body: JSON.stringify(data)
    }).then((d) => d.json()).catch((err) => err);

    if (res.success) {
      toast.success('Module updated')
      route.push('.');
      form.reset();
    } else {
      toast.error('Failed to update module');
    }
  };

  const getLabel = useCallback(( index: number, parentIndexes: number[] = []) => {
    const labelParts = [...parentIndexes, index + 1];
    return `Sub Module-${labelParts.join('.')}`;
  }, []); 
  
  const renderSubmodules = useCallback(
    (submodules: any[], path: string, depth: number = 1, parentIndexes: number[] = []) => {
      return submodules.map((field, index) => {
        const label = getLabel(index, parentIndexes);
        const key = `${depth}-${index}-${field.id}`;
  
        return (
          <React.Fragment key={key}>
            <InputController name={`${path}[${index}].name`} label={label} />
            {field.submodules && field.submodules.length > 0 &&
              renderSubmodules(field.submodules, `${path}[${index}].submodules`, depth + 1, [...parentIndexes, index+1])}
          </React.Fragment>
        );
      });
    },
    [getLabel]
  );

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
          <InputController name={'name'} label="Module" />
          {renderSubmodules(fields, "submodules")}
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

