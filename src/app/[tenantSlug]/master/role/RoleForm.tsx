"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { InputController } from '@/components/_form-controls/InputController';
import ConfirmDeleteDialog from '@/components/common/confirm-delete-dialog';
import FormButtons from '@/components/common/form-buttons';
import TitlePage from '@/components/custom/page-heading';
import { Form } from '@/components/ui/form';
import { useMount } from '@/hooks/use-mount';
import { zodResolver } from '@hookform/resolvers/zod';

export const roleFormSchema = z.object({
  name: z.string({
    required_error: "Name is required.",
  }).min(1, {
    message: "Name is required.",
  }),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

type RoleFormProps = {
  id?: number;
  data?: {
    id: number;
    name: string;
  }
};

export default function RoleForm({ id, data }: RoleFormProps) {

  const router = useRouter();
  const isMounted = useMount();

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
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(final),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message || failureMessage);
        return;
      }

      toast.success(result.message);
      router.push('.');

    } catch (error) {
      console.error(error);
      toast.error(failureMessage + ". Please try again later.");
    } finally {
      router.refresh();
      setLoading(false);
    }
  };

  const handleDelete = async (ids: number[]) => {
    try {
      setLoading(true);
      const res = await fetch("/api/master/role", {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error(result.message || "Failed to delete role");
        return;
      }

      toast.success(result.message);
      router.replace('.');

    } catch (error) {
      console.error(error);
      toast.error("Failed to delete role. Please try again later.");
    } finally {
      setOpen(false);
      setLoading(false);
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

  if (!isMounted) return null;

  return (
    <>
      {/* Title and Action Buttons */}
      <TitlePage
        title={title}
        description={pageDesc}
        viewPage={!!id}
        createPage={!id}
        isEditingVisible={!show && !!id}
        onEdit={() => setShow(true)}
        onDelete={() => setOpen(true)}
      />

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
            <FormButtons id={id} loading={loading} />
          )}
        </form>
      </Form>

      {/* Delete Confirmation Modal */}
      {open && (
        <ConfirmDeleteDialog
          open={open}
          itemName={data?.name || ''}
          loading={loading}
          onConfirm={() => id && handleDelete([id])}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
}