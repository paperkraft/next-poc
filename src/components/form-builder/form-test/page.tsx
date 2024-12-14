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
  FormMessage,
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

const formSchema = z.object({
  name_9759298634: z.string(),
  name_1109364942: z.string(),
  name_5329608056: z.string()
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
      "name_9759298634": "",
      "name_1109364942": "",
      "name_5329608056": ""
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
          
          <div className="col-span-6">
            
        <FormField
          control={form.control}
          name="name_9759298634"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input 
                placeholder="Placeholder"
                
                type=""
                {...field} />
              </FormControl>
              <FormDescription>This is sample description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          
          <div className="col-span-6">
            
        <FormField
          control={form.control}
          name="name_1109364942"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input 
                placeholder="Placeholder"
                
                type=""
                {...field} />
              </FormControl>
              <FormDescription>This is sample description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          
        </div>
        
        <FormField
          control={form.control}
          name="name_5329608056"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                  <SelectContent>
                    {options.map((item)=>(
                      <SelectItem value={item.value} key={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
              </Select>
              <FormDescription>This is sample description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}