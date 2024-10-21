'use client'
import { InputController } from "@/components/custom/form.control/InputController";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"

const formSchema = z.object({
    name: z.string(),
    firstName: z.string({ required_error: "First Name is required" })
        .min(1, "First Name is required"),
    lastName: z.string({ required_error: "Last Name is required" })
        .min(1, "Last Name is required"),
    username: z.string({ required_error: "Username is required" })
        .min(1, "Username is required")
        .min(6, "Username must be more than 6 characters")
        .max(8, "Username must be less than 8 characters"),
    email: z.string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
});

type formType = z.infer<typeof formSchema>;

export default function Profile() {
    const { data: session } = useSession();
    const user = session?.user;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name:"",
            firstName:"",
            lastName:"",
            username: "",
            email:"",
        }
    });

    useEffect(()=>{
        if(user){
            const fetchItem = async () => {
                const response = await fetch(`/api/user/id`,{
                    method:"POST",
                    body: JSON.stringify({id:user.id})
                });

                const data = await response.json();

                Object.entries(data).map(([key, val]:any) => {
                    if(val) form.setValue(key, val);
                })
            };
            fetchItem();
        }
    },[user]);

    const onSubmit = async (data: formType) => {
        const res = await fetch('/api/user/update', {
            method:"POST",
            body: JSON.stringify(data)
        })

        const result = await res.json();

        if(result.message === "Success"){
            toast({
                title: "Success",
                description: "Profile updated",
            });
        } else {
            toast({
                title: "Error",
                description: "Failed to update profile",
            });
        }
    }

    return(
        <>
            <TitlePage title={"Profile"} description={"This is how others will see you"}/>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-4 px-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputController
                                    name="firstName"
                                    label="First Name"
                                    placeholder="First Name"
                                    maxLength={10}
                                />

                                <InputController
                                    name="lastName"
                                    label="Last Name"
                                    placeholder="Last Name"
                                    maxLength={10}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputController
                                    name="username"
                                    label="Username"
                                    placeholder="Username"
                                    maxLength={8}
                                    minLength={6}
                                    disabled
                                />

                                <InputController        
                                    name="email"
                                    label="Email"
                                    placeholder="Email"
                                    type='email'
                                    maxLength={40}
                                    disabled
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit">Save</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}