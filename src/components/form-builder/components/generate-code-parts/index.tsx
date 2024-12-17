import { z, ZodTypeAny } from 'zod'
import { FormFieldType } from '@/types'
import { generateCodeSnippet } from '../generate-code-field'

type FormFieldOrGroup = FormFieldType | FormFieldType[]

export const generateZodSchema = (formFields: FormFieldOrGroup[]): z.ZodObject<any> => {
  const schemaObject: Record<string, z.ZodTypeAny> = {}

  const processField = (field: FormFieldType): void => {
    if (field.variant === 'Divider' || field.variant === 'Separator') return

    let fieldSchema: z.ZodTypeAny

    switch (field.variant) {
      case 'Checkbox':
        fieldSchema = z.boolean()
        break

      case 'Date Picker':
        fieldSchema = z.coerce.date()
        break

      case 'Input':
        if (field.type === 'email') {
          fieldSchema = z.string().email()
          break
        } else if (field.type === 'number') {
          fieldSchema = z.coerce.number()
          break
        } else {
          fieldSchema = z.string()
          break
        }

      case 'Location Input':
        fieldSchema = z.tuple([
          z.string({
            required_error: 'Country is required',
          }),
          z.string().optional(),
        ])
        break

      case 'Slider':
        fieldSchema = z.coerce.number()
        break

      case 'Signature Input':
        fieldSchema = z.string({
          required_error: 'Signature is required',
        })
        break

      case 'Switch':
        fieldSchema = z.boolean()
        break

      case 'Tags Input':
        fieldSchema = z
          .array(z.string())
          .nonempty('Please enter at least one item')
        break

      case 'Multi Select':
        fieldSchema = z
          .array(z.string())
          .nonempty('Please select at least one item')
        break

      default:
        fieldSchema = z.string()
    }

    if (field.min !== undefined && 'min' in fieldSchema) {
      fieldSchema = (fieldSchema as any).min(
        field.min,
        // `Must be at least ${field.min}`,
      )
    }
    if (field.max !== undefined && 'max' in fieldSchema) {
      fieldSchema = (fieldSchema as any).max(
        field.max,
        // `Must be at most ${field.max}`,
      )
    }

    if (field.required !== true) {
      fieldSchema = fieldSchema.optional()
    }
    schemaObject[field.name] = fieldSchema as ZodTypeAny
  }

  formFields.flat().forEach(processField)

  return z.object(schemaObject)
}

export const zodSchemaToString = (schema: z.ZodTypeAny): string => {
  console.log('schema', schema._def)
  if (schema instanceof z.ZodDefault) {
    return `${zodSchemaToString(schema._def.innerType)}.default(${JSON.stringify(schema._def.defaultValue())})`
  }

  if (schema instanceof z.ZodBoolean) {
    return `z.boolean()`
  }

  if (schema instanceof z.ZodNumber) {
    let result = 'z.coerce.number()'
    if ('checks' in schema._def) {
      schema._def.checks.forEach((check: any) => {
        if (check.kind === 'min') {
          result += `.min(${check.value})`
        } else if (check.kind === 'max') {
          result += `.max(${check.value})`
        }
      })
    }
    return result
  }

  if (schema instanceof z.ZodString) {
    let result = 'z.string()'
    if ('checks' in schema._def) {
      schema._def.checks.forEach((check: any) => {
        if (check.kind === 'min') { 
          result += `.min(${check.value})`
        } else if (check.kind === 'max') {
          result += `.max(${check.value})`
        } else if(check.kind === 'email') {
          result += `.email()`
        }
      })
    }
    return result
  }

  if (schema instanceof z.ZodDate) {
    return `z.coerce.date()`
  }

  if (schema instanceof z.ZodArray) {
    return `z.array(${zodSchemaToString(schema.element)}).nonempty("Please at least one item")`
  }

  if (schema instanceof z.ZodTuple) {
    return `z.tuple([${schema.items.map((item: z.ZodTypeAny) => zodSchemaToString(item)).join(', ')}])`
  }

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape
    const shapeStrs = Object.entries(shape).map(
      ([key, value]) => `${key}: ${zodSchemaToString(value as ZodTypeAny)}`,
    )
    return `z.object({
  ${shapeStrs.join(',\n  ')}
})`
  }

  if (schema instanceof z.ZodOptional) {
    return `${zodSchemaToString(schema.unwrap())}.optional()`
  }

  return 'z.unknown()'
}

export const getZodSchemaString = (formFields: FormFieldOrGroup[]): string => {
  const schema = generateZodSchema(formFields);
  const schemaEntries = Object.entries(schema.shape)
    .map(([key, value]) => {
      return `  ${key}: ${zodSchemaToString(value as ZodTypeAny)}`
    })
    .join(',\n')

  return `const formSchema = z.object({\n${schemaEntries}\n});`
}

