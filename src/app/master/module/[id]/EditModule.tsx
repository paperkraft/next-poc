"use client";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { InputController } from "@/components/custom/form.control/InputController";
import { useEffect } from "react";

export const ModuleFormSchema = z.object({
    parentId: z.string(),
    parent: z.string(),
    name: z
        .string({
        required_error: "Module is required.",
        })
        .min(1, {
        message: "Module is required.",
        }),
});

export type ModuleFormValues = z.infer<typeof ModuleFormSchema>;

export default function EditModule({ data }: { data: any }) {
  const route = useRouter();
  const { id } = useParams();

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(ModuleFormSchema),
    defaultValues: {
        parentId: "",
        parent: "",
        name: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("name", data.name);
      if (data.parentId) {
        form.setValue("parent", data.parent.name);
        form.setValue("parentId", data.parent.id);
      }
    }
  }, []);

//   console.log(data);

  const onSubmit = async (data: ModuleFormValues) => {
    console.log(JSON.stringify(data, null, 2));

    const final = {
        id:id,
        name: data.name,
        parentId: data.parentId !== "" ? data.parentId : null
    }

    const res = await fetch(`/api/module`,{
        method:"PUT",
        body: JSON.stringify(final)
    });

    if(res.statusText)

    console.log('Response', res);
    
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-2">
          {data.parentId && (
            <InputController name="parent" label="Module" readOnly />
          )}

          <InputController
            name="name"
            label={`${data.parentId ? "Sub" : ""} Module`}
            placeholder="Enter module"
            reset
          />

          <div className="flex justify-end my-4 gap-2">
            <Button
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault();
                form.reset();
              }}
            >
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
