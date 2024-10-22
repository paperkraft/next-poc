'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { InputController } from '@/components/custom/form.control/InputController';
import { SelectController } from '@/components/custom/form.control/SelectController';
import { toast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

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
    dob: z.date({
      required_error: "A date of birth is required.",
    }),
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
        
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        placeholder='Pick a date'
                        value={field.value ? format(field.value, "dd-MM-yyyy") : ""}
                        onChange={field.onChange}
                      />
                      <CalendarIcon className={cn("size-7 absolute right-1 top-1/2 -translate-y-1/2 px-1.5 font-normal cursor-pointer", !field.value && 'text-muted-foreground')}/>
                    </div>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar 
                    mode="single"
                    captionLayout='dropdown'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={{after: new Date()}}
                    // initialFocus
                    // fromYear={2000}
                    // toYear={2030}
                  />
                </PopoverContent>

              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SelectController name="gender" label="Gender" placeholder="Select" description='This is your public display gender' options={options}/>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default StudentForm;