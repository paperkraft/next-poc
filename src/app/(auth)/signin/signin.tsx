"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMounted } from "@/hooks/use-mounted";
import { signIn } from "next-auth/react";
import { InputController } from "@/components/_form-controls/InputController";
import { toast } from "sonner";
import { getRecaptchaToken } from "@/app/action/auth.action";
import { signInSchema } from "@/lib/zod";
import Divider from "@/components/custom/divider";
import ButtonContent from "@/components/custom/button-content";

type signInT = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const mounted = useMounted();
  const [loading, setLoading] = useState(false);

  const form = useForm<signInT>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: signInT) => {
    setLoading(true);
    const token = await getRecaptchaToken();

    if (!token) {
      toast.error("reCAPTCHA validation failed.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token }),
      }).then((res) => res.json());

      if (response.success) {
        window.location.href = "/dashboard";
      }

      if (response.type === "CredentialsSignin" || response.code === "credentials") {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Form {...form}>
        <form id="form_submit" onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center py-12 p-4">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
              <p className="text-muted-foreground text-sm">
                Enter your email below to Sign in to your account
              </p>
            </div>
            <div className="grid gap-2">
              <InputController name="email" label="Email" type="email" />
              <InputController name="password" label="Password" type="password" />

              <Button type="submit" className="w-full" disabled={loading}>
                <ButtonContent status={loading} text="Signin" loadingText="Signing..." />
              </Button>

              <Divider text="Or continue with" className="my-4" />

              <Button variant="outline" type="button" className="w-full" onClick={(e) => { e.preventDefault(); signIn("github") }}>
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
  );
}
