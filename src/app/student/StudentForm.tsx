'use client'
import { Button } from '@/components/ui/button';
import { Form} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { InputController } from '@/components/custom/form.control/InputController';
import { SelectController } from '@/components/custom/form.control/SelectController';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
    name: z.string().min(2, {
      message: "name must be at least 2 characters.",
    }),
    email: z.string().email({
      message:"Please enter valid email"
    }),
    option: z.string({
      required_error: "Please select test options.",
    })
});

const options = [
  {label:"Option A" , value:"a"},
  {label:"Option B" , value:"b"},
  {label:"Option C" , value:"c"}
]

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  name:"",
  email:"",
}

const StudentForm: React.FC = () => {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast({
      title: "submitted values:",
      description: (
        <pre className="mt-2 w-max md:w-[354px] rounded-md bg-slate-950 p-4">
          <code className="text-white text-[12px]">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-2">
        <InputController  name="name"   label="Name" placeholder="Enter your name" description='This is your public display name.' reset/>
        <InputController  name="email"  label="Email" type='email'  placeholder="Enter your email" description='This is your public display email.' reset/>
        <SelectController name="option" label="Select" placeholder="Select" description='This is sample select.' options={options}/>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default StudentForm;