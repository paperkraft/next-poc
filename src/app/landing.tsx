'use client';
import { Separator } from "@/components/ui/separator";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

//h-[calc(100vh-64px)]

export default function LandingPage() {
    return (
        <main>
            <header className="fixed flex justify-between shrink-0 items-center gap-2 h-16 w-screen border-b bg-background">
                <div className="flex items-center gap-2 px-4">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                       <span className="text-xs">WD</span>
                    </div>
                    Webdesk
                </div>

                <div className="flex items-center gap-2 px-4">
                    <Link href={'/signin'}>Sign In</Link>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Link href={'/signup'}>Sign Up</Link>
                </div>
            </header>

            <div className="p-20 pt-40 h-screen bg-slate-50 grid md:grid-cols-2">

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

                <div className="p-10 h-full bg-white border rounded-lg">
                    <h1 className="py-4">App List</h1>

                    <Link href={'/signin'}>
                        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                                <h1 className="font-medium text-lg">ERP</h1>
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