'use client';
import AppLogo from "@/components/custom/app-initial";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle, BarChart, Users, Calendar, Mail } from "lucide-react"

export default function LandingPage() {

    return (
        <div className="flex min-h-screen flex-col">

            <header className="sticky w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">

                    <Link href="/">
                        <div className="flex items-center gap-2">
                            <AppLogo />
                            Demo App
                        </div>
                    </Link>

                    <nav className="hidden md:flex gap-6">
                        <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
                            Features
                        </Link>
                        <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
                            Testimonials
                        </Link>
                        <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
                            Pricing
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/signin">Log in</Link>
                        </Button>

                        <Button size="sm" asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </div>

                </div>
            </header>

            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 2xl:py-64">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Streamline Your Educational Institution Management
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        All-in-one ERP and CRM solution designed specifically for schools, colleges, and universities.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link href="/signup">
                                        <Button size="lg" className="w-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                    <Link href="#demo">
                                        <Button size="lg" variant="outline" className="w-full">
                                            Request Demo
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <Image
                                    src="/landing.png"
                                    width={550}
                                    height={550}
                                    alt="Hero Image"
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                                    Features
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything You Need in One Platform</h2>
                                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                                    Our comprehensive solution helps you manage every aspect of your educational institution.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
                            <Card>
                                <CardHeader>
                                    <Users className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Student Management</CardTitle>
                                    <CardDescription>
                                        Manage student records, admissions, attendance, and performance tracking.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <BookOpen className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Course Management</CardTitle>
                                    <CardDescription>Create and manage courses, curriculum, assignments, and grading.</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <BarChart className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Financial Management</CardTitle>
                                    <CardDescription>Handle fees, payments, expenses, and generate financial reports.</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Calendar className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Scheduling</CardTitle>
                                    <CardDescription>Manage timetables, events, and resource allocation efficiently.</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Mail className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Communication</CardTitle>
                                    <CardDescription>
                                        Built-in messaging, notifications, and parent-teacher communication.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CheckCircle className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Reporting & Analytics</CardTitle>
                                    <CardDescription>Generate insights with customizable reports and dashboards.</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>

                <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                                    Testimonials
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Trusted by Educational Leaders</h2>
                                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                                    See what our customers have to say about our platform.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Transformative Solution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        "SV Demo App has completely transformed how we manage our university. The administrative burden has
                                        been reduced significantly."
                                    </p>
                                </CardContent>
                                <CardFooter className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                                        <div>
                                            <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                                            <p className="text-xs text-muted-foreground">University Dean</p>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Improved Efficiency</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        "The reporting features have given us insights we never had before. We've been able to optimize our
                                        operations significantly."
                                    </p>
                                </CardContent>
                                <CardFooter className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                                        <div>
                                            <p className="text-sm font-medium">Michael Chen</p>
                                            <p className="text-xs text-muted-foreground">School Principal</p>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Better Communication</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        "Parents love the communication features. We've seen a dramatic improvement in parent engagement
                                        since implementing SV Demo App."
                                    </p>
                                </CardContent>
                                <CardFooter className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                                        <div>
                                            <p className="text-sm font-medium">Lisa Rodriguez</p>
                                            <p className="text-xs text-muted-foreground">IT Director</p>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                                    Pricing
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple, Transparent Pricing</h2>
                                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                                    Choose the plan that's right for your institution.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic</CardTitle>
                                    <div className="text-3xl font-bold">
                                        $499<span className="text-sm font-normal text-muted-foreground">/month</span>
                                    </div>
                                    <CardDescription>For small schools and institutions.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Up to 500 students</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Core modules included</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Email support</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Basic reporting</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">Get Started</Button>
                                </CardFooter>
                            </Card>
                            <Card className="border-primary">
                                <CardHeader>
                                    <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground mb-2">
                                        Popular
                                    </div>
                                    <CardTitle>Professional</CardTitle>
                                    <div className="text-3xl font-bold">
                                        $999<span className="text-sm font-normal text-muted-foreground">/month</span>
                                    </div>
                                    <CardDescription>For medium-sized institutions.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Up to 2,000 students</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>All modules included</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Priority support</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Advanced reporting</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>API access</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">Get Started</Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Enterprise</CardTitle>
                                    <div className="text-3xl font-bold">Custom</div>
                                    <CardDescription>For large universities and school districts.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Unlimited students</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>All modules included</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>24/7 dedicated support</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>Custom integrations</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span>On-premise option</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full">
                                        Contact Sales
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}