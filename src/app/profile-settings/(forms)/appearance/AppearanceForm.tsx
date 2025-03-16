"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormDescription, FormItem, Form, FormLabel } from "@/components/ui/form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { themeConfig } from "@/hooks/use-config"
import { layoutBlock, RenderBlocks, themeBlocks } from "./components/Blocks"
import React from "react"
import RenderColors from "./components/ColorBlocks"
import RenderRadius from "./components/RadiusBlocks"
import RenderFonts from "./components/FontsBlocks"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Monitor, Moon, Sun } from "lucide-react"
import LayoutBlock from "./components/layout-block"

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
  const { theme, setTheme: setMode } = useTheme();
  const t = useTranslations('setting');

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: "light",
      font: config.font,
      layout: config.layout as string,
      color: config.theme,
      radius: config.radius,
    }
  })

  function onSubmit(data: AppearanceFormValues) {
    toast.success("Appearance settings updated successfully.");
  }

  const mode = ["light", "dark", "system"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>{t('appearance.form.font')}</FormLabel>
          <FormDescription>{t('appearance.form.font_desc')}</FormDescription>
        </FormItem>
        <RenderFonts />

        <FormItem>
          <FormLabel>{t('appearance.form.theme')}</FormLabel>
          <FormDescription>{t('appearance.form.theme_desc')}</FormDescription>
        </FormItem>
        <div className="flex gap-4">
          {mode.map((item) => (
            <Button
              key={item}
              variant={"outline"}
              size="sm"
              type="button"
              onClick={() => setMode(item)}
              className={cn("w-[100px]", theme === item && "border-2 border-primary")}
            >
              {item === "light" && <Sun className="mr-1" />}
              {item === "dark" && <Moon className="mr-1" />}
              {item === "system" && <Monitor className="mr-1" />}
              {item}
            </Button>
          ))}

        </div>

        <FormItem>
          <FormLabel>{t('appearance.form.layout')}</FormLabel>
          <FormDescription>{t('appearance.form.layout_desc')}</FormDescription>
        </FormItem>
        <LayoutBlock />

        <FormItem>
          <FormLabel>{t('appearance.form.primary_color')}</FormLabel>
          <FormDescription>{t('appearance.form.primary_color_desc')}</FormDescription>
        </FormItem>
        <RenderColors />

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