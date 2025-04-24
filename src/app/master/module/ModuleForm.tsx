'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FloatingInputController } from '@/components/_form-controls/floating-label/input-controller';
import { usePathname, useRouter } from 'next/navigation';
import { FloatingSelectController } from '@/components/_form-controls/floating-label/select-controller';
import { IOption, IModule } from '@/app/_Interface/Module';
import { toast } from 'sonner';
import * as z from 'zod';
import { useMounted } from '@/hooks/use-mounted';
import { useEffect, useState } from 'react';
import ButtonContent from '@/components/custom/button-content';
import TitlePage from '@/components/custom/page-heading';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Edit, Loader, Trash2 } from 'lucide-react';
import { RecursiveModuleForm } from './RecursiveModules';
import { Form } from '@/components/ui/form';
import DialogBox from '@/components/custom/dialog-box';

export type ModuleFormData = {
    id?: string;
    name: string;
    path?: string | null;
    groupId?: string | null;
    children?: ModuleFormData[];
};

const RecursiveModuleSchema: z.ZodType<ModuleFormData> = z.lazy(() =>
    z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: "Name is required." }),
        path: z.string().optional().nullable(),
        groupId: z.string().optional().nullable(),
        children: z.array(RecursiveModuleSchema).optional(),
    })
);

const ModuleFormSchema = RecursiveModuleSchema;
type ModuleFormValues = z.infer<typeof ModuleFormSchema>;

interface PageProps {
    id?: string,
    modules?: IModule,
    groupOptions: IOption[]
}

export default function ModuleForm({ id, modules, groupOptions }: PageProps) {

    const isEdit = !!id;

    const mounted = useMounted();
    const router = useRouter();
    const path = usePathname();

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
        if (id && modules) {
            form.reset({
                name: modules.name,
                path: modules.path || '',
                groupId: modules.groupId || '',
                children: modules.children || [],
            });
        }
    }, [id, modules, form]);


    const onSubmit = async (data: ModuleFormValues) => {

        const method = isEdit ? "PUT" : "POST";
        const url = isEdit ? `/api/master/module/${id}` : `/api/master/module`;
        const failureMessage = isEdit ? "Failed to update module" : "Failed to create module";

        try {
            setLoading(true);

            const res = await fetch(url, {
                method,
                body: JSON.stringify(data),
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

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/master/module/${id}`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' }
            })

            if (!res.ok) {
                const error = await res.json();
                toast.error(error.message);
                return;
            }

            const result = await res.json();

            if (result.success) {
                toast.success(result.message);
                router.replace('.');
            } else {
                toast.error(result.message);
            }

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

    return (
        mounted &&
        <>
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

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <FloatingSelectController
                            name="groupId"
                            label="Group"
                            options={groupOptions ?? []}
                            description={groupDesc}
                            readOnly={readOnly}
                            disabled={readOnly}
                        />
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
                        <p className="text-sm text-gray-500">"Submodules are optional; they are used to create a hierarchy of modules."</p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {id ? show ? 'Update submodules of:' : 'Submodules of:' : 'Add submodules to:'} &nbsp;
                        {`${form.watch('name')}`}
                    </p>

                    <RecursiveModuleForm nestPath="children" readOnly={readOnly} isEdit={isEdit} show={show} />

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

            {open && mounted && (
                <DialogBox
                    open={open}
                    preventClose
                    title={"Delete Confirmation"}
                    setClose={() => setOpen(false)}
                >
                    <p>Are you sure? Do you want to delete the module&nbsp;
                        <strong>{modules?.name}</strong>?<br />
                        This action cannot be undone.
                    </p>

                    <div className="flex justify-end gap-2">
                        <Button
                            aria-label="Delete selected module"
                            variant={'destructive'}
                            disabled={loading}
                            onClick={() => handleDelete(id as string)}
                        >
                            {loading && <Loader className="size-4 animate-spin" />}
                            {loading ? "Deleting" : "Confirm"}
                        </Button>
                        <Button
                            type='button'
                            variant={'outline'}
                            onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </DialogBox>
            )}
        </>
    );
}