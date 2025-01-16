'use client'
import { useLocale, useTranslations } from 'next-intl';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { setUserLocale } from '@/services/locale';
import { Locale } from '@/i18n/config';
import { LanguagesIcon } from 'lucide-react';
import { themeConfig } from '@/hooks/use-config';

export default function LocaleSwitcher() {
    const t = useTranslations('LocaleSwitcher');
    const locale = useLocale();
    const [config, setConfig] = themeConfig();

    const items = [
        {
            value: 'en',
            label: t('en')
        },
        {
            value: 'hi',
            label: t('hi')
        },
        {
            value: 'mr',
            label: t('mr')
        }
    ]

    function onChange(value: string) {
        const locale = value as Locale;
        setUserLocale(locale);

        setConfig({
            ...config,
            lang: locale,
            font: locale === 'mr' || locale === 'hi' ? 'font-noto-sans' : 'font-inter'
        })
    }

    return (
        <div className="relative">
            <Select defaultValue={locale} onValueChange={onChange}>
                <SelectTrigger className="w-[120px]">
                    <LanguagesIcon className="size-4" />
                    <SelectValue placeholder={t('label')} />
                </SelectTrigger>
                <SelectContent>
                    {items.map((item, index) => (
                        <SelectItem key={index} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}