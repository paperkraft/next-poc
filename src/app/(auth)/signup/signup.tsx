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
import OrganizationPage from "./organization";
import BiometricRegister from "./BiometricRegister";

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
    // mobile: z.string({ required_error: "Mobile No. is required" })
    //     .min(10, "Mobile No. is required")
    //     .max(10, "Mobile No. must be less than 10 characters"),
});

export type signUp = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
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
        
        // const res = await fetch('/api/user/signup', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data),
        // });

        setTimeout(()=>{
            setData(data)
            setLoading(false);
        },2000)

        
        // router.push('/organization');

        // if (res.ok) {
        //     toast({
        //         title:"Success",
        //         description: "Organization info",
        //     });
        //     router.push('/organization');
        // } else {
        //     const errorData = await res.json();
        //     toast({
        //         title:"Failed",
        //         description: errorData?.message || "Error creating account",
        //         variant:'destructive'
        //     });
        // }
    }

    const renderButtonContent = () => {
        if (loading) {
            return (
                <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/> Continue...
                </>
            );
        }
        return "Continue";
    };

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
                                    {renderButtonContent()}
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