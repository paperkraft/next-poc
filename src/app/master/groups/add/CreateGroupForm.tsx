'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { InputController } from '@/components/_form-controls/InputController';
import ButtonContent from '@/components/custom/button-content';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGroup } from '@/app/action/group.action';

const groupSchema = z.object({
    name: z.string().trim().min(1, { message: "Enter group" }),
});

type FormValues = z.infer<typeof groupSchema>;

export default function CreateGroupForm() {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: ""
        },
    });

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            const response = await fetch('/api/master/group', {
                method: "POST",
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                toast.error("Failed to create group");
            }

            const res = await response.json();

            if (res.success) {
                toast.success(res.message);
                router.push('.');
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create group. Please try again later.");
        } finally {
            router.refresh();
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-2">
                <InputController
                    name="name"
                    label="Group Name"
                    placeholder="Enter group name"
                    description="This group will be added to the system."
                    reset
                />

                <div className="flex justify-end gap-2">
                    <Button type="button" variant={"outline"} onClick={() => form.reset()} >
                        Reset
                    </Button>
                    <Button type="submit" disabled={loading}>
                        <ButtonContent status={loading} text={"Create"} />
                    </Button>
                </div>
            </form>
        </Form>
    );
}