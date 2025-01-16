"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { InputController } from "@/components/custom/form.control/InputController"
import { TextareaController } from "@/components/custom/form.control/TextareaController"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

const profileFormSchema = z.object({
  firstName: z.string({ required_error: "First Name is required" })
    .min(1, "First Name is required"),
  lastName: z.string({ required_error: "Last Name is required" })
    .min(1, "Last Name is required"),
  username: z
    .string().min(3, {
      message: "Username must be at least 3 characters.",
    }).max(10, {
      message: "Username must not be longer than 10 characters.",
    }),
  email: z.string({
    required_error: "Please enter email.",
  }).email("Invalid email"),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  username: "",
}

export function ProfileForm() {
  const t = useTranslations('setting');

  const { data: session } = useSession();
  const user = session?.user;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      const fetchItem = async () => {
        const response = await fetch(`/api/user/id`, {
          method: "POST",
          body: JSON.stringify({ id: user.id })
        });

        const data = await response.json();

        Object.entries(data).map(([key, val]: any) => {
          if (val) form.setValue(key, val);
        })
      };
      fetchItem();
    }
  }, [user]);

  async function onSubmit(data: ProfileFormValues) {
    const res = await fetch('/api/user/update', {
      method: "POST",
      body: JSON.stringify(data)
    })

    const result = await res.json();
    if (result.success) {
      toast.success("Profile updated");
    } else {
      toast.error("Failed to update profile");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputController
            name="firstName"
            label={t("profile.form.firstName")}
            description={t("profile.form.firstName_desc")}
          />

          <InputController
            name="lastName"
            label={t("profile.form.lastName")}
            description={t("profile.form.lastName_desc")}
          />
        </div>

        <InputController
          name="username"
          label={t("profile.form.username")}
          description={t("profile.form.username_desc")}
        />

        <InputController
          name="email"
          label={t("profile.form.email")}
          description={t("profile.form.email_desc")}
        />

        <Button type="submit">{t("profile.form.btn")}</Button>
      </form>
    </Form>
  )
}