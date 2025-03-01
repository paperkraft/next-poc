'use client'
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { LoaderCircle } from "lucide-react";
import { InputController } from "@/components/_form-controls/InputController";
import { useMounted } from "@/hooks/use-mounted";
import OrganizationPage from "./organization";
import ButtonContent from "@/components/custom/button-content";

const signUpSchema = z.object({
    firstName: z.string({ required_error: "First Name is required" })
        .min(1, "First Name is required")
        .max(10, "First Name must be less than 10 characters"),
    lastName: z.string({ required_error: "Last Name is required" })
        .min(1, "Last Name is required")
        .max(20, "Last Name must be less than 20 characters"),
    email: z.string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: z.string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(6, "Password must be more than 6 characters")
        .max(20, "Password must be less than 20 characters"),
});

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
        setTimeout(()=>{
            setData(data)
            setLoading(false);
        },2000)
    }

    return (
        <>
            {    
                mounted && !data &&
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center py-10">
                        <div className="mx-auto grid w-[350px] gap-6">
                            <div className="grid gap-2">
                                <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
                                <p className="text-sm text-muted-foreground">Enter your information to create an account</p>
                            </div>

                            <div className="grid gap-2">
                                <div className="grid grid-cols-2 gap-2">
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
                                    <ButtonContent status={loading} text="Continue" loadingText="Continue..."/>
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
            }
            {
                data &&
                <OrganizationPage {...data} />
            }
        </>
    )
}