"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMounted } from "@/hooks/use-mounted";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { getRecaptchaToken } from "@/app/action/auth.action";
import { signInSchema } from "@/lib/zod";
import Divider from "@/components/custom/divider";
import ButtonContent from "@/components/custom/button-content";
import { FloatingInputController } from "@/components/_form-controls/floating-label/input-controller";
import ToggleButtons from "@/components/layout/ToggleButtons";

type signInT = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  
  const mounted = useMounted();

  const form = useForm<signInT>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check if there's a callbackUrl in the query string
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const callback = urlParams.get("callbackUrl");
    if (callback) {
      setCallbackUrl(decodeURIComponent(callback));
    }
  }, []);

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
        // Redirect to the callbackUrl if it exists, otherwise redirect to the dashboard
        window.location.href = callbackUrl || "/dashboard";
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
        <form id="form_submit" onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center">
          <div className="mx-auto w-[350px] space-y-4">

            <div className="space-y-2 mb-6">
              <h1 className="text-xl font-semibold tracking-tight">Sign In</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to Sign in to your account
              </p>
            </div>

            <div className="space-y-5">
              <FloatingInputController name="email" label="Email" type="email" />
              <FloatingInputController name="password" label="Password" type="password" />

              <Button type="submit" className="w-full" disabled={loading}>
                <ButtonContent status={loading} text="Signin" loadingText="Signing..." />
              </Button>

              <Divider text="Or continue with" />

              <Button variant="outline" type="button" className="w-full" onClick={(e) => { e.preventDefault(); signIn("github") }}>
                Sign in with GitHub
              </Button>
            </div>

            <div className="text-center text-sm">
              Don&apos;t have an account?&nbsp;
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </Form>

      <ToggleButtons className="mt-8" />
    </>
  );
}
