import { Button } from "@/components/ui/button"
import { ItemProps } from "./sortableItem"
import { LucidePencil, LucideTrash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { memo, useCallback } from "react"

export const Item = memo(({ field, index, subIndex, setFormFields, openEditDialog }: ItemProps) => {

    const handleRemoveField = useCallback((index: number, fieldIndex: number | null) => {
        setFormFields((prevFields) => {
            const updatedFields = [...prevFields];

            if (Array.isArray(updatedFields[index])) {
                if (fieldIndex === null) {
                    updatedFields[index] = updatedFields[index].slice(1);
                } else {
                    updatedFields[index] = updatedFields[index].filter((_, idx) => idx !== fieldIndex);
                }

                if (updatedFields[index]?.length === 0) {
                    updatedFields.splice(index, 1);
                }
                if (updatedFields[index]?.length === 1) {
                    updatedFields[index] = updatedFields[index][0];
                }
            } else {
                updatedFields.splice(index, 1);
            }
            return updatedFields;
        });
    }, [setFormFields]);

    return (
        <div className={cn("flex items-center w-full p-1 px-2", 
            {'border bg-background rounded-sm': !subIndex && subIndex !== 0 }
        )}>
            <div className="w-full text-sm">{field.variant}</div>
            <div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className='hover:text-green-500 size-7' 
                    onClick={() => openEditDialog(field)}
                    aria-label={`Edit ${field.variant}`}
                >
                    <LucidePencil />
                </Button>
            </div>
            <div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className='hover:text-red-500 size-7' 
                    onClick={() => handleRemoveField(index, subIndex)}
                    aria-label={`Delete ${field.variant}`}
                >
                    <LucideTrash2 />
                </Button>
            </div>
        </div>
    )
});

Item.displayName = "Item"