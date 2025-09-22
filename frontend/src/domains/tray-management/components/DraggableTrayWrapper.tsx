import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { GripVertical } from 'lucide-react';
import { Tray } from '../types/tray.types';
import { PlacedProduct } from '../../product-management/types/product.types';
import { TrayComponent } from '../../../domains/tray-management/components/TrayComponent';

interface DraggableTrayWrapperProps {
    tray: Tray;
    onUpdate: (tray: Tray) => void;
    onRemove: () => void;
    onDragStart: (tray: Tray) => void;
    onDragEnd: (trayId: number, finalYPosition: number) => boolean;
    onDragUpdate: (trayId: number, currentYPosition: number) => void;
    // ADD THIS: Props for cross-tray operations
    onProductMoveBetweenTrays?: (product: PlacedProduct, fromIndex: number, fromTrayId: number, toTrayId: number) => void;
    style?: React.CSSProperties;
    className?: string;
}

export const DraggableTrayWrapper: React.FC<DraggableTrayWrapperProps> = ({
    tray,
    onUpdate,
    onRemove,
    onDragStart,
    onDragEnd,
    onDragUpdate,
    onProductMoveBetweenTrays, // ADD THIS
    style,
    className = ""
}) => {
    const dragRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag, preview] = useDrag({
        type: 'TRAY_POSITION',
        item: () => {
            onDragStart(tray);
            return {
                type: 'TRAY_POSITION' as const,
                trayId: tray.id,
                tray: tray
            };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (item, monitor) => {
            const didDrop = monitor.didDrop();
            console.log(`[DND] Source end for tray ${tray.id}. didDrop=${didDrop}`);
            onDragEnd(tray.id, didDrop ? 0 : Number.NaN);
        }
    });

    // Connect the drag handle to the drag source
    drag(handleRef);
    // Connect the preview to the entire tray
    preview(dragRef);

    return (
        <div
            ref={dragRef}
            className={`relative group ${className}`}
            style={{
                opacity: isDragging ? 0.8 : 1,
                transition: isDragging ? 'none' : 'all 0.2s ease',
                boxShadow: isDragging ? '0 10px 25px rgba(0,0,0,0.3)' : 'none',
                zIndex: isDragging ? 40 : 'auto',
                ...style
            }}
        >
            {/* Persistent collision indicator */}
            {!isDragging && tray.hasCollision && (
                <div className="absolute border-2 border-red-500 rounded-lg pointer-events-none z-10" 
                     style={{ 
                         top: '-4px', 
                         bottom: '-4px', 
                         left: '-4px', 
                         right: '-28px' 
                     }}>
                    <div className="absolute top-1 right-1 text-red-600 text-xs font-bold bg-red-100 px-1 rounded">
                        Collision
                    </div>
                </div>
            )}
            
            {/* Invalid position indicator during drag */}
            {isDragging && tray.isValidPosition === false && (
                <div className="absolute border-2 border-red-500 border-dashed rounded-lg bg-red-100 bg-opacity-20 pointer-events-none z-10"
                     style={{ 
                         top: '-4px', 
                         bottom: '-4px', 
                         left: '-4px', 
                         right: '-28px' 
                     }}>
                    <div className="absolute top-1 right-1 text-red-600 text-xs font-bold bg-red-100 px-1 rounded">
                        Invalid Position
                    </div>
                </div>
            )}
            
            {/* Drag Handle */}
            <div
                ref={handleRef}
                className={`
                    absolute left-0 top-0 bottom-0 w-6 
                    bg-gray-200 hover:bg-gray-300 
                    border-r border-gray-300
                    cursor-grab active:cursor-grabbing
                    flex items-center justify-center
                    transition-colors duration-200
                    ${isDragging ? 'bg-blue-200 border-blue-300' : ''}
                    ${tray.isDragging ? 'bg-blue-200 border-blue-300' : ''}
                    ${isDragging && tray.isValidPosition === false ? 'bg-red-200 border-red-300' : ''}
                    ${!isDragging && tray.hasCollision ? 'bg-red-200 border-red-300' : ''}
                    rounded-l-lg
                `}
                title={`Drag ${tray.name || `Tray ${tray.id}`} to reposition`}
            >
                <GripVertical 
                    size={16} 
                    className={`
                        text-gray-500 group-hover:text-gray-700
                        ${isDragging ? 'text-blue-600' : ''}
                        ${tray.isDragging ? 'text-blue-600' : ''}
                        ${isDragging && tray.isValidPosition === false ? 'text-red-600' : ''}
                        ${!isDragging && tray.hasCollision ? 'text-red-600' : ''}
                    `} 
                />
            </div>

            {/* Tray Component with left padding for handle */}
            <div className="pl-6">
                <TrayComponent
                    tray={tray}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    onProductMoveBetweenTrays={onProductMoveBetweenTrays} // ADD THIS LINE
                    variant="managed" // ADD THIS LINE
                />
            </div>

            {/* Dragging indicator */}
            {isDragging && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                    {tray.name || `Tray ${tray.id}`} → Dot {tray.dotPosition || 1}
                    {tray.isValidPosition === false && <span className="ml-2 text-red-300">⚠ Invalid</span>}
                </div>
            )}
        </div>
    );
};