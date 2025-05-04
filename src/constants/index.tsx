import { FieldType } from "@/types";

export const fieldTypes: FieldType[] = [
  { name: 'Input', isNew: false },
  { name: 'Select', isNew: false },
  { name: 'Phone', isNew: false },
  { name: 'Password', isNew: false },
  { name: 'Date Picker', isNew: false },
  { name: 'Separator', isNew: false },
  { name: 'Divider', isNew: true },
  { name: 'Slider', isNew: false },
  { name: 'Switch', isNew: false },
  { name: 'Checkbox', isNew: false },
  { name: 'Textarea', isNew: false },
  { name: 'Combobox', isNew: false },
  { name: 'Input OTP', isNew: false },
  { name: 'File Input', isNew: false },
  { name: 'Tags Input', isNew: true },
  { name: 'Location Input', isNew: true },
  { name: 'Signature Input', isNew: true },
]

export const defaultFieldConfig: Record<string, { label: string; description: string; placeholder?: any, defaultValue?:any }> = {
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
    label: 'I accept Terms and Conditions',
    description: 'This is sample description.',
  },
  Combobox: {
    label: 'Search and Select',
    description: 'This is sample description.',
  },
  Switch: {
    label: 'Switch',
    description: 'This is sample description.',
  },
  Textarea: {
    label: 'Label',
    description: 'This is sample description.',
  },
  Password: {
    label: 'Password',
    description: 'Enter your password.',
  },
  Phone: {
    label: 'Phone number',
    description: 'Enter your phone number.',
  },
  Slider: {
    label: 'Slider',
    description: 'Adjust the value by sliding.',
  },
  Separator: {
    label: 'Separator',
    description: 'Separator.',
  },
  Divider: {
    label: 'Divider',
    description: 'Divider with text.',
  },
  'Tags Input': {
    label: 'Tags',
    description: 'This is sample description.'
  },
  'Date Picker': {
    label: 'Date of birth',
    description: 'Your date of birth is used to calculate your age.',
  },
  'File Input': {
    label: 'Select File',
    description: 'This is sample description.',
  },
  'Input OTP': {
    label: 'One-Time Password',
    description: 'Please enter the OTP sent to your phone.',
  },
  'Location Input': {
    label: 'Country',
    description:
      'If country has states, it will be appear after selecting country',
  },
  'Signature Input': {
    label: 'Sign here',
    description: 'Please provide your signature above',
  },
}

export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export const availableTopics = [
  { label: "System", topic: "system", desc: "Systems notifcations" },
  { label: "Security", topic: "security", desc: "Receive notifcation about your account activity and security." },
  { label: "Promotions", topic: "promotions", desc: "Receive notifcation about new features, and more." },
];