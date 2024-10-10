"use client"
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { LoaderCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { InputController } from '@/components/custom/form.control/InputController'
import { signIn } from 'next-auth/react'
import { useMounted } from '@/hooks/use-mounted'
import Script from 'next/script'
import ToggleButtons from '@/components/custom/layout/ToggleButtons'
import { captchaSiteKey } from '@/utils/constant'

const signInSchema = z.object({
    email: z.string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
    password: z.string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .max(10, "Password must be less than 10 characters"),
});

type signInT = z.infer<typeof signInSchema>;

export default function SignInPage() {
    const mounted = useMounted();
    const [loading, setLoading] = useState(false);

    const form = useForm<signInT>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "vishal.sannake@akronsystems.com",
            password: "123123"
        },
    });

    const onSubmit = async (data: signInT) => {

        const token = await new Promise<string>((resolve) => {
            window.grecaptcha.execute(captchaSiteKey as string, { action: 'submit' }).then(resolve);
        });

        setLoading(true);

        try {
            const res = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,    
                token: token
            });

            if(res?.code === "credentials" || res?.error === "CredentialsSignin"){
                toast({
                    title: "Login Error",
                    description: "Invalid credentials",
                });
            }

            if (!res?.error) {
                window.location.href = '/dashboard'
            }
        } catch (error) {
            console.log("Error", error);
            toast({
                title: "Unexpected Error",
                description: "An error occurred while trying to log in.",
            });
        } finally {
            setLoading(false);
        }
    };
    
    const renderButtonContent = () => {
        if (loading) {
            return (
                <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/> Logging...
                </>
            );
        }
        return "Login";
    };

    return (
        mounted &&
        <>
            <Script
                src={`https://www.google.com/recaptcha/api.js?render=${captchaSiteKey}`}
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('reCAPTCHA script loaded successfully');
                }}
            />

            <Form {...form}>
                <form id='form_submit' onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
                        <p className="text-muted-foreground text-sm">Enter your email below to login to your account</p>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <InputController 
                                    name="email"
                                    label="Email"
                                    type='email'
                                />
                            </div>
                            <div className="grid gap-2">
                                <InputController 
                                    name="password"
                                    label="Password"
                                    type='password'
                                />
                            </div>
                            
                            {/* <ReCAPTCHA sitekey={siteKey} onChange={handleCaptchaChange} style={{width:"100%"}} className='[&_iframe]:w-full'/> */}

                            

                            <Button type="submit" className="w-full" disabled={loading}>
                                { renderButtonContent() }
                            </Button>
                            <Button variant="outline" type="button" className="w-full" onClick={(e) => {e.preventDefault(); signIn('github')}}>
                                Sign in with GitHub
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?&nbsp;
                            <Link href="/signup" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </form>
            </Form>

            <ToggleButtons/>
        </>
    )
}