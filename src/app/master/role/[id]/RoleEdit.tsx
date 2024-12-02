"use client";
import { Form, FormLabel } from "@/components/ui/form";
import { InputController } from "@/components/custom/form.control/InputController";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import TitlePage from "@/components/custom/page-heading";
import { Edit, Trash2 } from "lucide-react";
import {
  bitmask,
  calculateBitmask,
  reverseBitmask,
  roleFormSchema,
  RoleFormValues,
} from "../add/RoleForm";
import { useState } from "react";
import DialogBox from "@/components/custom/dialog-box";
import { toast } from "sonner";
import useModuleIdByName from "@/hooks/use-module-id";
import { Guard } from "@/components/custom/permission-guard";
import { SwitchButton } from "@/components/custom/form.control/SwitchButton";
import ButtonContent from "@/components/custom/button-content";

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
  const { id } = data
  const router = useRouter();
  const moduleId = useModuleIdByName("Role") as string;

  const permissions = reverseBitmask(data.permissions);

  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: data.name || "",
      permissions: permissions
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    const final = {
      name: data.name,
      permissions: calculateBitmask(data.permissions),
    };
    setLoading(true);
    try {
      const res = await fetch(`/api/master/role/${id}`, {
        method: "PUT",
        body: JSON.stringify(final),
      }).then((d) => d.json());

      if (res.success) {
        toast.success('Role updated');
        router.push('.');
      } else {
        toast.error('Failed to update role');
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role. Please try again later.");
    } finally {
      router.refresh();
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/master/role", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (res.status === 200) {
        handleClose();
        toast.success('Role deleted');
        router.replace('.');
      } else {
        toast.error('Failed to delete role');
        handleClose();
      }
    } catch (error) {
      toast.error("Failed to delete role. Please try again later.");
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
        <TitlePage title="Role" description={show ? "Update role and permissions" : "View role and permissions"} viewPage>
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

        {!show && permissions && (
          <div>
            <p>Role : '{data.name}'</p>
            <p>
              Permisssions :
              {permissions
                .filter((item) => item.bitmask === true)
                .map((item) => (
                  <span key={item.name} className="mx-2">
                    {item.name},
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
                description="This role will get updated."
                reset
              />

              <div className="flex flex-col gap-2">
                <FormLabel>Permissions</FormLabel>
                <div className="grid md:grid-cols-4">
                  {bitmask.map((item, index) => (
                    <SwitchButton key={index} name={`permissions.${index}.bitmask`} label={item.name} />
                  ))}
                </div>
              </div>
              <div className="flex justify-end my-4 gap-2">
                <Button variant={"outline"} onClick={() => router.back()} >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    <ButtonContent status={loading} text={"Update"}/>
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>

      {open && (
        <DialogBox open={open} title={"Delete Confirmation"} preventClose setClose={handleClose}>
          <h1>Are you sure? Do you want to delete role {data.name}</h1>
          <div className="flex justify-end">
            <Button onClick={() => handleDelete(id as string)} variant={'destructive'}>Confirm</Button>
          </div>
        </DialogBox>
      )}
    </>
  );
}
