/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { TextareaController } from "@/components/_form-controls/TextareaController";
import { useRouter } from "next/navigation";

const UpdateSchemaForm = () => {

  const route = useRouter();

  const form = useForm({
    defaultValues: {
      json: ""
    }
  });

  const [formFields, setFormFields] = useState<object>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFormData() {
      try {
        const data = await fetchFormMetadata();
        setFormFields(data);
        form.setValue('json', JSON.stringify(data, null, 2))
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFormData();
  }, [form]);

  const onSubmit = async (data: any) => {
    try {
      const update = JSON.parse(data.json);
      const res = await updateFormMetadata(update);
      if (res) {
        toast.success("Form metadata updated successfully");
      } else {
        toast.error("Failed to update form metadata");
      }
    } catch (error) {
      console.error("Invalid JSON:", error);
      toast.error("Invalid JSON");
    } finally {
      route.back();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formFields && <TextareaController name={"json"} label={"Schema"} rows={20}/>}
        <div className='flex justify-end gap-2'>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateSchemaForm;

async function fetchFormMetadata() {
  const res = await fetch('/api/json-data');
  if (!res.ok) {
    throw new Error('Failed to fetch form metadata');
  }
  return await res.json();
}

async function updateFormMetadata(updatedMetadata: any) {
  const res = await fetch('/api/json-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedMetadata),
  });
  if (res.ok) {
    return true
  } else {
    return false
  }
}