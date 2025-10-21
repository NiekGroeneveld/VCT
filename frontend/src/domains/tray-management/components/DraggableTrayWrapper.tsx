import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { Tray } from '../types/tray.types';
import { PlacedProduct } from '../../product-management/types/product.types';
import { TrayComponent } from '../../../domains/tray-management/components/TrayComponent';
import { useScaling } from '../../../hooks/useScaling';

interface DraggableTrayWrapperProps {
    tray: Tray;
    onUpdate: (tray: Tray) => void;
    onRemove: () => void;
    onDragStart: (tray: Tray) => void;
    onDragEnd: (trayId: number, finalYPosition: number) => boolean;
    onDragUpdate: (trayId: number, currentYPosition: number) => void;
    // ADD THIS: Props for cross-tray operations
    onProductMoveBetweenTrays?: (product: PlacedProduct, fromIndex: number, fromTrayId: number, toTrayId: number) => void;
    companyId?: number; // Add company ID for API calls
    configurationId?: number; // Add configuration ID for API calls
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
    companyId,
    configurationId,
    style,
    className = ""
}) => {
    const dragRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const { scaledValue } = useScaling();

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
    
    // Hide the default drag preview
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    // Calculate the full width including drag handle, tray, and action bar
    const dragHandleWidth = 24; // w-6 = 24px
    const actionBarWidth = 24; // w-6 = 24px
    const trayScaledWidth = scaledValue(tray.trayWidth);
    const totalWidth = dragHandleWidth + trayScaledWidth + actionBarWidth;

    return (
        <div
            ref={dragRef}
            className={`relative group flex ${className}`}
            style={{
                opacity: 1,
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
                         width: `${totalWidth + 8}px`  // Total width + border offset
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
                         width: `${totalWidth + 8}px`  // Total width + border offset
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
                    flex-shrink-0 w-6 
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

            {/* Tray Component */}
            <div className="flex-shrink-0">
                <TrayComponent
                    tray={tray}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    onProductMoveBetweenTrays={onProductMoveBetweenTrays}
                    companyId={companyId}
                    configurationId={configurationId}
                    variant="managed"
                />
            </div>

            {/* Action Bar (Right Side) */}
            <div
                className={`
                    flex-shrink-0 w-6 
                    bg-gray-200 hover:bg-gray-300 
                    border-l border-gray-300
                    flex flex-col items-center justify-center gap-2 py-2
                    transition-colors duration-200
                    ${isDragging ? 'bg-blue-200 border-blue-300' : ''}
                    ${tray.isDragging ? 'bg-blue-200 border-blue-300' : ''}
                    ${isDragging && tray.isValidPosition === false ? 'bg-red-200 border-red-300' : ''}
                    ${!isDragging && tray.hasCollision ? 'bg-red-200 border-red-300' : ''}
                    rounded-r-lg
                `}
            >
                {/* Copy Button (Future functionality) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Future: implement copy functionality
                    }}
                    className="bg-blue-700 text-white rounded p-1 transition-all hover:bg-blue-800 cursor-not-allowed opacity-0 group-hover:opacity-50"
                    title="Copy tray (coming soon)"
                    disabled
                >
                    <Copy size={12} />
                </button>

                {/* Remove Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="bg-red-500 text-white rounded p-1 transition-all hover:bg-red-600 hover:shadow-md active:scale-95 opacity-0 group-hover:opacity-100"
                    title="Remove tray"
                >
                    <Trash2 size={12} />
                </button>
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