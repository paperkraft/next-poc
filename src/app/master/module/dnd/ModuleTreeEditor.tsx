import {
    DndContext,
    closestCenter,
    DragEndEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFieldArray, useFormContext } from "react-hook-form";
import ModuleItem from "./ModuleItem";

export default function ModuleList({ name }: { name: string }) {
    const { control } = useFormContext();
    const { fields, append, remove, move } = useFieldArray({
        control,
        name,
    });

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor)
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id);
            const newIndex = fields.findIndex((f) => f.id === over?.id);
            move(oldIndex, newIndex);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <ModuleItem
                            key={field.id}
                            id={field.id}
                            name={`${name}.${index}`}
                            index={index}
                            remove={() => remove(index)}
                            depth = {0} // Assuming depth is 0 for top-level modules
                        />
                    ))}
                </div>
            </SortableContext>

            <button
                type="button"
                onClick={() =>
                    append({ name: "New Module", path: "", children: [] })
                }
                className="text-sm text-blue-500 mt-2"
            >
                + Add Submodule
            </button>
        </DndContext>
    );
}
