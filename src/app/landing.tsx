'use client';
import { Separator } from "@/components/ui/separator";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";


const appList = [
    {
        url:'/signin',
        title:"ERP",
        desc:"Automate your administrative operations to ensure paperless and hassle-free"
    },
    {
        url:'/signin',
        title:"HR Payroll",
        desc:"Automate your administrative operations to ensure paperless and hassle-free"
    }
]

export default function LandingPage() {

    return (
        <React.Fragment>
            <header className="sticky top-0">
                <div className="flex shrink-0 items-center h-16 border-b bg-background px-4">

                    <div className="flex items-center gap-2 px-4">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                            <span className="text-xs">SV</span>
                        </div>
                        Demo App
                    </div>

                    <div className="flex items-center gap-2 px-4 ml-auto">
                        <Link href={'/signin'}>Sign In</Link>
                        <Separator orientation="vertical" className="mx-2 h-4" />
                        <Link href={'/signup'}>Sign Up</Link>
                    </div>

                </div>
            </header>
            <main className="bg-slate-50 dark:bg-sidebar-accent">
                <section className="h-[calc(100vh-64px)] py-20 overflow-y-auto">
                    <div className="flex flex-wrap lg:flex-nowrap mx-auto w-[90%] max-w-screen-md md:max-w-screen-xl">
                        <div className="py-8 lg:pr-20 w-full lg:w-[calc(100vw-390px)]">
                            <div className="space-y-8 text-center lg:text-left text-balance">
                                <h1 className="text-5xl leading-tight">All you need for managing your business online</h1>
                                <p className="text-wrap text-xl">
                                    Run your entire business on Demo App with our unified cloud software,
                                    seamlessly migrate their academic delivery and administration online by complementing their traditional practices.
                                </p>
                                <div className="flex justify-center">
                                    <Image src={'/landing_01.png'} className="aspect-auto" priority alt="team" width={500} height={300} />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-background border rounded-lg w-full lg:max-w-[390px] shadow-xl">
                            <h1 className="pb-4">App List</h1>
                            <div className="grid gap-3">
                                {
                                    appList.map((item)=>(
                                        <Link href={'/signin'} className="group" key={item.title}>
                                            <div className="flex gap-1 items-center justify-between rounded-lg p-4 border group-hover:border">
                                                <div className="space-y-0.5">
                                                    <h1 className="font-medium text-lg">{item.title}</h1>
                                                    <p className="text-sm text-balance">{item.desc}</p>
                                                </div>
                                                <span><ChevronRightIcon /></span>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>

                        </div>
                    </div>
                </section>
            </main>
        </React.Fragment>
    )
}