'use client'
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { InputController } from '@/components/_form-controls/InputController';
import { SelectController } from '@/components/_form-controls/SelectController';
import { toast } from '@/hooks/use-toast';
import { DateController } from '@/components/_form-controls/DateController';

const formSchema = z.object({
    name: z.string({
      required_error: "Name is required.",
    }).min(1, {
      message:"Name is required."
    }),
    email: z.string({
      required_error: "Email is required.",
    }).email({
      message:"Please enter valid email"
    }),
    date: z.coerce.date({
      errorMap:()=>({ message:"Date is required.", })
    }),
    // date: z.coerce.date({errorMap:(issue, {defaultError})=>({message: issue.code === "invalid_date" ? "Please enter valid date" : defaultError,})}),
    gender: z.string({
      required_error: "Gender is required.",
    })
});

const options = [
  {label:"Male" , value:"M"},
  {label:"Female" , value:"F"},
  {label:"Other" , value:"O"}
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
        <DateController   name='date'   label='Date' placeholder='DD-MM-YYY' description='This is your public display date of birth'/>
        <SelectController name="gender" label="Gender" placeholder="Select" description='This is your public display gender' options={options}/>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default StudentForm;