'use client';
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { InputController } from "@/components/custom/form.control/InputController";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import TitlePage from "@/components/custom/page-heading";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const groupSchema = z.object({
    name: z.string().trim().min(1, { message: "Enter group" }),
});

type FormValues = z.infer<typeof groupSchema>;

export default function GroupForm() {

    const route = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: ""
        },
    });

    const onSubmit = async (data: FormValues) => {
        const res = await fetch('/api/master/group', {
            method: "POST",
            body: JSON.stringify(data)
        }).then((d) => d.json());

        if (res.success) {
            toast.success(res.message);
            route.push('.')
        } else {
            toast.error(res.message);
        }
    }

    return (
        <div className="space-y-8 p-2">
            <TitlePage title="Create Group" description="Define a new group">
                <div>
                    <Button className="size-7" variant={"outline"} size={"sm"} onClick={() => route.back()}>
                        <ArrowLeft className="size-5" />
                    </Button>
                </div>
            </TitlePage>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-2">
                    <InputController
                        name="name"
                        label="Group"
                        placeholder="Enter group"
                        description="This group will get added."
                        reset
                    />

                    <div className="flex justify-end my-4 gap-2">
                        <Button variant={"outline"} onClick={(e) => { e.preventDefault(); form.reset() }}>
                            Reset
                        </Button>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}