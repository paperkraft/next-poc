"use client";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoaderCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMounted } from "@/hooks/use-mounted";
import { signIn } from "next-auth/react";
import { RECAPTCHA_SITE_KEY } from "@/utils/constants";
import { InputController } from "@/components/custom/form.control/InputController";
import Divider from "@/components/custom/divider";

const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
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
      password: "123123",
    },
  });

  const onSubmit = async (data: signInT) => {
    setLoading(true);

    // get captch
    const token = await new Promise<string>((resolve) => {
      window.grecaptcha
        .execute(RECAPTCHA_SITE_KEY as string, { action: "submit" })
        .then(resolve);
    });

    // get user
    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, token }),
    }).then((res) => {
      setLoading(false);
      return res.json();
    });

    if (
      response.type === "CredentialsSignin" ||
      response.code === "credentials"
    ) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  const renderButtonContent = () => {
    if (loading) {
      return (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Signing...
        </>
      );
    }
    return "Signin";
  };

  return (
    mounted && (
      <>
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
          onLoad={() => {
            console.log("reCAPTCHA script loaded successfully");
          }}
        />

        <Form {...form}>
          <form
            id="form_submit"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center justify-center py-12 p-4"
          >
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Sign in
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email below to Sign in to your account
                </p>
              </div>
              <div className="grid gap-2">
                <InputController name="email" label="Email" type="email" />
                <InputController
                  name="password"
                  label="Password"
                  type="password"
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {renderButtonContent()}
                </Button>

                <Divider text="Or continue with" className="my-4" />

                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    signIn("github");
                  }}
                >
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
      </>
    )
  );
}
