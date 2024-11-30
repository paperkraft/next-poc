"use client";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { InputController } from "@/components/custom/form.control/InputController";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import TitlePage from "@/components/custom/page-heading";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const bitmask = [
  { name: "VIEW", bitmask: 1 },
  { name: "EDIT", bitmask: 2 },
  { name: "CREATE", bitmask: 4 },
  { name: "DELETE", bitmask: 8 },
];

const permissionObject = z.object({
  name: z.string(),
  bitmask: z.boolean(),
});

export const roleFormSchema = z.object({
  name: z
    .string({
      required_error: "Role is required.",
    })
    .min(1, {
      message: "Role is required.",
    }),
  permissions: z.array(permissionObject),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

export default function RoleForm() {
  const route = useRouter();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      permissions: [
        { name: "VIEW", bitmask: false },
        { name: "EDIT", bitmask: false },
        { name: "CREATE", bitmask: false },
        { name: "DELETE", bitmask: false },
      ],
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    const final = {
      name: data.name,
      permissions: calculateBitmask(data.permissions),
    };

    const res = await fetch("/api/master/role", {
      method: "POST",
      body: JSON.stringify(final),
    });

    if (res.status === 200) {
      toast.success('Role created');
      route.push('.')
    } else {
      toast.error('Failed to create role');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-2">
        <InputController
          name="name"
          label="Role"
          placeholder="Enter role"
          description="This role will get added."
          reset
        />

        <div className="flex flex-col gap-2">
          <FormLabel>Permissions</FormLabel>
          <div className="grid md:grid-cols-4">
            {bitmask.map((item, index) => (
              <FormField
                key={index}
                name={`permissions.${index}.bitmask`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="mr-2 mt-2">{item.name}</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
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
  );
}

type Role = {
  name: string;
  bitmask: boolean;
};

export function calculateBitmask(permissions: Role[]) {
  // Initialize a variable to accumulate the bitmask value
  let combinedBitmask = 0;

  // Iterate over the permissions and add the corresponding bitmask values
  permissions.forEach((permission) => {
    const matchingBitmask = bitmask.find((b) => b.name === permission.name);
    if (matchingBitmask && permission.bitmask) {
      combinedBitmask |= matchingBitmask.bitmask;
    }
  });

  return combinedBitmask;
}

export function reverseBitmask(bitmaskValue: number): Role[] {
  const permissions = bitmask.map((permission) => ({
    name: permission.name,
    bitmask: (bitmaskValue & permission.bitmask) === permission.bitmask,
  }));

  return permissions;
}