import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
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

    const handleAddTray = () => {
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
    };

    return (
        <div className="bg-gray-100 rounded-lg border-2 border-gray-300">
            {/* Header - matching ProductList style */}
            <div className="bg-white rounded-t-lg border-b border-gray-300">
                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Configuratie</h3>
                    <button
                        onClick={handleAddTray}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md flex items-center gap-2 transition-colors text-sm"
                    >
                        <Plus size={16} />
                        <span>Add Tray</span>
                    </button>
                </div>
            </div>
            
            {/* Configuration Zone */}
            <div className="p-4">
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
                            onProductMoveBetweenTrays={handleProductMoveBetweenTrays}                        style={{
                            position: 'absolute',
                            bottom: `${getDotYPosition(tray.dotPosition || 1)}px`,
                            left: '20px',
                            width: `${tray.width}px`,
                            height: `${tray.height}px`,
                            zIndex: tray.isDragging ? 40 : 1
                        }}
                        />
                    ))}
                </MachineConfigurationZone>
            </div>
        </div>
    );
};