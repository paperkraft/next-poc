"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { InputController } from "@/components/_form-controls/InputController"
import { DateController } from "@/components/_form-controls/DateController"
import { SelectController } from "@/components/_form-controls/SelectController"
import { Form } from "@/components/ui/form"
import { themeConfig } from "@/hooks/use-config"

import { useTranslations } from 'next-intl';
import { setUserLocale } from "@/services/locale"


const languages = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Marathi", value: "mr" },
]

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  dob: z.coerce.date({
    required_error: "A date of birth is required.",
  }),
  language: z.string({
    required_error: "Please select a language.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

const defaultValues: Partial<AccountFormValues> = {
  name: "Vishal Sannake",
  dob: new Date("08-08-2000")
}

export function AccountForm() {
  const t = useTranslations('setting');

  const [config, setConfig] = themeConfig();
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      ...defaultValues,
      language: config.lang
    }
  })

  function onSubmit(data: AccountFormValues) {
    toast.success("Account settings updated successfully.");

    setUserLocale(data.language);

    setConfig({
      ...config,
      lang: data.language,
      font: data.language === 'mr' || data.language === 'hi' ? 'font-noto-sans' : 'font-inter'
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InputController
          name="name"
          label={t("account.form.name")}
          description={t("account.form.name_desc")}
        />

        <DateController
          name="dob"
          label={t("account.form.dob")}
          description={t("account.form.dob_desc")}
          fromYear={2000}
          toYear={2024}
        />

        <SelectController
          name="language"
          label={t("account.form.lang")}
          description={t("account.form.lang_desc")}
          options={languages}
        />

        <Button type="submit">{t("account.form.btn")}</Button>
      </form>
    </Form>
  )
}