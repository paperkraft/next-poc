'use client';
import { Form } from "@/components/ui/form";
import { InputController } from "@/components/custom/form.control/InputController";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import ButtonContent from "@/components/custom/button-content";

const groupSchema = z.object({
    name: z.string().trim().min(1, { message: "Enter group" }),
});

type FormValues = z.infer<typeof groupSchema>;

export default function GroupForm() {

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
            const res = await fetch('/api/master/group', {
                method: "POST",
                body: JSON.stringify(data)
            }).then((d) => d.json());
    
            if (res.success) {
                toast.success(res.message);
                router.push('.')
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
                    label="Name"
                    placeholder="Enter group"
                    description="This group will get added."
                    reset
                />

                <div className="flex justify-end gap-2">
                    <Button variant={"outline"} onClick={(e) => { e.preventDefault(); form.reset() }}>
                        Reset
                    </Button>
                    <Button type="submit" disabled={loading}>
                        <ButtonContent status={loading} text={"Create"}/>
                    </Button>
                </div>
            </form>
        </Form>
    );
}