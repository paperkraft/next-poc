'use client';
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

const groupSchema = z.object({
    name: z.string({
        required_error: "Name is required.",
    }).min(1, {
        message: "Name is required.",
    }),
});

export type GroupFormValues = z.infer<typeof groupSchema>;

type Group = {
    id: string;
    name: string;
}

export default function GroupForm({ data }: { data?: Group }) {

    const { id } = data || { id: "" };
    const router = useRouter();
    const path = usePathname();
    const mounted = useMounted();

    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<GroupFormValues>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: ""
        },
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
        const url = isEdit ? `/api/master/group/${id}` : '/api/master/group';
        const method = isEdit ? "PUT" : "POST";
        const failureMessage = isEdit ? "Failed to update group" : "Failed to create group";

        try {
            setLoading(true);
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(final)
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message || "Failed to create group");
                return;
            }

            const result = await response.json();

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
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch("/api/master/group", {
                method: "DELETE",
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error(error.message || "Failed to delete group");
                return;
            }

            const result = await res.json();

            if (result.success) {
                toast.success("group deleted");
                router.replace('.');
            } else {
                toast.error("Failed to delete group ");
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to delete group. Please try again later.");
        } finally {
            setOpen(false);
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

            {/* Confirmation dialog for deletion */}
            {open && (
                <DialogBox open={open} title={"Delete Confirmation"} preventClose setClose={() => setOpen(false)}>
                    <p>Are you sure? Do you want to delete group <strong>{data?.name}</strong>? This action cannot be undone.</p>
                    <div className="flex justify-end">
                        <Button onClick={() => handleDelete(id)} variant={'destructive'}>Confirm</Button>
                    </div>
                </DialogBox>
            )}
        </>
    );
}