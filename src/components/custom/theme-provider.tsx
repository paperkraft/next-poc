'use client'
import { createContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useMounted } from "@/hooks/use-mounted";

export type ThemeProps = {
    // setCurrentTheme: Dispatch<SetStateAction<string>>;
    toggleTheme: () => void;
    currentTheme: string;
}

export const ThemeContext = createContext<ThemeProps | null>(null);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTheme, setCurrentTheme] = useState('system');
    const isMounted = useMounted();

    const toggleTheme = () => {
        localStorage.setItem('theme', currentTheme === 'light' ? 'dark' : 'light');
        setCurrentTheme((prev) => prev === 'light' ? 'dark' : 'light');
    }

    useEffect(() => {
        const themeLocalStorage = localStorage.getItem('theme');
        if (themeLocalStorage) setCurrentTheme(themeLocalStorage);
    }, [isMounted]);

    return (
        
        <ThemeContext.Provider value={{ toggleTheme, currentTheme }}>
            <NextThemesProvider
                attribute="class"
                defaultTheme={"system"}
                enableSystem
                disableTransitionOnChange
            >   
                {
                    isMounted &&
                    <>
                        {children}
                        <ProgressBar
                            height="4px"
                            color="#fffd00"
                            options={{ showSpinner: false }}
                            shallowRouting
                        />
                    </>
                }
            </NextThemesProvider>
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;