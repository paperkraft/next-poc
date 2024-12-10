import React, { forwardRef, useCallback, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormFieldType } from '@/types';
import { Button } from '@/components/ui/button';
import { GripHorizontalIcon } from 'lucide-react';
import SortableItem from '../field-item/sortableItem';

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

type FormFieldListProps = {
    formFields: FormFieldOrGroup[]
    setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>
    openEditDialog: (field: FormFieldType) => void
}


export default function SortableList({ formFields, setFormFields, openEditDialog }: FormFieldListProps) {

    const [activeId, setActiveId] = useState<string | any>(null);

    const [rowTabs, setRowTabs] = useState<{ [key: number]: FormFieldType[] }>({});

    const handleHorizontalReorder = useCallback((index: number, newOrder: FormFieldType[]) => {
        // Ensure the row is reordered correctly
        // setRowTabs((prev) => ({ ...prev, [index]: newOrder }));
        setRowTabs((prev) => {
            const updatedTabs = { ...prev };
            updatedTabs[index] = newOrder;
            return updatedTabs;
        });

        // Delay state update to ensure proper updates post-reordering
        setTimeout(() => {
            setFormFields((prevFields) => {
                const updatedFields = [...prevFields];
                updatedFields[index] = newOrder;
                return updatedFields
            });
        }, 500);
    }, [setFormFields, setRowTabs]);


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

        // Update rowTabs 
        setRowTabs((prev) => {
            const updatedTabs = { ...prev };

            if (Array.isArray(updatedTabs[index])) {
                if (fieldIndex === null) {
                    updatedTabs[index] = updatedTabs[index].slice(1);
                } else {
                    updatedTabs[index] = updatedTabs[index].filter((_, idx) => idx !== fieldIndex);
                }

                if (updatedTabs[index]?.length === 0) {
                    delete updatedTabs[index];
                }
            }
            return updatedTabs;
        });
    }, [setFormFields, setRowTabs]);


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );


    function handleDragEnd(event:DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = formFields.findIndex((field) =>
              Array.isArray(field) ? `group-${formFields.indexOf(field)}` === active.id : field.name === active.id
            );
            const newIndex = formFields.findIndex((field) =>
              Array.isArray(field) ? `group-${formFields.indexOf(field)}` === over.id : field.name === over.id
            );
      
            setFormFields((prev) => arrayMove(prev, oldIndex, newIndex));
          }
    }

    function handleDragStart(event:DragEndEvent) {
        const {active} = event;
        setActiveId(active.id);
      }

    return (
        <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext 
                items={formFields.map((field, index) =>
                    Array.isArray(field) ? `group-${index}` : field.name
                )}
                strategy={verticalListSortingStrategy}
            >
                {formFields.map((item, index) => (
                    <div className="flex items-center gap-1 p-2"
                        key={Array.isArray(item) ? `group-${index}` : item.name}
                    >


                        <SortableItem
                            key={Array.isArray(item) ? `group-${index}` : item.name}
                            field={item as any}
                            index={index}
                            formFields={formFields}
                            setFormFields={setFormFields}
                            openEditDialog={openEditDialog}
                            onRemoveField={handleRemoveField}
                        />


                        {/* <Button variant="outline" size="icon" className="size-8 hover:text-blue-400 mr-2">
                            <GripHorizontalIcon className="cursor-grab w-4 h-4" />
                        </Button>

                        {Array.isArray(item) ? (
                            // Horizontal
                            <div className="w-full grid grid-cols-12 gap-1">
                                {(rowTabs[index] || item).map((field, fieldIndex) => (
                                    <SortableItem
                                        key={field.name}
                                        index={index}
                                        subIndex={fieldIndex}
                                        field={field}
                                        formFields={formFields}
                                        setFormFields={setFormFields}
                                        openEditDialog={openEditDialog}
                                        onRemoveField={handleRemoveField}
                                    />
                                ))}
                            </div>
                        ) : (
                            <SortableItem
                                field={item}
                                index={index}
                                formFields={formFields}
                                setFormFields={setFormFields}
                                openEditDialog={openEditDialog}
                                onRemoveField={handleRemoveField}
                            />
                        )} */}
                    </div>
                ))}

            </SortableContext>
        </DndContext>
    );

    
}



 