'use client'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { createContext, useEffect, useState } from 'react';

import { ThemeWrapper } from '@/components/layout/theme-wrapper';
import { useMounted } from '@/hooks/use-mounted';

export type ThemeProps = {
    toggleTheme: () => void;
    currentTheme: string;
}

export const ThemeContext = createContext<ThemeProps | null>(null);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const isMounted = useMounted();
    
    const [currentTheme, setCurrentTheme] = useState('system');

    const toggleTheme = () => {
        localStorage.setItem('theme', currentTheme === 'light' ? 'dark' : 'light');
        setCurrentTheme((prev) => prev === 'light' ? 'dark' : 'light');
    }

    useEffect(() => {
        const themeLocalStorage = localStorage.getItem('theme');
        if (themeLocalStorage) setCurrentTheme(themeLocalStorage);
    }, [isMounted]);

    if (!isMounted) return null;

    return (

        <ThemeContext.Provider value={{ toggleTheme, currentTheme }}>
            <ThemeWrapper>
                <NextThemesProvider
                    attribute="class"
                    defaultTheme={"system"}
                    enableSystem
                    disableTransitionOnChange
                >
                    <>
                        {isMounted && children}
                        <ProgressBar
                            height="4px"
                            color="rgb(26 139 244)"
                            options={{ showSpinner: false }}
                            shallowRouting
                        />
                    </>
                </NextThemesProvider>
            </ThemeWrapper>
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;