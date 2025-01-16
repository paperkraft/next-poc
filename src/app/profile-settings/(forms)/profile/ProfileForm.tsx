"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
} from "@/components/ui/select"
import {  } from "@/components/ui/textarea"
import { toast } from "sonner"
import { InputController } from "@/components/custom/form.control/InputController"
import { TextareaController } from "@/components/custom/form.control/TextareaController"
import { SelectController } from "@/components/custom/form.control/SelectController"
import { useTranslations } from "next-intl"

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  bio: "I own a computer.",
  urls: [
    { value: "https://shadcn.com" },
    { value: "http://example.com" },
  ],
}

const emails = [
  {label:"m@example.com", value:"m@example.com"},
  {label:"m@google.com", value:"m@google.com"},
  {label:"m@support.com", value:"m@support.com"},
]

export function ProfileForm() {
  const t = useTranslations('setting');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
    name: "urls",
    control: form.control,
  })

  function onSubmit(data: ProfileFormValues) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[295px] md:w-[324px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <InputController
          name="username"
          label={t("profile.form.username")}
          description={t("profile.form.username_desc")}
        />

        <SelectController
          name="email"
          options={emails}
          label={t("profile.form.email")}
          description={t("profile.form.email_desc")}
          placeholder="Select a verified email to display"
        />
        
        <TextareaController
          name="bio"
          label={t("profile.form.bio")}
          description={t("profile.form.bio_desc")}
        />

        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                  {t("profile.form.urls")}
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                  {t("profile.form.urls_desc")}
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div>
        <Button type="submit">{t("profile.form.btn")}</Button>
      </form>
    </Form>
  )
}