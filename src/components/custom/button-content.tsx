'use client'

import { LoaderCircleIcon } from "lucide-react";

interface ButtonContentProps {
    status: boolean;
    text: string;
    loadingText?: string
}

export default function ButtonContent({ status, text, loadingText }: ButtonContentProps) {
    const getStatusText = (baseText: string) => {
        const words = baseText.split(' ');
        const transformedWords = words.map((word, index) => {
            if (index === 0) {
                if (word.endsWith('e')) {
                    return `${word.slice(0, -1)}ing`;
                } else if (/[^aeiou][aeiou][^aeiou]$/i.test(word)) {
                    return `${word}${word.slice(-1)}ing`;
                }
                return `${word}ing`;
            }
            return word;
        });
        return transformedWords.join(' ');
    };

    return (
        status
            ? <><LoaderCircleIcon className="size-4 animate-spin" />{loadingText ? loadingText : getStatusText(text)}</>
            : `${text}`
    );
}