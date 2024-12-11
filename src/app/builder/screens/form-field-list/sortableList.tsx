import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormFieldType } from '@/types';
import { SortableItem } from '../field-item/sortableItem';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

type FormFieldListProps = {
    formFields: FormFieldOrGroup[]
    setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>
    openEditDialog: (field: FormFieldType) => void
}

function getFieldId(field: FormFieldOrGroup, index: number): string {
    return Array.isArray(field) ? `row-${index}` : (field as FormFieldType).name;
}

export default function SortableList({ formFields, setFormFields }: FormFieldListProps) {

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        const activeId = String(active.id);
        const overId = over ? String(over.id) : "";

        if (over && activeId !== overId) {
            const oldIndex = formFields.findIndex(field => (Array.isArray(field) ? `row-${formFields.indexOf(field)}` === activeId : field.name === activeId));
            const newIndex = formFields.findIndex(field => (Array.isArray(field) ? `row-${formFields.indexOf(field)}` === overId : field.name === overId));

            if (oldIndex !== -1 && newIndex !== -1) {
                setFormFields((prev) => arrayMove(prev, oldIndex, newIndex));
            }
        }
    }

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            
        >
            <SortableContext
                items={formFields.map((field, index) => getFieldId(field, index))}
                strategy={verticalListSortingStrategy}
                

            >
                {formFields.map((field, index) => (
                    <div className="flex items-center gap-1 p-2"
                        key={getFieldId(field, index)}
                        id={getFieldId(field, index)}
                    >
                        <SortableItem
                            key={getFieldId(field, index)}
                            field={field as any}
                            index={index}
                            formFields={formFields}
                            setFormFields={setFormFields}
                        />
                    </div>
                ))}
            </SortableContext>
        </DndContext>
    );
}