export const generateImports = (formFields: FormFieldOrGroup[]): Set<string> => {
  const importSet = new Set([
    '"use client"',
    'import { useState } from "react"',
    'import {toast} from "sonner"',
    'import { useForm } from "react-hook-form"',
    'import { zodResolver } from "@hookform/resolvers/zod"',
    'import * as z from "zod"',
    'import { cn } from "@/lib/utils"',
    'import { Button } from "@/components/ui/button"',
    'import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"',
  ])

  const processField = (field: FormFieldType) => {
    switch (field.variant) {
      case 'Combobox':
        importSet.add(
          'import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command"',
        )
        importSet.add(
          'import { Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"',
        )
        importSet.add('import { Check, ChevronsUpDown } from "lucide-react"')
        break
      case 'Date Picker':
        importSet.add('import { format } from "date-fns"')
        importSet.add(
          'import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"',
        )
        importSet.add('import { Calendar } from "@/components/ui/calendar"')
        importSet.add('import { Calendar as CalendarIcon } from "lucide-react"')
        break
      case 'Datetime Picker':
        importSet.add(
          'import { DatetimePicker } from "@/components/ui/datetime-picker"',
        )
        break
      case 'Smart Datetime Input':
        importSet.add(
          'import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input"',
        )
        field.locale &&
          importSet.add(`import { ${field.locale} } from "date-fns/locale"`)
        break
      case 'File Input':
        importSet.add('import { CloudUpload, Paperclip } from "lucide-react"')
        importSet.add(
          'import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload"',
        )
        break
      case 'Input OTP':
        importSet.add(
          'import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp"',
        )
        break
      case 'Location Input':
        importSet.add(
          'import LocationSelector from "@/components/ui/location-input"',
        )
        break
      case 'Select':
        importSet.add(
          'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"',
        )
        break
      case 'Signature Input':
        importSet.add('import { useRef } from "react"')
        importSet.add(
          "import SignatureInput from '@/components/ui/signature-input'",
        )
        break
      case 'Tags Input':
        importSet.add('import { TagsInput } from "@/components/ui/tags-input"')
        break
      case 'Multi Select':
        importSet.add(
          'import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger} from "@/components/ui/multi-select"',
        )
        break
      case 'Password':
        importSet.add(
          'import { PasswordInput } from "@/components/ui/password-input"',
        )
        break
      case 'Phone':
        importSet.add(
          'import { PhoneInput } from "@/components/ui/phone-input";',
        )
        break
      case 'Divider':
        importSet.add(
          'import Divider from "@/components/ui/divider";',
        )
        break
      case 'Separator':
        importSet.add(
          'import { Separator } from "@/components/ui/separator";',
        )
        break
      default:
        importSet.add(
          `import { ${field.variant} } from "@/components/ui/${field.variant.toLowerCase()}"`,
        )
        break
    }
  }

  formFields.flat().forEach(processField)

  return importSet
}

export const generateConstants = (
  formFields: FormFieldOrGroup[],
): Set<string> => {
  const constantSet: Set<string> = new Set()

  formFields.flat().forEach((field) => {
    if (field.variant === 'Combobox') {
      constantSet.add(`const languages = [
        { label: 'English', value: 'en' },
        { label: 'Hindi', value: 'hi' },
        { label: 'Marathi', value: 'mr' },
        { label: 'Other', value: 'or' },
      ] as const;`)
    } else if (field.variant === 'File Input') {
      constantSet.add(`
        const [files, setFiles] = useState<File[] | null>(null); 

        const dropZoneConfig = {
          maxFiles: 5,
          maxSize: 1024 * 1024 * 4,
          multiple: true,
        };`)
    } else if (field.variant === 'Location Input') {
      constantSet.add(`
        const [countryName, setCountryName] = useState<string>('')
        const [stateName, setStateName] = useState<string>('')
        `)
    } else if (field.variant === 'Signature Input') {
      constantSet.add(`const canvasRef = useRef<HTMLCanvasElement>(null)`)
    } else if (field.variant === 'Select') {
      constantSet.add(`const options = [
        { label: "Option A", value: "A" },
        { label: "Option B", value: "B" },
      ] as const;`)
    }
  })

  return constantSet
}

export const generateDefaultValues = (
  fields: FormFieldOrGroup[],
  existingDefaultValues: Record<string, any> = {},
): Record<string, any> => {
  const defaultValues: Record<string, any> = { ...existingDefaultValues }

  fields.flat().forEach((field) => {
    if (field.variant === 'Divider' || field.variant === 'Separator') return

    if (defaultValues[field.name]) return

    switch (field.variant) {
      case 'Tags Input':
        defaultValues[field.name] = []
        break
      case 'Date Picker':
        defaultValues[field.name] = null
        break
      case 'Switch':
      case 'Checkbox':
        defaultValues[field.name] = false
        break
      case 'Slider':
        defaultValues[field.name] = 0
      case 'Input':
        if (field.type === 'number') {
          defaultValues[field.name] = 0
          break
        }
        defaultValues[field.name] = ""
        break
      default:
        defaultValues[field.name] = ""
    }

    // if (field.name && defaultValues[field.name] === undefined) {
    // }
  })

  return defaultValues
}

export const generateFormCode = (formFields: FormFieldOrGroup[]): string => {

  const imports = Array.from(generateImports(formFields)).join('\n')
  const constants = Array.from(generateConstants(formFields)).join('\n')
  const schema = getZodSchemaString(formFields)

  const renderFields = (fields: FormFieldOrGroup[]) => {

    const indent = (code: string, level: number = 1) => code.split('\n').map(line => '  '.repeat(level) + line).join('\n');

    return fields.map((fieldOrGroup) => {
      if (Array.isArray(fieldOrGroup)) {
        const colSpan = fieldOrGroup.length === 2 ? 6 : 4
        return `
        <div className="grid grid-cols-12 gap-4">${fieldOrGroup.map((field) => `
          <div className="col-span-${colSpan}"> ${indent(generateCodeSnippet(field) as string, 2)}
          </div>`).join('')}
        </div>`
      } else {
        return generateCodeSnippet(fieldOrGroup)
      }
    }).join('\n')
  }

  const defaultValues = generateDefaultValues(formFields)
  

  const component = `
export default function MyForm() {
  ${constants}
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: ${JSON.stringify(defaultValues, null, 2)}
    
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
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
${renderFields(formFields).split('\n').filter((line) => line.trim() !== '').join('\n')}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
  `
  return imports + '\n\n' + schema + '\n' + component
}