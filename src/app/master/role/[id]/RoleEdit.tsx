"use client";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { InputController } from "@/components/custom/form.control/InputController";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import TitlePage from "@/components/custom/page-heading";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import {
  bitmask,
  calculateBitmask,
  reverseBitmask,
  roleFormSchema,
  RoleFormValues,
} from "../add/RoleForm";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import DialogBox from "@/components/custom/dialog-box";
import { toast } from "sonner";

type Role = {
  id: string;
  name: string;
  permissions: number;
};

type Bitmask = {
  name: string;
  bitmask: boolean;
};

export default function RoleEdit({ data }: { data: Role }) {
  const route = useRouter();
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermission] = useState<Bitmask[]>();
  const { id } = useParams();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      permissions: [
        { name: "VIEW", bitmask: false },
        { name: "EDIT", bitmask: false },
        { name: "CREATE", bitmask: false },
        { name: "DELETE", bitmask: false },
      ],
    },
  });

  useEffect(() => {
    setLoading(true);
    if (data) {
      const permission = reverseBitmask(data.permissions);
      form.setValue("name", data.name);
      form.setValue("permissions", permission);
      setPermission(permission);
      setLoading(false);
    }
  }, []);

  const onSubmit = async (data: RoleFormValues) => {
    const final = {
      name: data.name,
      permissions: calculateBitmask(data.permissions),
    };

    const res = await fetch(`/api/master/role/${id}`, {
      method: "PUT",
      body: JSON.stringify(final),
    });

    if (res.status === 200) {
      toast.success('Role updated');
      route.refresh();
    } else {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (id: string) => {
    
    const res = await fetch("/api/master/role", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    if (res.status === 200) {
      handleClose();
      toast.success('Role deleted');
      route.push('.');
    } else {
      toast.error('Failed to delete role');
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <>
      <div className="space-y-8 p-2">
        <TitlePage title="Role" description={show ? "Update role and permissions": "View role and permissions"}>
          <div className="flex gap-2">
            <Button
              className="size-7"
              variant={"outline"}
              size={"sm"}
              onClick={() => route.back()}
            >
              <ArrowLeft className="size-5" />
            </Button>
            {!show && (
              <>
                <Button
                  className="size-7"
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => setShow(true)}
                >
                  <Edit className="size-5" />
                </Button>
                <Button
                  className="size-7"
                  variant={"outline"}
                  size={"sm"}
                  onClick={()=> setOpen(true)}
                >
                  <Trash2 className="size-5 text-red-500" />
                </Button>
              </>
            )}
          </div>
        </TitlePage>

        {loading && <Loading />}

        {!show && permissions && (
          <div>
            <p>Role : '{data.name}'</p>
            <p>
              Permisssions :
              {permissions
                .filter((item) => item.bitmask === true)
                .map((item) => (
                  <span key={item.name} className="mx-2">
                    {item.name}
                  </span>
                ))}
            </p>
          </div>
        )}

        {show && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 p-2"
            >
              <InputController
                name="name"
                label="Role"
                placeholder="Enter role"
                description="This role will get added."
                reset
              />

              <div className="flex flex-col gap-2">
                <FormLabel>Permissions</FormLabel>
                <div className="grid md:grid-cols-4">
                  {bitmask.map((item, index) => (
                    <FormField
                      key={index}
                      name={`permissions.${index}.bitmask`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex items-center">
                          <FormLabel className="mr-2 mt-2">{item.name}</FormLabel>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end my-4 gap-2">
                <Button
                  variant={"outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    form.reset();
                  }}
                >
                  Reset
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        )}
      </div>

      { open && 
        <DialogBox open={open} title={"Delete Confirmation"} preventClose setClose={handleClose}>
          <h1>Are you sure? Do you want to delete role {data.name}</h1>
          <div className="flex justify-end">
            <Button onClick={()=>handleDelete(id as string)} variant={'destructive'}>Confirm</Button>
          </div>
        </DialogBox>
      }
    </>
  );
}
