'use client';

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
import { useMounted } from '@/hooks/use-mounted';
import { zodResolver } from '@hookform/resolvers/zod';

const groupSchema = z.object({
    name: z.string({
        required_error: "Name is required.",
    }).min(1, {
        message: "Name is required.",
    }),
});

export type GroupFormValues = z.infer<typeof groupSchema>;

type GroupFormProps = {
    id?: number;
    data?: {
        id: number;
        name: string;
    }
}

export default function GroupForm({ id, data }: GroupFormProps) {

    const router = useRouter();
    const mounted = useMounted();

    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<GroupFormValues>({
        resolver: zodResolver(groupSchema),
        defaultValues: { name: "" },
    });

    useEffect(() => {
        if (id) {
            form.reset({
                name: data?.name || ""
            });
        }
    }, [id, data, form]);

    const onSubmit = async (data: GroupFormValues) => {

        const final = {
            name: data.name
        };

        const isEdit = !!id;
        const method = isEdit ? "PUT" : "POST";
        const url = isEdit ? `/api/master/group/${id}` : '/api/master/group';
        const failureMessage = isEdit ? "Failed to update group" : "Failed to create group";

        try {
            setLoading(true);
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(final)
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
    }

    const handleDelete = async (ids: number[]) => {
        try {
            setLoading(true);
            const res = await fetch("/api/master/group", {
                method: "DELETE",
                body: JSON.stringify({ ids }),
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                toast.error(result.message || "Failed to delete group");
                return;
            }

            toast.success(result.message);
            router.replace('.');

        } catch (error) {
            console.error(error);
            toast.error("Failed to delete group. Please try again later.");
        } finally {
            setOpen(false);
            setLoading(true);
            router.refresh();
        }
    }

    const shouldReset = (show && !!id) || (!id);
    const description = id
        ? show
            ? "This group will be updated in the system."
            : "To update click pencil button above right corner."
        : "This group will be added to the system."

    const pageDesc = id
        ? show
            ? "Update group"
            : "View group"
        : "Define a new group"

    const title = id ? "Group" : "Create Group";

    return (
        mounted &&
        <>
            {/* Title and action buttons */}
            <TitlePage
                title={title}
                description={pageDesc}
                viewPage={!!id}
                createPage={!id}
                isEditingVisible={!show && !!id}
                onEdit={() => setShow(true)}
                onDelete={() => setOpen(true)}
            />

            {/* Form for Group Creation/Update  */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-2">
                    <InputController
                        type="text"
                        name="name"
                        label="Group Name"
                        placeholder="Enter group name"
                        description={description}
                        reset={shouldReset}
                        readOnly={!show && !!id}
                    />

                    {((show && id) || (id)) && (
                        <FormButtons id={+id} loading={loading} />
                    )}
                </form>
            </Form>

            {/* Confirmation dialog for deletion */}
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