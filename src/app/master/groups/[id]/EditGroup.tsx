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
import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import DialogBox from "@/components/custom/dialog-box";
import useModuleIdByName from "@/hooks/use-module-id";
import { Guard } from "@/components/custom/permission-guard";
import { IGroup } from "@/app/_Interface/Group";
import ButtonContent from "@/components/custom/button-content";

const groupSchema = z.object({
    name: z.string().trim().min(1, { message: "Enter group" }),
});

type FormValues = z.infer<typeof groupSchema>;

export default function EditGroup({ id }: { id: string }) {
    const router = useRouter();
    const moduleId = useModuleIdByName("Groups") as string;

    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IGroup>();

    const form = useForm<FormValues>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: data?.name || ""
        },
    });

    useEffect(() => {
        const fetchData = async (id: string) => {
            try {
                const res = await fetch(`/api/master/group/${id}`).then((d) => d.json());
                const data = res.data
                if (res.success && data) {
                    setData(data);
                    form.setValue("name", data.name);
                } else {
                    toast.error(res.message)
                }
            } catch (error) {
                console.error("Failed to fetch data", error)
                toast.error("Something went wrong. Please try again later.");
            }
        }
        fetchData(id)
    }, [id]);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/master/group/${id}`, {
                method: "PUT",
                body: JSON.stringify(data)
            }).then((d) => d.json());

            if (res.success) {
                toast.success(res.message);
                router.push('.');
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update group. Please try again later.");
        } finally {
            router.refresh();
            setLoading(false);
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
                router.push('.');
            } else {
                toast.error(res.message);
                handleClose();
            }
        } catch (error) {
            toast.error("Failed to delete group. Please try again later.");
            console.error(error);
        } finally {
            handleClose();
            router.refresh();
        }
    };

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <div className="space-y-4 p-2">
                <TitlePage title="Group" description={show ? "Modifcation" : "Overview"} viewPage>
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-2">
                        <InputController
                            name="name"
                            label="Name"
                            placeholder="Enter group"
                            description={show ? "This change will get updated" : "To update click pencil button above right corner"}
                            reset={show}
                            readOnly={!show}
                        />
                        {show && (
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant={"outline"} onClick={() => router.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    <ButtonContent status={loading} text={"Update"}/>
                                </Button>
                            </div>
                        )}
                    </form>
                </Form>
            </div>

            {open && (
                <DialogBox open={open} title={"Delete Confirmation"} preventClose setClose={handleClose}>
                    <h1>Are you sure? Do you want to delete group : {data?.name}</h1>
                    <div className="flex justify-end">
                        <Button onClick={() => handleDelete(id)} variant={'destructive'}>Confirm</Button>
                    </div>
                </DialogBox>
            )}
        </>
    );
}