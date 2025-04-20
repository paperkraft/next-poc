import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical, Plus, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CSS } from "@dnd-kit/utilities";

export default function ModuleItem({
    id,
    name,
    index,
    depth = 0,
    remove,
}: {
    id: string;
    name: string;
    index: number;
    depth?: number;
    remove: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const { register, control } = useFormContext();
    const { fields, append, remove: removeChild } = useFieldArray({
        control,
        name: `${name}.children`,
    });

    const isMaxDepthReached = depth >= 1;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="p-3 border rounded-md bg-white shadow-sm space-y-2"
        >
            <div className="flex items-center gap-2">
                <div {...attributes} {...listeners} className="cursor-grab">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                </div>

                <input
                    {...register(`${name}.name`)}
                    className="border px-2 py-1 rounded text-sm flex-1"
                    placeholder="Module Name"
                />
                <input
                    {...register(`${name}.path`)}
                    className="border px-2 py-1 rounded text-sm flex-1"
                    placeholder="Path"
                />

                <button type="button" onClick={remove}>
                    <Trash className="w-4 h-4 text-red-500" />
                </button>
                {
                    // depth <= 0 && // Only show the add button if there are no children
                    !isMaxDepthReached &&
                    <button
                        type="button"
                        onClick={() => append({ name: "", path: "", children: [] })}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                }
            </div>

            {/* Children Submodules */}
            {fields.length > 0 && (
                <SortableContext
                    items={fields.map((f) => f.id)}
                    // items={fields.map((f) => `${name}.children.${f.id}`)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="ml-6 space-y-2 border-l pl-4">
                        {fields.map((child, childIndex) => (
                            <ModuleItem
                                key={child.id}
                                // id={child.id}
                                id={`${name}.children.${childIndex}`}
                                name={`${name}.children.${childIndex}`}
                                index={childIndex}
                                remove={() => removeChild(childIndex)}
                                depth={depth + 1} // Increment depth for children
                            />
                        ))}
                    </div>
                </SortableContext>
            )}
        </div>
    );
}
