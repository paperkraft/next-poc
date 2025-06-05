import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { FormField } from '@/components/ui/form';

type FieldsComponents = {
    field: any;
    register: UseFormRegister<any>;
    control: Control;
}

export function FieldComponent({ field, register, control }: FieldsComponents) {

    switch (field.type) {
        case 'TEXT':
            return <Input id={field.name} {...register(field.name)} placeholder={field.label} />;
        case 'TEXTAREA':
            return <Textarea id={field.name} {...register(field.name)} placeholder={field.label} />;
        case 'EMAIL':
            return <Input id={field.name} type="email" {...register(field.name)} placeholder={field.label} />;
        case 'NUMBER':
            return <Input id={field.name} type="number" {...register(field.name)} placeholder={field.label} />;
        case 'SELECT':
            return (
                <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                        <Select
                            onValueChange={controllerField.onChange}
                            value={controllerField.value}
                            defaultValue={controllerField.value}
                        >
                            <SelectTrigger id={field.name}>
                                <SelectValue placeholder='Select' />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((opt: any) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            );
        case 'CHECKBOX':
            return (
                <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                        <Checkbox
                            id={field.name}
                            value={controllerField.value}
                            onCheckedChange={(c) => controllerField.onChange(c)}
                        />
                    )}
                />
            );
        case 'DATE':
            return <Input id={field.name} type="date" {...register(field.name)} className='inline-block' />;
        default:
            return null;
    }
}