'use client'
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { useForm } from 'react-hook-form'
import { InputController } from "@/components/_form-controls/InputController";
import { useMounted } from "@/hooks/use-mounted";
import OrganizationPage from "./organization";
import ButtonContent from "@/components/custom/button-content";
import { signUpSchema } from "@/lib/zod";

export type signUp = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const mounted = useMounted();
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState<signUp>()

    const form = useForm<signUp>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
    });

    const onSubmit = async (data: signUp) => {
        setLoading(true);
        setTimeout(() => {
            setData(data)
            setLoading(false);
        }, 2000)
    }

    if (!mounted) return null;

    return (
        <>
            {
                data ? (
                    <OrganizationPage {...data} />
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center py-10">
                            <div className="mx-auto w-[350px] space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
                                    <p className="text-sm text-muted-foreground">Enter your information to create an account</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <InputController
                                            name="firstName"
                                            label="First Name"
                                            placeholder="First Name"
                                            maxLength={10}
                                        />

                                        <InputController
                                            name="lastName"
                                            label="Last Name"
                                            placeholder="Last Name"
                                            maxLength={20}
                                        />
                                    </div>

                                    <InputController
                                        name="email"
                                        label="Email"
                                        placeholder="Email"
                                        type='email'
                                        maxLength={40}
                                    />

                                    <InputController
                                        name="password"
                                        label="Password"
                                        placeholder="Password"
                                        type='password'
                                    />

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        <ButtonContent status={loading} text="Continue" loadingText="Continue..." />
                                    </Button>

                                </div>

                                <div className="text-center text-sm">
                                    Already have an account?&nbsp;
                                    <Link href="/signin" className="underline">Sign in</Link>
                                </div>

                                <p className="text-center text-sm text-muted-foreground">
                                    <a className="underline underline-offset-4 hover:text-primary" href="#">Terms of Service</a> and&nbsp;
                                    <a className="underline underline-offset-4 hover:text-primary" href="#">Privacy Policy</a>.
                                </p>
                            </div>
                        </form>
                    </Form>
                )
            }
        </>
    )
}