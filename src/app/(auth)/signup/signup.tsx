'use client'
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { LoaderCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { InputController } from "@/components/custom/form.control/InputController";
import { useMounted } from "@/hooks/use-mounted";

const signUpSchema = z.object({
    firstName: z.string({ required_error: "First name is required" })
        .min(1, "First name is required"),
    lastName: z.string({ required_error: "Last name is required" })
        .min(1, "Last name is required"),
    email: z.string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: z.string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(6, "Password must be more than 6 characters")
        .max(20, "Password must be less than 20 characters"),
    mobile: z.string({ required_error: "Mobile No. is required" })
        .min(10, "Mobile No. is required")
        .max(10, "Mobile No. must be less than 10 characters"),
});

type signUp = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
    const mounted = useMounted();
    const [loading, setLoading] = useState(false);

    const form = useForm<signUp>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            mobile: "",
            email: "",
            password: ""
        },
    });

    const onSubmit = async (data: signUp) => {
        setLoading(true);
        
        const res = await fetch('/api/user/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        
        setLoading(false);

        if (res.ok) {
            toast({
                title:"Success",
                description: "Please sign in",
            });
            router.push('/signin');
        } else {
            const errorData = await res.json();
            toast({
                title:"Failed",
                description: errorData?.message || "Error creating account",
            });
        }
    }

    const renderButtonContent = () => {
        if (loading) {
            return (
                <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/> Creating...
                </>
            );
        }
        return "Create an account";
    };

    return (
        mounted &&
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center py-10">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
                        <p className="text-sm text-muted-foreground">Enter your information to create an account</p>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <InputController
                                        name="firstName"
                                        label="First Name"
                                        placeholder="First Name"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <InputController
                                        name="lastName"
                                        label="Last Name"
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <InputController
                                    name="mobile"
                                    label="Mobile No."
                                    placeholder="Mobile No."
                                    type="number"
                                    maxLength={10}
                                />
                            </div>
                            <div className="grid gap-2">
                                <InputController
                                    name="email"
                                    label="Email"
                                    placeholder="Email"
                                    type='email'
                                    maxLength={30}
                                />
                            </div>
                            <div className="grid gap-2">
                                <InputController
                                    name="password"
                                    label="Password"
                                    placeholder="Password"
                                    type='password'
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {renderButtonContent()}
                            </Button>
                            <Button variant="outline" className="w-full">
                                Sign up with GitHub
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?&nbsp;
                            <Link href="/signin" className="underline">
                                Sign in
                            </Link>
                        </div>
                    </div>

                    <p className="px-4 text-center text-sm text-muted-foreground">By clicking continue, you agree to our <br/>
                        <a className="underline underline-offset-4 hover:text-primary" href="#">Terms of Service</a> and&nbsp;
                        <a className="underline underline-offset-4 hover:text-primary" href="#">Privacy Policy</a>.
                    </p>
                </div>
            </form>
        </Form>
    )
}