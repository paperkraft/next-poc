'use client'
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormFieldType } from '@/types';
import { SortableItem } from '../sortable-item';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

interface FormFieldListProps {
    formFields: FormFieldOrGroup[];
    setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>;
    openEditDialog: (field: FormFieldType) => void;
}

export function getFieldId(field: FormFieldOrGroup): string {
    return Array.isArray(field) ? `row-${field[0]?.name}` : field.name
}

export default function SortableList({ formFields, setFormFields, openEditDialog }: FormFieldListProps) {

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor,{
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        const activeId = String(active.id);
        const overId = over ? String(over.id) : "";

        if (over && activeId !== overId) {
            const oldIndex = formFields.findIndex(field => getFieldId(field) === activeId);
            const newIndex = formFields.findIndex(field => getFieldId(field) === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                setFormFields(arrayMove(formFields, oldIndex, newIndex));
            }
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
            <SortableContext
                items={formFields.map((field) => getFieldId(field))}
                strategy={verticalListSortingStrategy}
            >
                <div className='flex flex-col gap-3 w-full'>
                    {formFields.map((field, index) => (
                        <div className="max-h-[50px] p-1 w-full"
                            key={getFieldId(field)}
                            id={getFieldId(field)}
                        >
                            <SortableItem
                                field={field as FormFieldType}
                                index={index}
                                subIndex={null}
                                formFields={formFields}
                                setFormFields={setFormFields}
                                openEditDialog={openEditDialog}
                            />
                        </div>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}