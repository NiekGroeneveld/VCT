
import React from 'react';
import { useDrop } from 'react-dnd';
import { Tray } from '../../tray-management/types/tray.types';
import { ConfigurationConstants, getDotYPosition, getYPositionDot, DragItem } from '../types/configuration.types';
import { useScaling } from '../../../hooks/useScaling';
import { useCompany } from '../../../Context/useCompany';
import { useConfig } from '../../../Context/useConfig';

interface MachineConfigurationZoneProps {
    trays: Tray[];
    onTrayPositionChange: (companyId: number, configurationId: number, trayId: number, newYPosition: number) => void;
    children: React.ReactNode;
    className?: string;
}

export const MachineConfigurationZone: React.FC<MachineConfigurationZoneProps> = ({
    trays,
    onTrayPositionChange,
    children,
    className = ""
}) => {
    const { scaledValue, scale } = useScaling();
    const { selectedConfiguration, setSelectedConfiguration } = useConfig();
    const { selectedCompany } = useCompany();
    
    const [dropTargetDot, setDropTargetDot] = React.useState<number | null>(null);
    const lastReportedDotRef = React.useRef<number | null>(null);
    
    const [{ isOver, canDrop, draggedItem }, drop] = useDrop({
        accept: 'TRAY_POSITION',
        drop: (item: DragItem, monitor) => {
            const clientOffset = monitor.getClientOffset();
            const containerRect = divRef.current?.getBoundingClientRect();
            if (clientOffset && containerRect) {
                // Convert from top-based client coordinates to bottom-based container coordinates
                const relativeY = clientOffset.y - containerRect.top;
                const containerBottomY = containerRect.height - relativeY;
                // Convert back to unscaled coordinates for data storage
                const unscaledY = containerBottomY / scale;
                const trayId = item.trayId ?? item.tray?.id;
                if (trayId != null) {
                    const newDot = Math.max(1, Math.min(getYPositionDot(unscaledY), ConfigurationConstants.DOTS));
                    const bottomY = getDotYPosition(newDot);
                    console.log(`[DND] Drop for tray ${trayId} at dot=${newDot} (unscaledY=${unscaledY})`);
                    onTrayPositionChange(Number(selectedCompany?.id), Number(selectedConfiguration?.id), trayId, bottomY);
                } else {
                    console.warn('[DND] Drop item missing trayId');
                }
            }
            lastReportedDotRef.current = null;
            setDropTargetDot(null);
            return { dropped: true };
        },
        hover: (item: DragItem, monitor) => {
            const clientOffset = monitor.getClientOffset();
            const containerRect = divRef.current?.getBoundingClientRect();
            if (clientOffset && containerRect) {
                // Convert from top-based client coordinates to bottom-based container coordinates
                const relativeY = clientOffset.y - containerRect.top;
                const containerBottomY = containerRect.height - relativeY;
                // Convert back to unscaled coordinates for data storage
                const unscaledY = containerBottomY / scale;
                const trayId = item.trayId ?? item.tray?.id;
                if (trayId != null) {
                    onTrayPositionChange(
                        Number(selectedCompany?.id),
                        Number(selectedConfiguration?.id),
                        trayId,
                        unscaledY
                    );
                }
                const newDot = getYPositionDot(unscaledY);
                const clampedDot = Math.max(1, Math.min(newDot, ConfigurationConstants.DOTS));
                if (lastReportedDotRef.current !== clampedDot) {
                    lastReportedDotRef.current = clampedDot;
                    const trayId = item.trayId ?? item.tray?.id;
                    if (trayId != null) {
                        const bottomY = getDotYPosition(clampedDot);
                        onTrayPositionChange(
                            Number(selectedCompany?.id),
                            Number(selectedConfiguration?.id),
                            trayId,
                            bottomY
                        );
                    }
                }
                setDropTargetDot(clampedDot);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            draggedItem: monitor.getItem()
        })
    });

    // Calculate scaled machine dimensions
    const machineHeight = selectedConfiguration?.configurationTypeData?.configHeight 
        ? scaledValue(selectedConfiguration.configurationTypeData.configHeight)
        : selectedConfiguration ? scaledValue(ConfigurationConstants.MACHINE_HEIGHT) : scaledValue(400); // Default height when no config
    
    // Local dot position function using dynamic dotsDelta
    const getLocalDotYPosition = (dotNumber: number): number => {
        const dotsDelta = selectedConfiguration?.configurationTypeData?.dotsDelta 
            ? selectedConfiguration.configurationTypeData.dotsDelta / 10 // Assuming it's stored in 0.1mm units
            : ConfigurationConstants.DOT_DELTA;
        return (dotNumber - 1) * dotsDelta;
    };

    // Scaled dot position function
    const getScaledDotYPosition = (dotNumber: number): number => {
        return scaledValue(getLocalDotYPosition(dotNumber));
    };

    // Use a callback ref to attach the drop target
    const divRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (divRef.current) {
            drop(divRef.current);
        }
    }, [drop]);

    // Clear drop target when not hovering
    React.useEffect(() => {
        if (!isOver) {
            lastReportedDotRef.current = null;
            setDropTargetDot(null);
        }
    }, [isOver]);

    // Helper function to check if a dot is occupied by a tray
    const isDotOccupied = (dotNumber: number): boolean => {
        const dotsDelta = selectedConfiguration?.configurationTypeData?.dotsDelta 
            ? selectedConfiguration.configurationTypeData.dotsDelta / 10 
            : ConfigurationConstants.DOT_DELTA;
        return trays.some(tray => {
            const trayBottomDot = tray.dotPosition;
            const trayTopDot = trayBottomDot + Math.ceil(tray.trayHeight / dotsDelta) - 1;
            return dotNumber >= trayBottomDot && dotNumber <= trayTopDot;
        });
    };

    // Helper function to check if a dot is the attachment point (bottom) of a tray
    const isDotAttachmentPoint = (dotNumber: number): boolean => {
        return trays.some(tray => tray.dotPosition === dotNumber);
    };

    // Helper function to get elevator indicators
    const getElevatorIndicators = (dotNumber: number): number => {
        const elevatorDots = selectedConfiguration?.configurationTypeData?.elevatorDotIndicators || [];
        const n = elevatorDots.length;
        const index = elevatorDots.indexOf(dotNumber);
        if (index >= 0) {
            return Math.min(index + 1, n - index);
        }
        return 0;
    };

    // Helper function to check if dot should be double (every 10 starting from 3)
    const isDoubleDot = (dotNumber: number): boolean => {
        return selectedConfiguration?.configurationTypeData?.doubleDotPositions?.includes(dotNumber) || false;
    };

    // Calculate gaps between trays for red numbers
    const getGapNumbers = (): { dotNumber: number; gap: number }[] => {
        const dotsDelta = selectedConfiguration?.configurationTypeData?.dotsDelta 
            ? selectedConfiguration.configurationTypeData.dotsDelta / 10 
            : ConfigurationConstants.DOT_DELTA;
        const amountDots = selectedConfiguration?.configurationTypeData?.amountDots || ConfigurationConstants.DOTS;
        const sortedTrays = [...trays].sort((a, b) => a.dotPosition - b.dotPosition);
        const gaps: { dotNumber: number; gap: number }[] = [];
        
        // Gap from top (amountDots) to first tray
        if (sortedTrays.length > 0) {
            const firstTrayTop = sortedTrays[trays.length - 1].dotPosition;
            const gapFromTop = amountDots - firstTrayTop;
            if (gapFromTop > 0) {
                gaps.push({ dotNumber: amountDots, gap: gapFromTop });
            }
        }
        
        // Gaps between trays
        for (let i = 0; i < sortedTrays.length - 1; i++) {
            const currentTrayTop = sortedTrays[i].dotPosition;
            const nextTrayBottom = sortedTrays[i + 1].dotPosition;
            const gap = nextTrayBottom - currentTrayTop - 2;
            if (gap > 0) {
                gaps.push({ dotNumber: currentTrayTop + Math.floor(gap / 2), gap });
            }
        }
        
        return gaps;
    };

    return (
        <div className="flex" id="machine-configuration-zone">
            {/* Left side: Dot indicators */}
            <div 
                className={`relative bg-gray-100 ${selectedConfiguration?.configurationTypeData ? 'flex-shrink-0 border-r-2 border-black' : 'flex-shrink-0'}`}
                style={{ 
                    width: selectedConfiguration?.configurationTypeData ? `${scaledValue(60)}px` : `${scaledValue(740)}px`, 
                    height: `${machineHeight}px` 
                }}
            >
                {selectedConfiguration?.configurationTypeData?.amountDots ? Array.from({ length: Number(selectedConfiguration.configurationTypeData.amountDots) }, (_, i) => {
                    const dotNumber = i + 1;
                    const yPosition = getScaledDotYPosition(dotNumber);
                    const isOccupied = isDotOccupied(dotNumber);
                    const isAttachmentPoint = isDotAttachmentPoint(dotNumber);
                    const elevatorCount = getElevatorIndicators(dotNumber);
                    const isDouble = isDoubleDot(dotNumber);
                    
                    // Determine dot color and size based on status
                    let dotColor = 'bg-black'; // Default
                    let dotSize = 'w-2 h-2'; // Default size (8px)
                    let dotOffset = ''; // Default positioning
                    if (isAttachmentPoint) {
                        dotColor = 'bg-red-500'; // Red for attachment point (more prominent)
                        dotSize = 'w-2.5 h-2.5'; // 1.1x size (10px vs 8px)
                        dotOffset = '-translate-x-0.5'; // Center the larger dot horizontally only
                    } else if (isOccupied) {
                        dotColor = 'bg-red-300'; // Light red for occupied range (less stressed)
                    }
                    
                    return (
                        <div key={dotNumber} className="absolute" style={{ bottom: `${yPosition}px`, left: `${scaledValue(10)}px` }}>
                            {/* Main dot */}
                            <div 
                                className={`${dotSize} rounded-full border ${dotColor} ${dotOffset}`}
                                title={`Dot ${dotNumber}${isAttachmentPoint ? ' (attachment point)' : isOccupied ? ' (occupied)' : ''}`}
                            />
                            
                            {/* Double dot indicator */}
                            {isDouble  && (
                                <div 
                                    className={`${dotSize} rounded-full border ${dotColor} absolute ${dotOffset}`}
                                    style={{ left: `${scaledValue(10)}px`, top: '0px' }}
                                />
                            )}
                            
                            {/* Elevator indicators (yellow dots) */}
                            {elevatorCount > 0 && (
                                <div className="absolute" style={{ left: `${scaledValue(20)}px`, top: '0px' }}>
                                    {Array.from({ length: elevatorCount }, (_, idx) => (
                                        <div
                                            key={idx}
                                            className="w-2 h-2 rounded-full bg-yellow-400 border border-yellow-600 absolute"
                                            style={{ left: `${scaledValue(idx * 6)}px`, top: '0px' }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-500 text-lg font-medium text-center">Geen Configuratie Geselecteerd</span>
                    </div>
                )}
                
                {/* Gap numbers (red) */}
                {selectedConfiguration && getGapNumbers().map(({ dotNumber, gap }, index) => (
                    <div 
                        key={index}
                        className="absolute text-red-600 font-bold text-xs"
                        style={{ 
                            bottom: `${getScaledDotYPosition(dotNumber)}px`, 
                            left: `${scaledValue(35)}px`,
                            transform: 'translateY(50%)'
                        }}
                    >
                        {gap}
                    </div>
                ))}
            </div>

            {/* Right side: Machine area with black border - only show when configuration is loaded */}
            {selectedConfiguration?.configurationTypeData ? (
                <div 
                    ref={divRef}
                    className={`
                        relative border-2 border-black bg-gray-50
                        ${isOver ? (canDrop ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : ''}
                        ${className}
                    `}
                    style={{
                        width: `${scaledValue(Number(selectedConfiguration.configurationTypeData.trayWidth + 60))}px`, // Scaled machine area width
                        height: `${machineHeight}px`,
                        paddingLeft: `${0}px`, // Increased padding for centering
                        paddingRight: `${0}px` // Increased padding for centering
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
                                {(() => {
                                    const name = (draggedItem as DragItem)?.tray?.name;
                                    const id = (draggedItem as DragItem)?.trayId ?? (draggedItem as DragItem)?.tray?.id;
                                    return `Moving ${name ?? `Tray ${id}`}`;
                                })()}
                            </div>
                            {!canDrop && (
                                <div className="text-xs text-red-500 mt-1">
                                    Position blocked or out of bounds
                                </div>
                            )}
                        </div>
                    )}

                    {/* Drop target indicator */}
                    {dropTargetDot && (
                        <div 
                            className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-50 rounded pointer-events-none z-10"
                            style={{
                                bottom: `${getScaledDotYPosition(dropTargetDot)}px`,
                                left: '10px',
                                right: '10px',
                                height: '20px'
                            }}
                        >
                            <div className="absolute -top-6 left-0 text-blue-700 text-xs font-medium">
                                Drop at Dot {dropTargetDot}
                            </div>
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
            ) : null}
        </div>
    );
};