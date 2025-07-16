'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import {
    FloatingInputController
} from '@/components/_form-controls/floating-label/input-controller';
import {
    FloatingSelectController
} from '@/components/_form-controls/floating-label/select-controller';
import ConfirmDeleteDialog from '@/components/common/confirm-delete-dialog';
import FormButtons from '@/components/common/form-buttons';
import TitlePage from '@/components/custom/page-heading';
import { Form } from '@/components/ui/form';
import { useMount } from '@/hooks/use-mount';

import { RecursiveModuleForm } from './RecursiveModules';
import { ModuleWithChildren } from '@/types/modules';
import { Options } from '@/types';

export type ModuleFormData = {
    id?: number;
    name: string;
    path?: string | null;
    groupId?: string | null;
    children?: ModuleFormData[];
};

const RecursiveModuleSchema: z.ZodType<ModuleFormData> = z.lazy(() =>
    z.object({
        id: z.number().optional(),
        name: z.string().min(1, { message: "Name is required." }),
        path: z.string().optional().nullable(),
        groupId: z.string().optional().nullable(),
        children: z.array(RecursiveModuleSchema).optional(),
    })
);

const ModuleFormSchema = RecursiveModuleSchema;
type ModuleFormValues = z.infer<typeof ModuleFormSchema>;

interface PageProps {
    id?: number,
    module?: ModuleWithChildren,
    isChild?: boolean,
    groupOptions: Options[]
}

export default function ModuleForm({ id, module, groupOptions, isChild = false }: PageProps) {

    const isEdit = !!id;

    const isMounted = useMount();
    const router = useRouter();

    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<ModuleFormValues>({
        defaultValues: {
            name: '',
            path: '',
            groupId: '',
            children: [],
        },
    });

    useEffect(() => {
        if (id && module) {
            form.reset({
                name: module.name,
                path: module.path || '',
                groupId: String(module.groupId) || '',
                children: module.children || [],
            });
        }
    }, [id, module, form]);


    const onSubmit = async (data: ModuleFormValues) => {

        const method = isEdit ? "PUT" : "POST";
        const url = isEdit ? `/api/master/module/${id}` : `/api/master/module`;
        const failureMessage = isEdit ? "Failed to update module" : "Failed to create module";

        const path = isEdit
            ? data.path
            : data.path === ""
                ? undefined
                : data.path?.startsWith('/')
                    ? data.path
                    : data.path?.startsWith('#')
                        ? undefined
                        : `/${data.path}`

        const final = {
            ...data,
            path
        }

        try {
            setLoading(true);

            const res = await fetch(url, {
                method,
                body: JSON.stringify(final),
            });

            if (!res.ok) {
                const error = await res.json();
                toast.error(error.message || "Failed to create module");
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

    const handleDelete = async (id: number) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/master/module/${id}`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' }
            })

            const result = await res.json();

            if (!res.ok || !result.success) {
                toast.error(result.message || "Failed to delete module");
                return;
            }

            toast.success(result.message);
            router.replace('.');

        } catch (error) {
            console.error(error);
            toast.error("Failed to delete module. Please try again later.");
        } finally {
            router.refresh();
            setOpen(false);
            setLoading(false);
        }
    };

    const nameDesc = isEdit
        ? show ? "This module will get updated" : ""
        : "This module will get added"

    const groupDesc = isEdit
        ? show ? "Module will update under this group." : ""
        : "Module will placed under this group."

    const pageDesc = id
        ? show
            ? "This module will get updated"
            : "To update click edit button ->"
        : "Define a new module"

    const title = id ? show ? "Update Module" : "View Module" : "Create Module";

    const readOnly = !show && !!id;

    if (!isMounted) return null;

    return (
        <>
            <TitlePage
                title={title}
                description={pageDesc}
                viewPage={!!id}
                createPage={!id}
                isEditingVisible={!show && !!id}
                onEdit={() => setShow(true)}
                onDelete={() => setOpen(true)}
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        {!isChild && (
                            <FloatingSelectController
                                name="groupId"
                                label="Group"
                                options={groupOptions ?? []}
                                description={groupDesc}
                                readOnly={readOnly}
                                disabled={readOnly}
                            />
                        )}
                        <FloatingInputController
                            name="name"
                            label="Module Name"
                            description={nameDesc}
                            type='text'
                            readOnly={readOnly}
                        />
                        <FloatingInputController
                            name="path"
                            label="Path"
                            description={show ? `This will be use for routing. If parent use '#'` : undefined}
                            type='text'
                            readOnly={readOnly}
                        />
                    </div>

                    <div>
                        <h1 className="text-sm font-semibold">SubModules</h1>
                        <p className="text-sm text-gray-500">
                            "Submodules are optional; they are used to create a hierarchy of modules."
                        </p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {id ? show ? 'Update submodules of:' : 'Submodules of:' : 'Add submodules to:'} &nbsp;
                        {`${form.watch('name')}`}
                    </p>

                    <RecursiveModuleForm
                        nestPath="children"
                        readOnly={readOnly}
                        isEdit={isEdit}
                        show={show}
                    />

                    {((show && id) || (!id)) && (
                        <FormButtons id={id} loading={loading} />
                    )}
                </form>
            </Form>

            {open && id && (
                <ConfirmDeleteDialog
                    open={open}
                    itemName={module?.name || ''}
                    loading={loading}
                    onConfirm={() => handleDelete(id)}
                    onCancel={() => setOpen(false)}
                />
            )}
        </>
    );
}