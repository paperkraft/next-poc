import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gallery",
    description: "Parallel Intercept",
};

export default function Page({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <>
            {children}
            {modal}
        </>
    );
}