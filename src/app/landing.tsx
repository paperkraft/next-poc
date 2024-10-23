'use client';
import { Separator } from "@/components/ui/separator";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
    return (
        <main>
            <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear border-b">
                <div className="flex items-center gap-2 px-4">
                    Logo
                    <Separator orientation="vertical" className="mr-2 h-4" />
                </div>

                <div className="flex items-center gap-4 px-8">
                    <Link href={'/signin'}>Sign In</Link>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Link href={'/signup'}>Sign Up</Link>
                </div>
            </header>

            <div className="p-20 h-full bg-slate-50 grid grid-cols-2">

                <div className="p-10 h-full">
                    <div className="space-y-4">
                        <h1 className="text-2xl">All you need for managing your business online</h1>
                        <p className="text-wrap">
                            Run your entire business on _APP_ with our unified cloud software,<br />
                            seamlessly migrate their academic delivery and administration online by complementing their traditional practices.
                        </p>
                        <Image src={'/landing_01.png'} className="aspect-auto" alt="team" width={400} height={400} />
                    </div>
                </div>

                <div className="p-10 h-full bg-white border rounded">
                    <h1 className="py-4">App List</h1>

                    <Link href={'/signin'}>
                        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                                <h1 className="font-medium text-xl">ERP</h1>
                                <p className="text-xs">
                                    Automate your administrative operations to ensure paperless and hassle-free.
                                </p>
                            </div>
                            <ChevronRightIcon className="size-4" />
                        </div>
                    </Link>
                </div>

            </div>
        </main>
    );
}