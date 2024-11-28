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
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import DialogBox from "@/components/custom/dialog-box";

const groupSchema = z.object({
    name: z.string().trim().min(1, { message: "Enter group" }),
});

type FormValues = z.infer<typeof groupSchema>;

export default function EditGroup({data}:{data:IGroup}) {
    const { id } = data
    const route = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: ""
        },
    });

    useEffect(() => {
        setLoading(true);
        if(data){
            form.setValue("name", data.name);
            setLoading(false);
        }
    },[])

    const onSubmit = async (data: FormValues) => {
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
    }

    const handleDelete = async (id: string) => {
    
        const res = await fetch("/api/master/group", {
          method: "DELETE",
          body: JSON.stringify({ id }),
        }).then((d)=>d.json())
    
        if (res.success) {
          handleClose();
          toast.success('Group deleted');
          route.push('.');
        } else {
          toast.error(res.message);
          handleClose();
        }
      };
    
      const handleClose = () => {
        setOpen(false);
      }

    return (
        <>
            <div className="space-y-8 p-2">
                <TitlePage title="Group" description={show ? "Update group": "View group"}>
                    <div className="flex gap-2">
                        <Button className="size-7" variant={"outline"} size={"sm"} onClick={() => route.back()}>
                            <ArrowLeft className="size-5" />
                        </Button>
                        {!show && (
                            <>
                                <Button className="size-7" variant={"outline"} size={"sm"} onClick={() => setShow(true)}>
                                    <Edit className="size-5" />
                                </Button>
                                <Button className="size-7" variant={"outline"} size={"sm"} onClick={()=> setOpen(true)}>
                                    <Trash2 className="size-5 text-red-500" />
                                </Button>
                            </>
                        )}
                    </div>
                </TitlePage>

                {loading && <Loading />}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-2">
                        <InputController
                            name="name"
                            label="Group"
                            placeholder="Enter group"
                            description="This group will get updated."
                            reset
                        />
                        {
                            show &&
                            <div className="flex justify-end my-4 gap-2">
                                <Button variant={"outline"} onClick={(e) => { e.preventDefault(); form.reset() }}>
                                    Reset
                                </Button>
                                <Button type="submit">Submit</Button>
                            </div>
                        }
                    </form>
                </Form>
            </div>

            { open && 
                <DialogBox open={open} title={"Delete Confirmation"} preventClose setClose={handleClose}>
                    <h1>Are you sure? Do you want to delete group : {data.name}</h1>
                    <div className="flex justify-end">
                        <Button onClick={()=>handleDelete(id as string)} variant={'destructive'}>Confirm</Button>
                    </div>
                </DialogBox>
            }
        </>
    );
}