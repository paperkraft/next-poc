'use client'
import { EyeOff, GripVertical, Pin } from 'lucide-react';

import { useDashboard } from '@/components/provider/DashboardProvider';
import { FullUserWidget } from '@/types/widget';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import WidgetLoader from './WidgetLoader';

export default function WidgetContainer({ widget }: { widget: FullUserWidget }) {

    const { updateWidget } = useDashboard();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: widget.id.toString() });


    const handleToggle = async (key: 'isPinned' | 'isHidden', value: boolean) => {
        try {
            await updateWidget(widget.widget.id.toString(), { [key]: value })
        } catch (err) {
            console.error(`Failed to update ${key}:`, err)
        }
    }

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        gridColumn: widget.customSize === 'large' ? 'span 3' :
            widget.customSize === 'small' ? 'span 1' : 'span 2'
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white rounded-lg shadow border ${isDragging ? 'ring-2 ring-blue-500 z-10' : ''
                } ${widget.customSize === 'large' ? 'md:col-span-3' : 'md:col-span-1'}`}
        >
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b rounded-t-lg">
                <div className="flex items-center gap-2">
                    <button
                        {...attributes}
                        {...listeners}
                        className="text-gray-400 hover:text-gray-600 cursor-grab"
                    >
                        <GripVertical size={16} />
                    </button>
                    <h3 className="font-medium">{widget.widget.widget.name}</h3>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => handleToggle('isPinned', !widget.isPinned)}
                        className={`p-1 rounded ${widget.isPinned ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Pin size={16} />
                    </button>
                    <button
                        onClick={() => handleToggle('isHidden', true)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded"
                    >
                        <EyeOff size={16} />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <WidgetLoader widget={widget.widget} />
            </div>
        </div>
    )
}