import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Tray, TrayConstants } from '../../tray-management/types/tray.types';
import { getDotYPosition, ConfigurationConstants } from '../types/configuration.types';
import { useTrayDragDrop } from '../../tray-management/hooks/useTrayDragDrop';
import { useCrossTrayOperations } from '../../tray-management/hooks/useCrossTrayOperations';
import { useCollisionDetection } from '../hooks/useCollisionDetection';
import { TrayPositionService } from '../services/TrayPositionService';
import { MachineConfigurationZone } from './MachineConfigurationZone';
import { DraggableTrayWrapper } from '../../tray-management/components/DraggableTrayWrapper';
import { useScaling } from '../../../hooks/useScaling';

export const ConfigurationArea: React.FC = () => {
    // Initialize with sample trays
    const [trays, setTrays] = useState<Tray[]>([]);
    const { scaledValue } = useScaling();
    
    // Hook for tray positioning (existing)
    const {
        startTrayDrag,
        updateTrayPosition,
        endTrayDrag,
        getDragFeedback,
    } = useTrayDragDrop(trays, setTrays);

    // Hook for collision detection
    const { recalculateCollisions } = useCollisionDetection(trays, setTrays);

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
        // Find the first available position for the new tray
        const newTray: Tray = {
            id: Date.now(),
            name: `Tray ${trays.length + 1}`,
            dotPosition: 1, // Temporary position
            height: TrayConstants.MINIMAL_TRAY_HEIGHT,
            width: TrayConstants.DEFAULT_TRAY_WIDTH,
            products: []
        };

        // Find a valid position for the new tray
        let validDot = 1;
        const existingTrays = trays;
        
        // Try to find the first available position starting from dot 1
        for (let dot = 1; dot <= ConfigurationConstants.DOTS; dot++) {
            const tempTray = { ...newTray, dotPosition: dot };
            const validation = TrayPositionService.canPlaceTrayAtDot(tempTray, dot, existingTrays);
            if (validation.canPlace) {
                validDot = dot;
                break;
            }
        }

        // Create the tray with the valid position
        const finalTray = { ...newTray, dotPosition: validDot };
        setTrays(prev => [...prev, finalTray]);
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
                        <span>Lade Toevoegen</span>
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
                                // Trigger collision recalculation after tray update
                                setTimeout(() => recalculateCollisions(), 0);
                            }}
                            onRemove={() => {
                                setTrays(prev => prev.filter(t => t.id !== tray.id));
                            }}
                            onDragStart={startTrayDrag}
                            onDragEnd={endTrayDrag}
                            onDragUpdate={updateTrayPosition}
                            onProductMoveBetweenTrays={handleProductMoveBetweenTrays}
                            style={{
                                position: 'absolute',
                                bottom: `${scaledValue(getDotYPosition(tray.dotPosition || 1))}px`,
                                left: `${scaledValue(10)}px`, // Match the new machine area padding
                                width: `${scaledValue(tray.width)}px`,
                                height: `${scaledValue(tray.height)}px`,
                                zIndex: tray.isDragging ? 40 : 1
                            }}
                        />
                    ))}
                </MachineConfigurationZone>
            </div>
        </div>
    );
};