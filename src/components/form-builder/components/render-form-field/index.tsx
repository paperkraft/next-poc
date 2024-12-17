'use client'
import { ChangeEvent, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { PasswordInput } from '@/components/ui/password-input'
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from '@/components/ui/file-upload'
import { Slider } from '@/components/ui/slider'
import { CalendarIcon, Check, ChevronsUpDown, CloudUpload, Paperclip } from 'lucide-react'
import { TagsInput } from '@/components/ui/tags-input'
import LocationSelector from '@/components/ui/location-input'
import SignatureInput from '@/components/ui/signature-input'
import { FormFieldType } from '@/types'
import { PhoneInput } from '@/components/ui/phone-input'
import Divider from '@/components/ui/divider'
import { Separator } from '@/components/ui/separator'
import { UseFormReturn } from 'react-hook-form'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Marathi', value: 'mr' },
  { label: 'Other', value: 'or' },
] as const

const options = [
  { label: 'Option A', value: 'A' },
  { label: 'Option B', value: 'B' },
] as const

export const renderFormField = (field: FormFieldType, form: UseFormReturn) => {
  const [checked, setChecked] = useState<boolean>(field.defaultValue as boolean ?? false)
  const [value, setValue] = useState<any>(field.value)
  const [tagsValue, setTagsValue] = useState<string[]>([])
  const [files, setFiles] = useState<File[] | null>(null)
  const [date, setDate] = useState<Date>()
  const [countryName, setCountryName] = useState<string>('')
  const [stateName, setStateName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  }

  switch (field.variant) {
    case 'Input':
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && '*'}
          <FormControl>
            <Input
              placeholder={field.placeholder}
              disabled={field?.disabled}
              readOnly={field.readOnly}
              type={field?.type}
              minLength={field?.min}
              maxLength={field?.max}
            />
          </FormControl>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )

    case 'Switch':
      return (
        <FormItem className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base space-y-1 leading-none">{field.label} </FormLabel> {field.required && '*'}
            {field.description && <FormDescription>{field.description}</FormDescription>}
            <FormMessage />
          </div>
          <FormControl>
            <Switch
              checked={checked}
              onCheckedChange={() => {
                setChecked(!checked)
              }}
              disabled={field.disabled}
              aria-readonly={field.readOnly}
            />
          </FormControl>
        </FormItem>
      )

    case 'Checkbox':
      return (
        <FormItem
          className={cn(
            'flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4',
            field.className,
          )}
        >
          <FormControl>
            <Checkbox
              checked={checked}
              onCheckedChange={() => {
                setChecked(!checked)
              }}
              disabled={field.disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{field.label}</FormLabel> {field.required && '*'}
            {field.description && <FormDescription>{field.description}</FormDescription>}
          </div>
          <FormMessage />
        </FormItem>
      )

    case 'Combobox':
      return (
        <FormItem className="flex flex-col">
          <div>
            <FormLabel>{field.label}</FormLabel> {field.required && '*'}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" role="combobox"
                  className={cn('w-full justify-between', !value && 'text-muted-foreground')}
                >
                  {value
                    ? languages.find((language) => language.value === value)
                      ?.label
                    : 'Select language'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align='start'>
              <Command>
                <CommandInput placeholder="Search language..." />
                <CommandList>
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {languages.map((language) => (
                      <CommandItem
                        value={language.label}
                        key={language.value}
                        onSelect={() => {
                          setValue(language.value)
                          form.setValue(field.name, language.value)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            language.value === value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {language.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )

    case 'Date Picker':
      return (
        <FormItem className="flex flex-col">
          <div>
            <FormLabel>{field.label}</FormLabel> {field.required && '*'}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate)
                  form.setValue(field.name, newDate, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )

    case 'Input OTP':
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && '*'}
          <FormControl>
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )

    case 'Select':
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && '*'}
          <Select onValueChange={field.onChange} defaultValue="">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((item) => (
                <SelectItem value={item.value} key={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )
    
    case 'Slider':
      const min = field.min || 0
      const max = field.max || 100
      const step = field.step || 1
      const defaultValue = 0

      return (
        <FormItem>
          <FormLabel>{field.label} - {value || defaultValue}</FormLabel> {field.required && '*'}
          <FormControl>
            <Slider
              min={min}
              max={max}
              step={step}
              defaultValue={[defaultValue]}
              onValueChange={(value) => {
                setValue(value[0])
                form.setValue(field.name, value[0])
              }}
            />
          </FormControl>

          {field.description && <FormDescription className="py-3">
            {field.description} Selected value is {value || defaultValue},
            minimun valus is {min}, maximim values is {max}, step size is {step}
          </FormDescription>}
          <FormMessage />
        </FormItem>
      )

    case 'Tags Input':
      const currentTags = Array.isArray(form.watch(field.name))
        ? form.watch(field.name)
        : []

      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && '*'}
          <FormControl>
            <TagsInput
              value={tagsValue}
              onValueChange={(newTags) => {
                setTagsValue(newTags)
                form.setValue(field.name, newTags, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
              placeholder="Enter your tags"
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )

    case 'Textarea':
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && '*'}
          <FormControl>
            <Textarea
              placeholder={field.placeholder}
              className="resize-none"
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )

    case 'Password':
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && '*'}
          <FormControl>
            <PasswordInput
              value={password}
              placeholder="password"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value)
                form.setValue(field.name, e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )

    case 'Phone':
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && '*'}
          <FormControl>
            <PhoneInput
              defaultCountry="IN"
              onChange={(phoneNumber) => {
                form.setValue(field.name, phoneNumber, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )

    case 'Location Input':
      return (
        <FormItem className="flex flex-col">
          <div>
            <FormLabel>{field.label}</FormLabel> {field.required && '*'}
          </div>
          <LocationSelector
            onCountryChange={(country) => {
              setCountryName(country?.name || '')
              form.setValue(field.name, [country?.name || '', stateName || ''])
            }}
            onStateChange={(state) => {
              setStateName(state?.name || '')
              form.setValue(field.name, [countryName || '', state?.name || ''])
            }}
          />
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )

    case 'Signature Input':
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <SignatureInput
              canvasRef={canvasRef}
              onSignatureChange={(signature) => {
                if (signature) field.onChange(signature)
              }}
            />
          </FormControl>
          {field.description && <FormDescription className="py-3">{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )

    case 'File Input':
      return (
        <FormItem>
          <FormLabel>{field.label}</FormLabel> {field.required && '*'}
          <FormControl>
            <FileUploader
              value={files}
              onValueChange={setFiles}
              dropzoneOptions={dropZoneConfig}
              className="relative bg-background rounded-lg p-2"
            >
              <FileInput id="fileInput" className="outline-dashed outline-1 outline-slate-500">
                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                  <CloudUpload className='text-gray-500 w-10 h-10' />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                    &nbsp; or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF
                  </p>
                </div>
              </FileInput>

              <FileUploaderContent>
                {files &&
                  files.length > 0 &&
                  files.map((file, i) => (
                    <FileUploaderItem key={i} index={i}>
                      <Paperclip className="h-4 w-4 stroke-current" />
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}
              </FileUploaderContent>
            </FileUploader>
          </FormControl>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )

    case 'Separator':
      return (<Separator className={cn('my-4', field.className)} />)

    case 'Divider':
      return (<Divider text={field.label} />)
      
    default:
      return null
  }
}