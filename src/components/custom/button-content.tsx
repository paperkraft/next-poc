'use client'

import { LoaderCircleIcon } from "lucide-react";

export default function ButtonContent({ status, text }: { status: boolean, text: string }) {
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
            ? <><LoaderCircleIcon className="size-4 animate-spin" />{getStatusText(text)}</>
            : `${text}`
    );
}