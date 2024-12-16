"use client"
import {
  useState
} from "react"
import {
  toast
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  cn
} from "@/lib/utils"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  PhoneInput
} from "@/components/ui/phone-input";

const formSchema = z.object({
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  gender: z.string(),
  phone: z.string()
});

export default function MyForm() {
  const options = [{
      label: "Option A",
      value: "A"
    },
    {
      label: "Option B",
      value: "B"
    },
  ] as
  const;
  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "firstName": "",
      "middleName": "",
      "lastName": "",
      "gender": "",
      "phone": ""
    }

  })

  function onSubmit(values: z.infer < typeof formSchema > ) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
        
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">     
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} 
                      placeholder="First Name"
                      type="undefined"
                      
                    />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-4">     
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input {...field} 
                      placeholder="Middle Name"
                      type="undefined"
                      
                    />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-4">     
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} 
                      placeholder="Last Name"
                      type="undefined"
                      
                    />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                </FormControl>
                  <SelectContent>
                    {options.map((item)=>(
                      <SelectItem value={item.value} key={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
              </Select>
              
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Phone number</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    defaultCountry="IN"
                    placeholder="Placeholder"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter your phone number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}