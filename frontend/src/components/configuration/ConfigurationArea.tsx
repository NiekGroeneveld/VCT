import React, { useState, useEffect } from 'react';
import { Tray, TrayConstants } from '../../types/tray.types';
import { getDotYPosition } from '../../types/configuration.types';
import { useTrayDragDrop } from '../../hooks/useTrayDragDrop';
import { useCrossTrayOperations } from '../../hooks/useCrossTrayOperations'; // ADD THIS IMPORT
import { MachineConfigurationZone } from './MachineConfigurationZone';
import { DraggableTrayWrapper } from './Tray/DraggableTrayWrapper';

export const ConfigurationArea: React.FC = () => {
    // Initialize with sample trays
    const [trays, setTrays] = useState<Tray[]>([]);
    
    // Hook for tray positioning (existing)
    const {
        startTrayDrag,
        updateTrayPosition,
        endTrayDrag,
        getDragFeedback
    } = useTrayDragDrop(trays, setTrays);

    // ADD THIS: Hook for cross-tray product operations
    const { handleProductMoveBetweenTrays, moveProductBetweenTrays } = useCrossTrayOperations(trays, setTrays);

    // ADD THIS: Event listener for cross-tray moves
    useEffect(() => {
        const handleCrossTrayRequest = (event: any) => {
            const { sourceTrayId, targetTrayId, sourceIndex, targetIndex } = event.detail;
            moveProductBetweenTrays(sourceTrayId, targetTrayId, sourceIndex, targetIndex);
        };
        
        window.addEventListener('requestCrossTrayMove', handleCrossTrayRequest);
        return () => window.removeEventListener('requestCrossTrayMove', handleCrossTrayRequest);
    }, [moveProductBetweenTrays]);

    return (
        <div className="flex space-x-6">
            {/* Machine Configuration Zone with draggable trays */}
            <div className="flex-1">
                <MachineConfigurationZone
                    trays={trays}
                    onTrayPositionChange={updateTrayPosition}
                >
                    {/* Render positioned draggable trays */}
                    {trays.map((tray: Tray) => (
                        <DraggableTrayWrapper
                            key={tray.id}
                            tray={tray}
                            onUpdate={(updatedTray) => {
                                setTrays(prev => prev.map(t => 
                                    t.id === updatedTray.id ? updatedTray : t
                                ));
                            }}
                            onRemove={() => {
                                setTrays(prev => prev.filter(t => t.id !== tray.id));
                            }}
                            onDragStart={startTrayDrag}
                            onDragEnd={endTrayDrag}
                            onDragUpdate={updateTrayPosition}
                            onProductMoveBetweenTrays={handleProductMoveBetweenTrays} // ADD THIS LINE
                            style={{
                                position: 'absolute',
                                bottom: `${getDotYPosition(tray.dotPosition || 1)}px`,
                                left: '20px',
                                width: `${tray.width}px`,
                                height: `${tray.height}px`,
                                zIndex: tray.isDragging ? 1000 : 1
                            }}
                        />
                    ))}
                </MachineConfigurationZone>
            </div>

            {/* Side Panel - Configuration Info */}
            <div className="w-80 flex-shrink-0">
                <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Tray Configuration</h3>
                    <div className="space-y-2">
                        {trays.map(tray => (
                            <div key={tray.id} className="text-sm p-2 bg-gray-50 rounded">
                                <div className="font-medium">{tray.name || `Tray ${tray.id}`}</div>
                                <div className="text-gray-500">
                                    Position: Dot {tray.dotPosition || 1}
                                </div>
                                <div className="text-gray-500">
                                    Dimensions: {tray.width}mm × {tray.height}mm
                                </div>
                                <div className="text-gray-500">
                                    Products: {tray.products?.length || 0}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Add Tray Button */}
                    <button
                        onClick={() => {
                            const newTray: Tray = {
                                id: Date.now(),
                                name: `Tray ${trays.length + 1}`,
                                dotPosition: trays.length > 0 ? 
                                    Math.max(...trays.map(t => t.dotPosition || 1)) + 10 : 1,
                                height: TrayConstants.MINIMAL_TRAY_HEIGHT,
                                width: TrayConstants.DEFAULT_TRAY_WIDTH,
                                products: []
                            };
                            setTrays(prev => [...prev, newTray]);
                        }}
                        className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add New Tray
                    </button>

                </div>
            </div>
        </div>
    );
};