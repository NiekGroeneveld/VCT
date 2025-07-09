
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

    // Helper function to check if a dot is occupied by a tray
    const isDotOccupied = (dotNumber: number): boolean => {
        return trays.some(tray => {
            const trayBottomDot = tray.dotPosition;
            const trayTopDot = trayBottomDot + Math.ceil(tray.height / ConfigurationConstants.DOT_DELTA) - 1;
            return dotNumber >= trayBottomDot && dotNumber <= trayTopDot;
        });
    };

    // Helper function to get elevator indicators
    const getElevatorIndicators = (dotNumber: number): number => {
        // Bottom indicators
        if (dotNumber === 1) return 1;
        if (dotNumber === 3) return 2;
        if (dotNumber === 6) return 3;
        if (dotNumber === 7) return 4;
        // Top indicators
        if (dotNumber === 72) return 1;
        if (dotNumber === 68) return 2;
        if (dotNumber === 65) return 3;
        if (dotNumber === 61) return 4;
        return 0;
    };

    // Helper function to check if dot should be double (every 10 starting from 3)
    const isDoubleDot = (dotNumber: number): boolean => {
        return dotNumber >= 3 && (dotNumber - 3) % 10 === 0;
    };

    // Calculate gaps between trays for red numbers
    const getGapNumbers = (): { dotNumber: number; gap: number }[] => {
        const sortedTrays = [...trays].sort((a, b) => a.dotPosition - b.dotPosition);
        const gaps: { dotNumber: number; gap: number }[] = [];
        
        // Gap from top (72) to first tray
        if (sortedTrays.length > 0) {
            const firstTrayTop = sortedTrays[0].dotPosition + Math.ceil(sortedTrays[0].height / ConfigurationConstants.DOT_DELTA) - 1;
            const gapFromTop = ConfigurationConstants.DOTS - firstTrayTop;
            if (gapFromTop > 0) {
                gaps.push({ dotNumber: ConfigurationConstants.DOTS, gap: gapFromTop });
            }
        }
        
        // Gaps between trays
        for (let i = 0; i < sortedTrays.length - 1; i++) {
            const currentTrayTop = sortedTrays[i].dotPosition + Math.ceil(sortedTrays[i].height / ConfigurationConstants.DOT_DELTA) - 1;
            const nextTrayBottom = sortedTrays[i + 1].dotPosition;
            const gap = nextTrayBottom - currentTrayTop - 1;
            if (gap > 0) {
                gaps.push({ dotNumber: currentTrayTop + Math.floor(gap / 2), gap });
            }
        }
        
        return gaps;
    };

    return (
        <div className="flex">
            {/* Left side: Dot indicators */}
            <div 
                className="flex-shrink-0 relative bg-gray-100 border-r-2 border-black"
                style={{ width: '60px', height: `${machineHeight}px` }}
            >
                {Array.from({ length: ConfigurationConstants.DOTS }, (_, i) => {
                    const dotNumber = i + 1;
                    const yPosition = getDotYPosition(dotNumber);
                    const isOccupied = isDotOccupied(dotNumber);
                    const elevatorCount = getElevatorIndicators(dotNumber);
                    const isDouble = isDoubleDot(dotNumber);
                    
                    return (
                        <div key={dotNumber} className="absolute" style={{ bottom: `${yPosition}px`, left: '10px' }}>
                            {/* Main dot */}
                            <div 
                                className={`w-2 h-2 rounded-full border ${isOccupied ? 'bg-red-500' : 'bg-black'}`}
                                title={`Dot ${dotNumber}${isOccupied ? ' (occupied)' : ''}`}
                            />
                            
                            {/* Double dot indicator */}
                            {isDouble && (
                                <div 
                                    className={`w-2 h-2 rounded-full border ${isOccupied ? 'bg-red-500' : 'bg-black'} absolute`}
                                    style={{ left: '10px', top: '0px' }}
                                />
                            )}
                            
                            {/* Elevator indicators (yellow dots) */}
                            {elevatorCount > 0 && (
                                <div className="absolute" style={{ left: '20px', top: '0px' }}>
                                    {Array.from({ length: elevatorCount }, (_, idx) => (
                                        <div
                                            key={idx}
                                            className="w-2 h-2 rounded-full bg-yellow-400 border border-yellow-600 absolute"
                                            style={{ left: `${idx * 6}px`, top: '0px' }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {/* Gap numbers (red) */}
                {getGapNumbers().map(({ dotNumber, gap }, index) => (
                    <div 
                        key={index}
                        className="absolute text-red-600 font-bold text-xs"
                        style={{ 
                            bottom: `${getDotYPosition(dotNumber)}px`, 
                            left: '35px',
                            transform: 'translateY(50%)'
                        }}
                    >
                        {gap}
                    </div>
                ))}
            </div>

            {/* Right side: Machine area with black border */}
            <div 
                ref={divRef}
                className={`
                    relative border-2 border-black bg-gray-50 flex-1
                    ${isOver ? (canDrop ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : ''}
                    ${className}
                `}
                style={{
                    height: `${machineHeight}px`,
                    minHeight: '800px',
                    paddingLeft: '20px',
                    paddingRight: '20px'
                }}
            >
                {/* Working area */}
                <div
                    className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-50"
                    style={{ height: `${machineHeight}px` }}
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
        </div>
    );
};