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
import { toast } from "@/hooks/use-toast";
import { InputController } from "@/components/custom/form.control/InputController";
import { useMounted } from "@/hooks/use-mounted";
import { signIn } from 'next-auth/react'
import Divider from "@/components/custom/divider";

const signUpSchema = z.object({
    username: z.string({ required_error: "Username is required" })
        .min(1, "Username is required")
        .min(6, "Username must be more than 6 characters")
        .max(8, "Username must be less than 8 characters"),
    email: z.string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: z.string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(6, "Password must be more than 6 characters")
        .max(20, "Password must be less than 20 characters"),
    // mobile: z.string({ required_error: "Mobile No. is required" })
    //     .min(10, "Mobile No. is required")
    //     .max(10, "Mobile No. must be less than 10 characters"),
});

type signUp = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
    const mounted = useMounted();
    const [loading, setLoading] = useState(false);

    const form = useForm<signUp>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
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
                variant:'destructive'
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
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
                        <p className="text-sm text-muted-foreground">Enter your information to create an account</p>
                    </div>

                    <div className="grid gap-2">
                        <InputController
                            name="username"
                            label="Username"
                            placeholder="Username"
                            maxLength={8}
                            minLength={6}
                        />

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
                            {renderButtonContent()}
                        </Button>

                        <Divider text='Or continue with' className='my-2'/>

                        <Button variant="outline" className="w-full" 
                            onClick={(e) => {
                                e.preventDefault();
                                signIn('github');
                            }}
                        >
                            Sign up with GitHub
                        </Button>
                    </div>

                    <div className="text-center text-sm">
                        Already have an account?&nbsp;
                        <Link href="/signin" className="underline">Sign in</Link>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">By clicking continue, you agree to our <br/>
                        <a className="underline underline-offset-4 hover:text-primary" href="#">Terms of Service</a> and&nbsp;
                        <a className="underline underline-offset-4 hover:text-primary" href="#">Privacy Policy</a>.
                    </p>
                </div>
            </form>
        </Form>
    )
}