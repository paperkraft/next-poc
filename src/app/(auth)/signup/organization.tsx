'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { InputController } from "@/components/_form-controls/InputController";
import { useMounted } from "@/hooks/use-mounted";
import { signUp } from "./signup";
import { toast } from "sonner";
import ButtonContent from "@/components/custom/button-content";
import { OrganizationSchema } from "@/lib/zod";
import { FloatingInputController } from "@/components/_form-controls/floating-label/input-controller";

type orgType = z.infer<typeof OrganizationSchema>;

export default function OrganizationPage(signupData: signUp) {
    const router = useRouter();
    const mounted = useMounted();
    const [loading, setLoading] = useState(false);

    const form = useForm<orgType>({
        resolver: zodResolver(OrganizationSchema),
        defaultValues: {
            organization: "",
            state: "",
            city: "",
        },
    });

    const onSubmit = async (data: orgType) => {
        setLoading(true);
        const final = { ...signupData, ...data }
        try {
            const res = await fetch('/api/user/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(final),
            }).then((d) => d.json());

            if (res.success) {
                setLoading(false);
                toast.success("Please sign in");
                router.push('/signin');
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error('sign-up', error)
            toast.error('Error creating account');
        } finally {
            setLoading(false);
        }
    }

    if(!mounted) return null;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center">
                <div className="mx-auto w-[350px] space-y-4">

                    <div className="space-y-2">
                        <h1 className="text-xl font-semibold tracking-tight">Lets get started</h1>
                        <p className="text-sm text-muted-foreground">Enter your organization information</p>
                    </div>

                    <div className="space-y-5">
                        <FloatingInputController
                            name="organization"
                            label="Organization Name"
                            maxLength={40}
                        />

                        <FloatingInputController
                            name="state"
                            label="State"
                            maxLength={20}
                        />

                        <FloatingInputController
                            name="city"
                            label="City"
                            maxLength={20}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            <ButtonContent status={loading} text="Create" loadingText="Creating..."/>
                        </Button>

                    </div>

                    <p className="text-center text-sm text-muted-foreground">I accept the&nbsp;
                        <a className="underline underline-offset-4 hover:text-primary" href="#">Terms of Service</a> and&nbsp;
                        I'm authorized to accept for my organization
                    </p>
                </div>
            </form>
        </Form>
    )
}