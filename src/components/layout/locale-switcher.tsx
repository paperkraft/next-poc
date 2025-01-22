'use client'
import { useLocale, useTranslations } from 'next-intl';
import { setUserLocale } from '@/services/locale';
import { Locale } from '@/i18n/config';
import { CheckIcon, LanguagesIcon } from 'lucide-react';
import { themeConfig } from '@/hooks/use-config';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';

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
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} size={'icon'}><LanguagesIcon className="!size-[18px]" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {
                        items.map((item) => (
                            <DropdownMenuItem key={item.label} onClick={() => onChange(item.value)}>
                                {item.label}
                                <CheckIcon className={cn('size-4 opacity-0 ml-auto', { 'opacity-100': item.value === locale })} />
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}