import { FormFieldType } from "@/types"

export const generateCodeSnippet = (field: FormFieldType) => {
  switch (field.variant) {
    case 'Checkbox':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  ${field.disabled ? 'disabled' : ''}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>${field.label}</FormLabel>
                ${field.description && `<FormDescription>${field.description}</FormDescription>`}
                <FormMessage />
              </div>
            </FormItem>
          )}
        />`
    case 'Combobox':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>${field.label}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox"
                      className={cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}
                      ${field.disabled ? 'disabled' : ''}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : "Select language"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
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
                              form.setValue("${field.name}", language.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                language.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
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
              ${field.description && `<FormDescription>${field.description}</FormDescription>`}
              <FormMessage />
            </FormItem>
          )}
        />`
    case 'Date Picker':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>${field.label}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              ${field.description && `<FormDescription>${field.description}</FormDescription>`}
              <FormMessage />
            </FormItem>
          )}
        />`
    case 'Input':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <Input {...field} 
                  placeholder="${field.placeholder}"
                  ${field.type ? `type="${field.type}"` : ''}
                  ${field.disabled ? 'disabled' : ''}
                  ${field.min ? `minLength={${field.min}}` : ''} 
                  ${field.max ? `maxLength={${field.max}}` : ''}
                  ${field.readOnly ? 'readOnly' : ''}
                />
              </FormControl>
              ${field.description && `<FormDescription>${field.description}</FormDescription>`}
              <FormMessage />
            </FormItem>
          )}
        />`
    case 'Input OTP':
      return `
       <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
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
              ${field.description && `<FormDescription>${field.description}</FormDescription>`}
              <FormMessage />
            </FormItem>
          )}
        />`
    case 'Select':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="${field.placeholder}" />
                  </SelectTrigger>
                </FormControl>
                  <SelectContent>
                    {options.map((item)=>(
                      <SelectItem value={item.value} key={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
              </Select>
              ${field.description && `<FormDescription>${field.description}</FormDescription>`}
              <FormMessage />
            </FormItem>
          )}
        />`
    case 'Switch':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>${field.label}</FormLabel>
                ${field.description && `<FormDescription>${field.description}</FormDescription>`}
                <FormMessage />
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />`
    case 'Slider':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel>${field.label} - {value ?? 0}</FormLabel>
            <FormControl>
              <Slider
                min=${field.min ? `{${field.min}}` : '{0}'}
                max=${field.max ? `{${field.max}}` : '{100}'}
                step=${field.step ? `{${field.step}}` : '{1}'}
                defaultValue={[value]}
                onValueChange={(val) => {
                  onChange(val[0]);
                }}
              />
            </FormControl>
            ${field.description && `<FormDescription>${field.description}</FormDescription>`}
            <FormMessage />
          </FormItem>
          )}
        />`
    case 'Tags Input':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
          <FormItem>
            <FormLabel>${field.label}</FormLabel>
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
                placeholder="${field.placeholder}"
              />
            </FormControl>
            ${field.description && `<FormDescription>${field.description}</FormDescription>`}
            <FormMessage />
          </FormItem>
          )}
        />`
    case 'Textarea':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="${field.placeholder}"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              ${field.description && `<FormDescription>${field.description}</FormDescription>`}
              <FormMessage />
            </FormItem>
          )}
        />`
    case 'Password':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <PasswordInput placeholder="${field.placeholder}" {...field} />
              </FormControl>
              ${field.description && `<FormDescription>${field.description}</FormDescription>`}
              <FormMessage />
            </FormItem>
          )}
        />`
    case 'Phone':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>${field.label}</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    defaultCountry="IN"
                    placeholder="${field.placeholder}"
                    {...field}
                  />
                </FormControl>
                ${field.description && `<FormDescription>${field.description}</FormDescription>`}
              <FormMessage />
            </FormItem>
          )}
        />`
    case 'Location Input':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
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
              </FormControl>
              ${field.description && `<FormDescription>${field.description}</FormDescription>`}
              <FormMessage />
            </FormItem>
          )}
        />`
    case 'Signature Input':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <SignatureInput
                  canvasRef={canvasRef}
                  onSignatureChange={field.onChange}
                /> 
              </FormControl>
              ${field.description && `<FormDescription>${field.description}</FormDescription>`}
              <FormMessage />
            </FormItem>
          )}
        />`
    case 'File Input':
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput id="fileInput" className="outline-dashed outline-1 outline-slate-500">
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
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
              ${field.description && `<FormDescription>${field.description}</FormDescription>`}
              <FormMessage />
            </FormItem>
          )}
        />`
    case 'Separator':
      return `
        <Separator className="my-4" />`
    case 'Divider':
      return `
        <Divider text={${field.label}}/>`
    default:
      return null
  }
}