import React, { useState } from 'react';
import { Tray, TrayConstants } from '../../types/tray.types';
import { getDotYPosition } from '../../types/configuration.types';
import { useTrayDragDrop } from '../../hooks/useTrayDragDrop';
import { MachineConfigurationZone } from './MachineConfigurationZone';
import { DraggableTrayWrapper } from './Tray/DraggableTrayWrapper';

export const ConfigurationArea: React.FC = () => {
    // Initialize with sample trays using proper constants:
    // - DEFAULT_TRAY_WIDTH: 640mm (fixed width, not adjustable)
    // - MINIMAL_TRAY_HEIGHT: 124mm (minimum height, can grow with products)
    const [trays, setTrays] = useState<Tray[]>([
        {
            id: 1,
            name: "Tray 1",
            dotPosition: 5,
            height: TrayConstants.MINIMAL_TRAY_HEIGHT,
            width: TrayConstants.DEFAULT_TRAY_WIDTH,
            products: []
        },
        {
            id: 2,
            name: "Tray 2", 
            dotPosition: 20,
            height: TrayConstants.MINIMAL_TRAY_HEIGHT,
            width: TrayConstants.DEFAULT_TRAY_WIDTH,
            products: []
        },
        {
            id: 3,
            name: "Tray 3",
            dotPosition: 35,
            height: TrayConstants.MINIMAL_TRAY_HEIGHT,
            width: TrayConstants.DEFAULT_TRAY_WIDTH,
            products: []
        }
    ]);
    
    const {
        startTrayDrag,
        updateTrayPosition,
        endTrayDrag,
        getDragFeedback
    } = useTrayDragDrop(trays, setTrays);

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
                            style={{
                                position: 'absolute',
                                bottom: `${getDotYPosition(tray.dotPosition || 1)}px`, // Direct mm positioning
                                left: '20px',
                                width: `${tray.width}px`, // Direct mm width
                                height: `${tray.height}px`, // Direct mm height
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
                                dotPosition: trays.length > 0 ? Math.max(...trays.map(t => t.dotPosition || 1)) + 10 : 1,
                                height: TrayConstants.MINIMAL_TRAY_HEIGHT,
                                width: TrayConstants.DEFAULT_TRAY_WIDTH,
                                products: []
                            };
                            setTrays(prev => [...prev, newTray]);
                        }}
                        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Add New Tray
                    </button>
                </div>
            </div>
        </div>
    );
};