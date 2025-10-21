
import React from 'react';
import { useDrop } from 'react-dnd';
import { Tray } from '../../tray-management/types/tray.types';
import { ConfigurationConstants, getDotYPosition, getYPositionDot, DragItem, ConfigurationConstantsService } from '../types/configuration.types';
import { useScaling } from '../../../hooks/useScaling';
import { useCompany } from '../../../Context/useCompany';
import { useConfig } from '../../../Context/useConfig';
import { configurationService } from '../services/ConfigurationService';

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
    
    // Use refs to avoid stale closures in useDrop callbacks
    const selectedCompanyRef = React.useRef(selectedCompany);
    const selectedConfigurationRef = React.useRef(selectedConfiguration);
    const scaleRef = React.useRef(scale);
    const onTrayPositionChangeRef = React.useRef(onTrayPositionChange);
    
    // Reset state when company or configuration changes
    React.useEffect(() => {
        selectedCompanyRef.current = selectedCompany;
        selectedConfigurationRef.current = selectedConfiguration;
        scaleRef.current = scale;
        onTrayPositionChangeRef.current = onTrayPositionChange;
        
        // Clear any ongoing drag state when company/config changes
        lastReportedDotRef.current = null;
        setDropTargetDot(null);
    }, [selectedCompany, selectedConfiguration, scale, onTrayPositionChange]);
    
    // Memoize the drop spec to prevent recreation
    const dropSpec = React.useMemo(() => ({
        accept: 'TRAY_POSITION',
        canDrop: () => {
            console.log('[MachineConfigurationZone] canDrop check - returning true');
            return true;
        },
        drop: (item: DragItem, monitor: any) => {
            console.log('[MachineConfigurationZone] Drop handler called!');
            const clientOffset = monitor.getClientOffset();
            const containerRect = divRef.current?.getBoundingClientRect();
            if (clientOffset && containerRect) {
                const currentConfig = selectedConfigurationRef.current;
                const currentCompany = selectedCompanyRef.current;
                const currentScale = scaleRef.current;
                
                if(!currentConfig || !currentCompany){
                    console.error("[MachineConfigurationZone] No configuration or company selected during drop");
                    return { dropped: false };
                }
                
                
                // Convert from top-based client coordinates to bottom-based container coordinates
                const relativeY = clientOffset.y - containerRect.top;
                const containerBottomY = containerRect.height - relativeY;
                // Convert back to unscaled coordinates for data storage
                const unscaledY = containerBottomY / currentScale;
                const trayId = item.trayId ?? item.tray?.id;
                if (trayId != null) {
                    const newDot = Math.max(1, Math.min(getYPositionDot(unscaledY), ConfigurationConstantsService.getAmountDots(currentConfig)));
                    const bottomY = getDotYPosition(newDot);
                    console.log(`[DND] Drop for tray ${trayId} at dot=${newDot} (unscaledY=${unscaledY})`);
                    onTrayPositionChangeRef.current(Number(currentCompany?.id), Number(currentConfig?.id), trayId, bottomY);
                } else {
                    console.warn('[DND] Drop item missing trayId');
                }
            }
            lastReportedDotRef.current = null;
            setDropTargetDot(null);
            return { dropped: true };
        },
        hover: (item: DragItem, monitor: any) => {
            if (!monitor.isOver({ shallow: true })) return; // Only handle when directly over this drop zone
            
            const clientOffset = monitor.getClientOffset();
            const containerRect = divRef.current?.getBoundingClientRect();
            if (clientOffset && containerRect) {
                const currentConfig = selectedConfigurationRef.current;
                const currentCompany = selectedCompanyRef.current;
                const currentScale = scaleRef.current;
                
                // Convert from top-based client coordinates to bottom-based container coordinates
                const relativeY = clientOffset.y - containerRect.top;
                const containerBottomY = containerRect.height - relativeY;
                // Convert back to unscaled coordinates for data storage
                const unscaledY = containerBottomY / currentScale;
                
                const newDot = getYPositionDot(unscaledY);
                if(!currentConfig){
                    console.error("[MachineConfigurationZone] No configuration selected during hover");
                    return;
                }
                const clampedDot = Math.max(1, Math.min(newDot, ConfigurationConstantsService.getAmountDots(currentConfig)));

                // Only update position when dot changes to avoid redundant updates
                if (lastReportedDotRef.current !== clampedDot) {
                    lastReportedDotRef.current = clampedDot;
                    const trayId = item.trayId ?? item.tray?.id;
                    if (trayId != null) {
                        const bottomY = getDotYPosition(clampedDot);
                        console.log(`[MachineConfigurationZone] Hover update: tray ${trayId} to dot ${clampedDot} (Y=${bottomY})`);
                        onTrayPositionChangeRef.current(
                            Number(currentCompany?.id),
                            Number(currentConfig?.id),
                            trayId,
                            bottomY
                        );
                    }
                }
                setDropTargetDot(clampedDot);
            }
        },
        collect: (monitor: any) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            draggedItem: monitor.getItem()
        })
    }), []); // Empty deps - all values from refs
    
    const [{ isOver, canDrop, draggedItem }, drop] = useDrop(dropSpec);

    // Calculate scaled machine dimensions
    const machineHeight = selectedConfiguration?.configurationTypeData?.configHeight 
        ? scaledValue(selectedConfiguration.configurationTypeData.configHeight)
        : selectedConfiguration ? scaledValue(ConfigurationConstantsService.getMachineHeight(selectedConfiguration)) : scaledValue(400); // Default height when no config
    
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

    // Keep a ref for getting bounding rect
    const divRef = React.useRef<HTMLDivElement>(null);
    
    // Use a callback ref to attach the drop target - this ensures it's always connected
    const dropRef = React.useCallback((node: HTMLDivElement | null) => {
        console.log('[MachineConfigurationZone] dropRef callback called, node:', node ? 'exists' : 'null');
        divRef.current = node;
        if (node) {
            drop(node);
            console.log('[MachineConfigurationZone] drop() connector called on node');
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
        const isOccupied = trays.some(tray => {
            const trayBottomDot = tray.dotPosition;
            const trayTopDot = trayBottomDot + Math.ceil(tray.trayHeight / dotsDelta) - 1;
            return dotNumber >= trayBottomDot && dotNumber <= trayTopDot;
        });
        return isOccupied;
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

    // Helper function to check if a dot is prohibited based on elevator setting
    const isDotProhibited = (dotNumber: number): boolean => {
        if (!selectedConfiguration?.elevatorSetting) return false; // Lift setting 1 or null - all dots allowed
        
        const elevatorSetting = selectedConfiguration.elevatorSetting;
        const elevatorDots = selectedConfiguration?.configurationTypeData?.elevatorDotIndicators || [];
        
        if (elevatorSetting === 1 || elevatorDots.length === 0) {
            return false; // All dots allowed for setting 1
        }
        
        // For settings 2, 3, 4: dots must be within the range defined by elevator indicators
        const lowerBound = elevatorDots[elevatorSetting - 1]; // e.g., elevatorDots[1] for setting 2
        const upperBound = elevatorDots[elevatorDots.length - elevatorSetting]; // e.g., elevatorDots[length-2] for setting 2
        
        // Dot is prohibited if it's outside the allowed range
        return dotNumber < lowerBound || dotNumber > upperBound;
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
                    const isProhibited = isDotProhibited(dotNumber);
                    
                    // Determine dot color and size based on status
                    let dotColor = 'bg-black'; // Default
                    let dotSize = 'w-2 h-2'; // Default size (8px)
                    let dotOffset = ''; // Default positioning
                    let dotOpacity = ''; // Default opacity
                    
                    if (isProhibited) {
                        dotColor = 'bg-gray-500'; // Light gray for prohibited dots
                        dotOpacity = 'opacity-50'; // Semi-transparent
                    } else if (isAttachmentPoint) {
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
                                className={`${dotSize} rounded-full border ${dotColor} ${dotOffset} ${dotOpacity}`}
                                title={`Dot ${dotNumber}${isProhibited ? ' (prohibited by lift setting)' : isAttachmentPoint ? ' (attachment point)' : isOccupied ? ' (occupied)' : ''}`}
                            />
                            
                            {/* Double dot indicator */}
                            {isDouble  && (
                                <div 
                                    className={`${dotSize} rounded-full border ${dotColor} absolute ${dotOffset} ${dotOpacity}`}
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
                    ref={dropRef}
                    className={`
                        relative border-2 border-black bg-gray-50
                        ${isOver ? (canDrop ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : ''}
                        ${className}
                    `}
                    style={{
                        width: `${scaledValue(Number(selectedConfiguration.configurationTypeData.trayWidth + 90))}px`, // Scaled machine area width
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