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
import { SwitchButton } from "@/components/custom/form.control/SwitchButton";
import { useQuery } from "@tanstack/react-query";

export const ModuleFormSchema = z.object({
  name: z.string().min(1, { message: "Module is required." }),
  group: z.object({ value: z.string() }),
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
  if (!d.isParent && !d?.group?.value) {
    return false;
  }
  return true;
}, {
  message: "Group is required to categorized",
  path: ['group.value']
}
)

type ModuleFormValues = z.infer<typeof ModuleFormSchema>;

type Options = {
  label: string;
  value: string;
}

const fetchGroups = async () => {
  const response = await fetch('/api/master/group');
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  const data = await response.json();
  if (data.success) {
      return data.data.map((item:any) => ({ label: item.name, value: item.id }))
  }
  throw new Error('Failed to fetch groups');
};

const fetchModules = async () => {
  const response = await fetch('/api/master/module');
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  const data = await response.json();
  if (data.success) {
    return formatModules(data.data)
  }
  throw new Error('Failed to fetch modules');
};

export default function AddModule() {
  const route = useRouter();
  const { data: moduleOptions, isLoading: isLoadingModule, isError: isErrorModule, error: moduleError } = useQuery({ queryKey: ['moduleoptions'], queryFn: fetchModules });
  const { data: groupOptions, isLoading: isLoadingGroups, isError: isErrorGroups, error: groupsError } = useQuery({ queryKey: ['groupOptions'], queryFn: fetchGroups });
 
  if (isErrorModule || isErrorGroups) {
    console.log('Error', moduleError?.message || groupsError?.message)
  }

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(ModuleFormSchema),
    defaultValues: {
      name: "",
      group: { value: "" },
      parent: { value: "" },
      isParent: false
    },
  });

  const onSubmit = async (data: ModuleFormValues) => {
    const final = data.isParent
      ? { name: data.name, parentId: data?.parent?.value }
      : { name: data.name, parentId: null, groupId: data?.group?.value }

    const res = await fetch(`/api/master/module`, {
      method: "POST",
      body: JSON.stringify(final),
    }).then((d) => d.json()).catch((err) => console.error(err));

    // console.log(res);
    if (res.success) {
      toast.success('Module Created')
      route.push('.');
    } else {
      toast.error('Failed to create module')
    }
  };

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

        <SelectController name={`group.value`} label="Category" options={groupOptions}
          description={` ${form.watch('name')} will placed under : ${form.watch('group.value')}`} />

        <SwitchButton name="isParent" label="Is Sub Module?"/>

        {
          form.watch('isParent') && moduleOptions && (
          <SelectController name={`parent.value`} label="Select Parent Module" options={moduleOptions} 
            description={`This will be parent module of ${form.watch('name')}`} /> )
        }

        <div className="flex justify-end my-4 gap-2">
          <Button variant={"outline"} onClick={(e) => { e.preventDefault(); form.reset(); }} >
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}


interface Module {
  id: string;
  name: string;
  parentId: string | null;
  permissions: number | null;
  subModules: Module[];
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
    if (module.subModules && module.subModules.length > 0) {
      const subModules = formatModules(module.subModules, label);
      result.push(...subModules);
    }
  });

  return result;
}