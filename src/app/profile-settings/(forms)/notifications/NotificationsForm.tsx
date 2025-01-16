"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { SwitchButton } from "@/components/custom/form.control/SwitchButton"

const notificationsFormSchema = z.object({
  communication_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  communication_emails: false,
  marketing_emails: false,
  security_emails: true,
}

export function NotificationsForm() {
  const t = useTranslations('setting');

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  })

  function onSubmit(data: NotificationsFormValues) {
    toast("You submitted the following values:",{
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
        <div>
          <h3 className="mb-4 text-lg font-medium">{t('notifications.form.email_notify')}</h3>
          <div className="space-y-4">
            <SwitchButton name="communication_emails" label={t('notifications.form.comm_email')} description={t('notifications.form.comm_email_desc')} />
            <SwitchButton name="marketing_emails" label={t('notifications.form.market_email')} description={t('notifications.form.market_email_desc')} />
            <SwitchButton name="security_emails" label={t('notifications.form.security_email')} description={t('notifications.form.security_email_desc')} />
          </div>
        </div>
        <Button type="submit">{t('notifications.form.btn')}</Button>
      </form>
    </Form>
  )
}