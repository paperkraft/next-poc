"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
    FloatingInputController
} from '@/components/_form-controls/floating-label/input-controller';
import {
    FloatingSelectController
} from '@/components/_form-controls/floating-label/select-controller';
import {
    FloatingTextareaController
} from '@/components/_form-controls/floating-label/textarea-controller';
import { RadioButton } from '@/components/_form-controls/radio-button';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { availableTopics } from '@/constants';
import { useMounted } from '@/hooks/use-mounted';
import { ISendNotificationForm, SendNotificationFormSchema } from '@/types/notifications';
import { zodResolver } from '@hookform/resolvers/zod';

type FormProps = {
    users: { id: string; name: string }[];
};

export default function SendNotificationForm({ users }: FormProps) {

    const mounted = useMounted();
    const [loading, setLoading] = useState(false);

    const form = useForm<ISendNotificationForm>({
        resolver: zodResolver(SendNotificationFormSchema),
        defaultValues: {
            mode: "topics",
            title: "",
            message: "",
            topics: "",
            userId: ""
        }
    })

    const onSubmit = async (data: ISendNotificationForm) => {

        const { mode, ...rest } = data;

        const payload = mode === "topics"
            ? {
                mode,
                title: rest.title,
                message: rest.message,
                topics: [rest.topics],
            }
            : {
                mode,
                title: rest.title,
                message: rest.message,
                userId: rest.userId,
            }

        setLoading(true);

        try {
            const res = await fetch("/api/notifications/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result?.message || "Failed to send.");
            } else {
                toast.success(result.message);
            }
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
            form.reset();
            form.setValue("topics", "");
            form.setValue("userId", "");

        }
    }

    if (!mounted) return null;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-4">

                <RadioButton
                    name='mode'
                    label='Mode'
                    options={[
                        { label: "By Topics", value: "topics" },
                        { label: "To User", value: "user" },
                    ]}
                />

                <FloatingInputController
                    name='title'
                    label='Title'
                    reset
                />

                <FloatingTextareaController
                    name='message'
                    label='Message'
                />

                {form.watch('mode') === "topics" && (
                    <FloatingSelectController
                        name='topics'
                        label='Topics'
                        options={
                            availableTopics.map((item) => {
                                return {
                                    label: item.label,
                                    value: item.topic
                                }
                            })
                        }
                    />
                )}

                {form.watch('mode') === "user" && (
                    <FloatingSelectController
                        name='userId'
                        label='Users'
                        options={
                            users.map((item) => {
                                return {
                                    label: item.name,
                                    value: item.id
                                }
                            })
                        }
                    />
                )}

                <Button disabled={loading}>
                    {loading ? "Sending..." : "Send Notification"}
                </Button>
            </form>
        </Form>
    );
}