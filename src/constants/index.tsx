import { FieldType } from "@/types";

export const fieldTypes: FieldType[] = [
  { name: 'Input', isNew: false },
  { name: 'Select', isNew: false },
  { name: 'Phone', isNew: false },
  { name: 'Password', isNew: false },
  { name: 'Date Picker', isNew: false },
  { name: 'Divider', isNew: false },
  { name: 'Checkbox', isNew: false },
  { name: 'Combobox', isNew: false },
  { name: 'File Input', isNew: false },
  { name: 'Input OTP', isNew: false },
  { name: 'Location Input', isNew: true },
  { name: 'Signature Input', isNew: true },
  { name: 'Slider', isNew: false },
  { name: 'Switch', isNew: false },
  { name: 'Tags Input', isNew: false },
  { name: 'Textarea', isNew: false },
  // { name: 'Multi Select', isNew: false },
  // { name: 'Datetime Picker', isNew: true },
]

export const defaultFieldConfig: Record<
  string,
  { label: string; description: string; placeholder?: any }
> = {
  Input: {
    label: 'Label',
    description: 'This is sample description.',
    placeholder: 'Placeholder',
  },
  Select: {
    label: 'Select',
    description: 'This is sample description.',
    placeholder: 'Select',
  },
  Checkbox: {
    label: 'Use different settings for my mobile devices',
    description:
      'You can manage your mobile notifications in the mobile settings page.',
  },
  Combobox: {
    label: 'Language',
    description: 'This is the language that will be used in the dashboard.',
  },
  'Date Picker': {
    label: 'Date of birth',
    description: 'Your date of birth is used to calculate your age.',
  },
  'Datetime Picker': {
    label: 'Submission Date',
    description: 'Add the date of submission with detailly.',
  },
  'File Input': {
    label: 'Select File',
    description: 'Select a file to upload.',
  },
  
  'Input OTP': {
    label: 'One-Time Password',
    description: 'Please enter the one-time password sent to your phone.',
  },
  'Location Input': {
    label: 'Select Country',
    description:
      'If your country has states, it will be appear after selecting country',
  },
  'Multi Select': {
    label: 'Select your framework',
    description: 'Select multiple options.',
  },
 
  Slider: {
    label: 'Set Price Range',
    description: 'Adjust the price by sliding.',
  },
  'Signature Input': {
    label: 'Sign here',
    description: 'Please provide your signature above',
  },
  'Smart Datetime Input': {
    label: "What's the best time for you?",
    description: 'Please select the full time',
  },
  Switch: {
    label: 'Marketing emails',
    description: 'Receive emails about new products, features, and more.',
  },
  'Tags Input': { label: 'Enter your tech stack.', description: 'Add tags.' },
  Textarea: {
    label: 'Bio',
    description: 'You can @mention other users and organizations.',
  },
  Password: {
    label: 'Password',
    description: 'Enter your password.',
  },
  Phone: {
    label: 'Phone number',
    description: 'Enter your phone number.',
  },
}