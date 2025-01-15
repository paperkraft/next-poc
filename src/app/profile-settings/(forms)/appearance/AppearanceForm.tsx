"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormDescription, FormItem, Form, FormLabel } from "@/components/ui/form"
import { toast } from "sonner"
import { Button} from "@/components/ui/button"
import { themeConfig } from "@/hooks/use-config"
import { layoutBlock, RenderBlocks, themeBlocks } from "./components/Blocks"
import React from "react"
import RenderColors from "./components/ColorBlocks"
import RenderRadius from "./components/RadiusBlocks"
import RenderFonts from "./components/FontsBlocks"
import { useClientTranslation } from "@/i18n/client"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme.",
  }),
  font: z.string(),
  layout: z.string(),
  color: z.string(),
  radius: z.number(),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceForm() {
    const [config] = themeConfig();
    const {t} = useClientTranslation('setting');

    const form = useForm<AppearanceFormValues>({
        resolver: zodResolver(appearanceFormSchema),
        defaultValues:{
          theme:"light",
          font: config.font,
          layout: config.layout,
          color: config.theme,
          radius: config.radius,
        }
    })

    function onSubmit(data: AppearanceFormValues) {
      toast("You submitted the following values:",{
        description: (
          <pre className="mt-2 w-[295px] md:w-[324px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormItem>
          <FormLabel>{t('appearance.form.font')}</FormLabel>
          <FormDescription>{t('appearance.form.font_desc')}</FormDescription>
        </FormItem>
        <RenderFonts/>

        <FormItem>
          <FormLabel>{t('appearance.form.theme')}</FormLabel>
          <FormDescription>{t('appearance.form.theme_desc')}</FormDescription>
        </FormItem>
        <RenderBlocks context={config.mode} component={themeBlocks} type={'theme'}/>

        <FormItem>
          <FormLabel>{t('appearance.form.layout')}</FormLabel>
          <FormDescription>{t('appearance.form.layout_desc')}</FormDescription>
        </FormItem>
        <RenderBlocks context={config.layout} component={layoutBlock} type={'layout'}/>

        <FormItem>
          <FormLabel>{t('appearance.form.primary_color')}</FormLabel>
          <FormDescription>{t('appearance.form.primary_color_desc')}</FormDescription>
        </FormItem>
        <RenderColors/>

        <FormItem>
          <FormLabel>{t('appearance.form.radius')}</FormLabel>
          <FormDescription>{t('appearance.form.radius_desc')}</FormDescription>
        </FormItem>
        <RenderRadius />

        <Button type="submit">{t('appearance.form.btn')}</Button>
      </form>
    </Form>
  )
}