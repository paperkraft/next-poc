"use client";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { InputController } from "@/components/custom/form.control/InputController";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { SelectController } from "@/components/custom/form.control/SelectController";
import { toast } from "sonner";

export const ModuleFormSchema = z.object({
  name: z
    .string({
      required_error: "Module is required.",
    })
    .min(1, {
      message: "Module is required.",
    }),
  isParent: z.boolean(),
  parent: z.object({
    value: z.string()
  }).optional()
}).refine((data) => {
  if (data.isParent && !data?.parent?.value) {
    return false;
  }
  return true;
}, {
  message: "Parent field is required when 'is Submodule' is true",
  path: ['parent.value']
}
)

export type ModuleFormValues = z.infer<typeof ModuleFormSchema>;

type Options = {
  label: string;
  value: string;
}

export default function AddModule() {
  const route = useRouter();
  const [options, setOptions] = useState<Options[]>()

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(ModuleFormSchema),
    defaultValues: {
      name: "",
      parent: { value: "" },
      isParent: false
    },
  });

  const onSubmit = async (data: ModuleFormValues) => {
    const final = data.isParent ? { name: data.name, parentId: data?.parent?.value } : { name: data.name, parentId: null }

    const res = await fetch(`/api/master/module`, {
      method: "POST",
      body: JSON.stringify(final),
    }).then((d)=> d.json()).catch((err)=> console.error(err));

    // console.log(res);
    if(res.success){
      toast.success('Module Created')
      route.push('.');
    } else {
      toast.success('Failed to create module')
    }
  };

  useEffect(() => {
    const getModules = async () => {
      const response = await fetch('/api/master/module').then((res) => res.json()).catch((err) => console.error(err));
      if (response.success) {
        const data = formatModules(response.data)
        setOptions(data)
      }
    }
    getModules();
  }, []);

  return (
    <div className="space-y-8 p-2">
      <TitlePage title="Create Module" description="Define a new module">
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
          <InputController
            name="name"
            label="Name"
            placeholder="Enter module"
            description={`This will be a ${form.watch('isParent') ? "sub" : "parent"} module.`}
            reset
          />

          <FormField
            name="isParent"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormLabel className="mr-2 mt-2">Is Sub Module?</FormLabel>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormItem>
            )}
          />

          {
            form.watch('isParent') && options &&
            <SelectController name={`parent.value`} label="Select Parent Module" options={options} description={`This will be parent module of ${form.watch('name')}`} />
          }

          <div className="flex justify-end my-4 gap-2">
            <Button variant={"outline"} onClick={(e) => { e.preventDefault(); form.reset(); }} >
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


interface Module {
  id: string;
  name: string;
  parentId: string | null;
  permissions: number | null;
  submodules: Module[];
}

interface FormattedModule {
  label: string;
  value: string;
}

function formatModules(modules: Module[], parentLabel: string = ''): FormattedModule[] {
  const result: FormattedModule[] = [];

  modules.forEach(module => {
    const label = parentLabel ? `${parentLabel} - ${module.name}` : module.name;
    result.push({ label, value: module.id });

    // Recursively process submodules if any
    if (module.submodules && module.submodules.length > 0) {
      const submodules = formatModules(module.submodules, label);
      result.push(...submodules);
    }
  });

  return result;
}