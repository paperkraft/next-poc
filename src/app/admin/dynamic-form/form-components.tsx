import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { SelectOptions } from './schema';

type FieldsComponents = {
    field: any;
    register: UseFormRegister<any>;
    control: Control;
    selectOptions: Record<string, SelectOptions[]>;
}

export function FieldComponent({ field, register, control, selectOptions }: FieldsComponents) {

    const common = { ...register(field.name), id: field.name, placeholder: field.label }

    switch (field.type) {
        case 'TEXT':
            return <Input {...common} />;
        case 'TEXTAREA':
            return <Textarea {...common} />;
        case 'EMAIL':
            return <Input {...common} type="email" />;
        case 'NUMBER':
            return <Input {...common} type="number" />;
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
                                {selectOptions && selectOptions[field.name]?.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
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
            return <Input {...common} type="date" className='inline-block' />;
        default:
            return null;
    }
}