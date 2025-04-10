import fuzzysort from "fuzzysort";

export const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const result = fuzzysort.single(query, text);
    if (!result) return text;

    return result.target
        .split("")
        .map((char, i) =>
            result.indexes.includes(i) ? (
                <span key={i} className="font-bold text-primary">
                    {char}
                </span>
            ) : (
                char
            )
        );
};