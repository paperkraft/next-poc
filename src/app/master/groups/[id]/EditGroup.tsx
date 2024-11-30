'use client';
import { Form } from "@/components/ui/form";
import { InputController } from "@/components/custom/form.control/InputController";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import TitlePage from "@/components/custom/page-heading";
import { toast } from "sonner";
import { IGroup } from "../page";
import { useState } from "react";
import Loading from "@/app/loading";
import { Edit, Trash2 } from "lucide-react";
import DialogBox from "@/components/custom/dialog-box";
import useModuleIdByName from "@/hooks/use-module-id";
import { Guard } from "@/components/custom/permission-guard";

const groupSchema = z.object({
    name: z.string().trim().min(1, { message: "Enter group" }),
});

type FormValues = z.infer<typeof groupSchema>;

export default function EditGroup({ data }: { data: IGroup }) {
    const { id } = data
    const route = useRouter();
    const moduleId = useModuleIdByName("Groups") as string;

    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: data.name || ""
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            const res = await fetch(`/api/master/group/${id}`, {
                method: "PUT",
                body: JSON.stringify(data)
            }).then((d) => d.json());
    
            if (res.success) {
                toast.success(res.message);
                route.push('.')
            } else {
                toast.error(res.message);
            }
            
        } catch (error) {
            console.error(error);
            toast.error("Failed to update group. Please try again later.");
        }
    }

    const handleDelete = async (id: string) => {

        try {
            const res = await fetch("/api/master/group", {
                method: "DELETE",
                body: JSON.stringify({ id }),
            }).then((d) => d.json())
    
            if (res.success) {
                handleClose();
                toast.success('Group deleted');
                route.push('.');
            } else {
                toast.error(res.message);
                handleClose();
            }
        } catch (error) {
            toast.error("Failed to delete group. Please try again later.");
            handleClose();
            console.error(error);
        }
    };

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <div className="space-y-4 p-2">
                <TitlePage title="Group" description={show ? "Update group" : "View group"} viewPage>
                    {!show && (
                        <>
                            <Guard permissionBit={2} moduleId={moduleId}>
                                <Button className="size-7" variant={"outline"} size={"sm"} onClick={() => setShow(true)}>
                                    <Edit className="size-5" />
                                </Button>
                            </Guard>
                            <Guard permissionBit={8} moduleId={moduleId}>
                                <Button className="size-7" variant={"outline"} size={"sm"} onClick={() => setOpen(true)}>
                                    <Trash2 className="size-5 text-red-500" />
                                </Button>
                            </Guard>
                        </>
                    )}
                </TitlePage>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-2">
                        <InputController
                            name="name"
                            label="Group"
                            placeholder="Enter group"
                            description="This group will get updated."
                            reset
                        />
                        {show && (
                            <div className="flex justify-end my-4 gap-2">
                                <Button variant={"outline"} onClick={(e) => { e.preventDefault(); form.reset() }}>
                                    Reset
                                </Button>
                                <Button type="submit">Submit</Button>
                            </div>
                        )}
                    </form>
                </Form>
            </div>

            {open && (
                <DialogBox open={open} title={"Delete Confirmation"} preventClose setClose={handleClose}>
                    <h1>Are you sure? Do you want to delete group : {data.name}</h1>
                    <div className="flex justify-end">
                        <Button onClick={() => handleDelete(id as string)} variant={'destructive'}>Confirm</Button>
                    </div>
                </DialogBox>
            )}
        </>
    );
}