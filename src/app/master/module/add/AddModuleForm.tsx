'use client';

import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FloatingInputController } from '@/components/_form-controls/floating-label/input-controller';
import { useRouter } from 'next/navigation';
import { RecursiveModuleForm } from '../[id]/RecursiveModules';
import { FloatingSelectController } from '@/components/_form-controls/floating-label/select-controller';
import { IOption } from '@/app/_Interface/Module';
import { toast } from 'sonner';

export interface ModuleFormData {
    name: string;
    path?: string;
    groupId?: string;
    children?: ModuleFormData[];
}

export default function AddModuleForm({ groups }: { groups: IOption[] }) {
    const methods = useForm<ModuleFormData>({
        defaultValues: {
            name: '',
            path: '',
            groupId: '',
            children: [],
        },
    });

    const router = useRouter();

    const onSubmit = async (data: ModuleFormData) => {

        console.log('Form data:', data);
        // Perform any necessary validation or transformation on the data here

        const res = await fetch('/api/master/module', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (res.ok) {
            toast.success('Module added successfully!');
            router.push('/master/module');
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FloatingSelectController
                        name="groupId"
                        label="Group ID"
                        options={groups ?? []}
                    />
                    <FloatingInputController
                        name="name"
                        label="Module Name"
                        type='text'
                    />
                    <FloatingInputController
                        name="path"
                        label="Path"
                        type='text'
                    />
                </div>

                <h4 className="text-muted-foreground font-medium mt-4">Submodules</h4>
                <p className="text-sm text-muted-foreground">Add submodules to this module.</p>

                <RecursiveModuleForm nestPath="children" />

                <Button type="submit">Save Module</Button>
            </form>
        </FormProvider>
    );
}