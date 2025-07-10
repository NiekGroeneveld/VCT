// In src/components/DraggableTrayLabel.tsx
import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Tray } from '../types/tray.types';
import { GripVertical } from 'lucide-react';

interface DraggableTrayLabelProps {
    tray: Tray;
    onDragStart: (tray: Tray) => void;
    onDragEnd: (trayId: number, finalYPosition: number) => boolean;
    onDragUpdate: (trayId: number, currentYPosition: number) => void;
    className?: string;
}

export const DraggableTrayLabel: React.FC<DraggableTrayLabelProps> = ({
    tray,
    onDragStart,
    onDragEnd,
    onDragUpdate,
    className = ""
}) => {
    const dragRef = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'TRAY_POSITION',
        item: () => {
            onDragStart(tray);
            return {
                type: 'TRAY_POSITION' as const,
                trayId: tray.id,
                tray
            };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            const clientOffset = monitor.getClientOffset();
            
            if (clientOffset) {
                const success = onDragEnd(tray.id, clientOffset.y);
                if (!success) {
                    console.warn(`Failed to place tray ${tray.id} at position`);
                }
            }
        }
    });

    // Combine refs
    drag(dragRef);

    return (
        <div
            ref={dragRef}
            className={`
                flex items-center space-x-2 px-3 py-2 bg-gray-100 border border-gray-300 
                rounded-md cursor-move hover:bg-gray-200 transition-colors
                ${isDragging ? 'opacity-50 scale-95' : ''}
                ${tray.isDragging ? 'ring-2 ring-blue-400' : ''}
                ${className}
            `}
        >
            <GripVertical size={16} className="text-gray-600" />
            <div className="text-sm font-medium">
                {tray.name || `Tray ${tray.id}`}
            </div>
            <div className="text-xs text-gray-500">
                Dot {tray.dotPosition}
            </div>
        </div>
    );
};