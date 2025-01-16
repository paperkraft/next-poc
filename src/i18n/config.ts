export type Locale = (typeof locales)[number] | string;

export const locales = ['en', 'hi', 'mr'] as const;
export const defaultLocale: Locale = 'en';