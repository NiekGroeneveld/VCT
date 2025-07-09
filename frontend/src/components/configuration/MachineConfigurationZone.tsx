
import React from 'react';
import { useDrop } from 'react-dnd';
import { Tray } from '../../types/tray.types';
import { ConfigurationConstants, getDotYPosition } from '../../types/configuration.types';

interface MachineConfigurationZoneProps {
    trays: Tray[];
    onTrayPositionChange: (trayId: number, newYPosition: number) => void;
    children: React.ReactNode;
    className?: string;
}

export const MachineConfigurationZone: React.FC<MachineConfigurationZoneProps> = ({
    trays,
    onTrayPositionChange,
    children,
    className = ""
}) => {
    const [{ isOver, canDrop, draggedItem }, drop] = useDrop({
        accept: 'TRAY_POSITION',
        drop: (item: any, monitor) => {
            const clientOffset = monitor.getClientOffset();
            const containerRect = divRef.current?.getBoundingClientRect();
            if (clientOffset && containerRect) {
                // Convert from top-based client coordinates to bottom-based container coordinates
                const relativeY = clientOffset.y - containerRect.top;
                const containerBottomY = containerRect.height - relativeY;
                onTrayPositionChange(item.trayId, containerBottomY);
            }
            return { dropped: true };
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            draggedItem: monitor.getItem()
        }),
        hover: (item: any, monitor) => {
            const clientOffset = monitor.getClientOffset();
            const containerRect = divRef.current?.getBoundingClientRect();
            if (clientOffset && containerRect) {
                // Convert from top-based client coordinates to bottom-based container coordinates
                const relativeY = clientOffset.y - containerRect.top;
                const containerBottomY = containerRect.height - relativeY;
                onTrayPositionChange(item.trayId, containerBottomY);
            }
        }
    });

    // Calculate machine dimensions
    const machineHeight = ConfigurationConstants.MACHINE_HEIGHT;

    // Use a callback ref to attach the drop target
    const divRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (divRef.current) {
            drop(divRef.current);
        }
    }, [drop]);

    return (
        <div
            ref={divRef}
            className={`
                relative border-2 border-gray-300 bg-gray-50
                ${isOver ? (canDrop ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : ''}
                ${className}
            `}
            style={{
                height: `${machineHeight}px`, // Height: 13.5*72+200 = 1172px
                minHeight: '800px' // Reduced minimum height for better usability with 13.5mm spacing
            }}
        >

            {/* Dot position indicators - Only show every 5th dot to reduce visual clutter */}
            <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
                {Array.from({ length: Math.floor(ConfigurationConstants.DOTS / 5) }, (_, i) => {
                    const dotNumber = (i + 1) * 5; // Show every 5th dot
                    const yPosition = getDotYPosition(dotNumber);
                    
                    return (
                        <div
                            key={dotNumber}
                            className={`
                                absolute left-0 w-full border-t border-gray-300
                                ${isOver && canDrop ? 'border-green-300' : ''}
                                ${isOver && !canDrop ? 'border-red-300' : ''}
                            `}
                            style={{
                                bottom: `${yPosition}px`,
                                height: '1px'
                            }}
                        >
                            <span className={`
                                text-xs ml-2 text-gray-500
                                ${isOver ? 'text-blue-600' : ''}
                            `}>
                                Dot {dotNumber}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Working area */}
            <div
                className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-50"
                style={{ height: `${machineHeight}px` }} // Height: 13.5*72+200 = 1172px
            >
                {children}
            </div>

            {/* Drag feedback */}
            {isOver && draggedItem && (
                <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border-2 border-blue-200">
                    <div className={`text-sm font-medium ${canDrop ? 'text-green-600' : 'text-red-600'}`}>
                        {canDrop ? '✓ Valid Position' : '✗ Invalid Position'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                        Moving {draggedItem.tray?.name || `Tray ${draggedItem.trayId}`}
                    </div>
                    {!canDrop && (
                        <div className="text-xs text-red-500 mt-1">
                            Position blocked or out of bounds
                        </div>
                    )}
                </div>
            )}

            {/* Drop zone highlight when dragging */}
            {isOver && (
                <div className={`
                    absolute inset-0 pointer-events-none
                    ${canDrop 
                        ? 'bg-green-100 bg-opacity-20 border-2 border-green-400 border-dashed' 
                        : 'bg-red-100 bg-opacity-20 border-2 border-red-400 border-dashed'
                    }
                    rounded-lg
                `} />
            )}
        </div>
    );
};