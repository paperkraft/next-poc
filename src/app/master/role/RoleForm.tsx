"use client";
import { Edit, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { InputController } from '@/components/_form-controls/InputController';
import ButtonContent from '@/components/custom/button-content';
import DialogBox from '@/components/custom/dialog-box';
import TitlePage from '@/components/custom/page-heading';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useMounted } from '@/hooks/use-mounted';
import { zodResolver } from '@hookform/resolvers/zod';

export const roleFormSchema = z.object({
  name: z.string({
    required_error: "Name is required.",
  }).min(1, {
    message: "Name is required.",
  }),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

type Role = {
  id: string;
  name: string;
};

export default function RoleForm({ data }: { data?: Role }) {

  const { id } = data || { id: "" };
  const router = useRouter();
  const path = usePathname();
  const mounted = useMounted();

  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (id) {
      form.reset({
        name: data?.name || "",
      });
    }
  }, [id, data, form]);

  const onSubmit = async (data: RoleFormValues) => {

    const final = {
      name: data.name
    };

    const isEdit = !!id;
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `/api/master/role/${id}` : "/api/master/role";
    const failureMessage = isEdit ? "Failed to update role" : "Failed to create role";


    try {
      setLoading(true);

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(final),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || "Failed to create role");
        return;
      }

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        router.push('.');
      } else {
        toast.error(result.message);
      }

    } catch (error) {
      console.error(error);
      toast.error(failureMessage + ". Please try again later.");
    } finally {
      router.refresh();
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/master/role", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || "Failed to delete role");
        return;
      }

      const result = await res.json();

      if (result.success) {
        toast.success("Role deleted");
        router.replace('.');
      } else {
        toast.error("Failed to delete role");
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to delete role. Please try again later.");
    } finally {
      setOpen(false);
      router.refresh();
    }
  }

  const shouldReset = (show && !!id) || (!id);


  const description = id
    ? show
      ? "This role will get updated"
      : "To update click pencil button above right corner"
    : "This role will get added"

  const pageDesc = id
    ? show
      ? "Update role"
      : "View role"
    : "Define a new role"

  const title = id ? "Role" : "Create Role";

  return (
    mounted &&
    <>
      {/* Title and Action Buttons */}
      <TitlePage title={title} description={pageDesc} viewPage={!!id} createPage={!id}>
        {!show && id && (
          <>
            <PermissionGuard action="UPDATE" path={path}>
              <Button className="size-7" variant={"outline"} size={"sm"} onClick={() => setShow(true)}>
                <Edit className="size-5" />
              </Button>
            </PermissionGuard>
            <PermissionGuard action="DELETE" path={path}>
              <Button className="size-7" variant={"outline"} size={"sm"} onClick={() => setOpen(true)}>
                <Trash2 className="size-5 text-destructive" />
              </Button>
            </PermissionGuard>
          </>
        )}
      </TitlePage>

      {/* Form for Role Creation/Update */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-2">
          <InputController
            type="text"
            name="name"
            label="Role"
            placeholder="Enter role"
            description={description}
            reset={shouldReset}
            readOnly={!show && !!id}
          />

          {((show && id) || (!id)) && (
            <div className="flex justify-end my-4 gap-2">
              <Button type="button" variant={"outline"} onClick={() => router.back()}>
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                <ButtonContent status={loading} text={id ? "Update" : "Create"} />
              </Button>
            </div>
          )}
        </form>
      </Form>

      {/* Delete Confirmation Modal */}
      {open && (
        <DialogBox open={open} title={"Delete Confirmation"} preventClose setClose={() => setOpen(false)}>
          <p>Are you sure? Do you want to delete the role <strong>{data?.name}</strong>? This action cannot be undone.</p>
          <div className="flex justify-end">
            <Button onClick={() => handleDelete(id as string)} variant={'destructive'}>Confirm</Button>
          </div>
        </DialogBox>
      )}
    </>
  );
}