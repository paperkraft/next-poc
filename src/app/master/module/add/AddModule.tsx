"use client";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { InputController } from "@/components/custom/form.control/InputController";
import { SelectController } from "@/components/custom/form.control/SelectController";
import { toast } from "sonner";
import { SwitchButton } from "@/components/custom/form.control/SwitchButton";
import { IModule, IOption } from "@/app/_Interface/Module";
import { useState } from "react";
import ButtonContent from "@/components/custom/button-content";

export const ModuleFormSchema = z.object({
  name: z.string().min(1, { message: "Module is required." }),
  path: z.string().min(1, { message: "URL is required." }),
  // group: z.object({ value: z.string() }),
  group: z.string(),
  isParent: z.boolean(),
  parent: z.object({ value: z.string() }).optional()
}).refine((data) => {
  if (data.isParent && !data?.parent?.value) {
    return false;
  }
  return true;
}, {
  message: "Parent field is required when 'is Submodule' is true",
  path: ['parent.value']
}
).refine((d) => {
  if (!d.isParent && !d?.group) {
    return false;
  }
  return true;
}, {
  message: "Group is required to categorized",
  path: ['group']
}
)

type ModuleFormValues = z.infer<typeof ModuleFormSchema>;

export default function AddModule({ modules, groups }: { modules: IModule[], groups: IOption[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const moduleOptions = formatModules(modules);

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(ModuleFormSchema),
    defaultValues: {
      name: "",
      path: "",
      group: "",
      parent: { value: "" },
      isParent: false
    },
  });

  const onSubmit = async (data: ModuleFormValues) => {
    const final = data.isParent
      ? { name: data.name, path: `/${data.path}`, parentId: data?.parent?.value }
      : { name: data.name, path: `/${data.path}`, parentId: null, groupId: data?.group }

    setLoading(true);
    try {
      const res = await fetch(`/api/master/module`, {
        method: "POST",
        body: JSON.stringify(final),
      }).then((d) => d.json()).catch((err) => console.error(err));

      if (res.success) {
        toast.success('Module Created')
        router.push('.');
      } else {
        toast.error('Failed to create module')
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to create module. Please try again later.");
    } finally {
      router.refresh();
      setLoading(false);
    }
  };

  const dd = form.watch('group');

  console.log('group', dd);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-2">
        <InputController
          name="name"
          label="Name"
          placeholder="Enter module"
          description={`This will be a ${form.watch('isParent') ? "sub" : "parent"} module.`}
          reset
        />

        <SelectController name={`group`} label="Group"
          options={groups ?? []}
          description={form.watch('name') ? `${form.watch('name')} will placed under this group` : undefined} />

        <InputController
          type="text"
          name="path"
          label="URL"
          placeholder="Enter URL"
          description={`This will be use for routing.`}
          reset
        />

        <SwitchButton name="isParent" label="Is Sub Module?" />

        {
          form.watch('isParent') && moduleOptions && (
            <SelectController name={`parent.value`} label="Select Parent Module" options={moduleOptions}
              description={`This will be parent module of ${form.watch('name')}`} />)
        }

        <div className="flex justify-end my-4 gap-2">
          <Button type="button" variant={"outline"} onClick={() => form.reset()}>Reset</Button>
          <Button type="submit" disabled={loading}>
            <ButtonContent status={loading} text={"Create"} />
          </Button>
        </div>
      </form>
    </Form>
  );
}

function formatModules(modules: IModule[], parentLabel: string = ''): IOption[] {
  const result: IOption[] = [];

  modules.forEach(module => {
    const label = parentLabel ? `${parentLabel} - ${module.name}` : module.name;
    result.push({ label, value: module.id });

    // Recursively process submodules if any
    if (module.subModules && module.subModules.length > 0) {
      const subModules = formatModules(module.subModules, label);
      result.push(...subModules);
    }
  });

  return result;
}