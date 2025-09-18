import React, { useState, useEffect, useCallback } from 'react';
import { Tray, TrayConstants } from '../../tray-management/types/tray.types';
import { getDotYPosition, ConfigurationConstants } from '../types/configuration.types';
import { DraggableTrayWrapper } from '../../tray-management/components/DraggableTrayWrapper';
import { useScaling } from '../../../hooks/useScaling';
import { useConfig } from '../../../Context/useConfig';
import { useCompany } from '../../../Context/useCompany';
import { MachineConfigurationZone } from './MachineConfigurationZone';
import { useTrayDragDrop } from '../../../domains/tray-management/hooks/useTrayDragDrop';


export const ConfigurationArea: React.FC = () => {
    const { selectedConfiguration, setSelectedConfiguration } = useConfig();
    const { scaledValue } = useScaling();
    const { selectedCompany } = useCompany();
    const [trays, setTrays] = useState<Tray[]>([]);

    // Update trays when selectedConfiguration changes
    useEffect(() => {
        if (selectedConfiguration && Array.isArray(selectedConfiguration.trays)) {
            setTrays(selectedConfiguration.trays);
        } else {
            setTrays([]);
        }
    }, [selectedConfiguration]);      


    const {
        startTrayDrag,
        updateTrayPosition,
        endTrayDrag,
        getDragFeedback
    } = useTrayDragDrop(trays, setTrays)
   
    return (
        <div className="bg-gray-100 rounded-lg border-2 border-gray-300">
            <div className="bg-white rounded-t-lg border-b border-gray-300">
                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Configuratie</h3>
                </div>
            </div>
            <div className="p-4">
                <MachineConfigurationZone trays={trays} onTrayPositionChange={() => {}}>
                    {trays && trays.length > 0 ? (
                        trays.map((tray: Tray) => (
                            <DraggableTrayWrapper
                                key={tray.id}
                                tray={tray}
                                onUpdate={() => {}} 
                                onRemove={() => {}}
                                onDragStart={startTrayDrag}
                                onDragEnd={endTrayDrag}
                                onDragUpdate={updateTrayPosition}
                                onProductMoveBetweenTrays={() => {}}
                                style={{
                                    position: 'absolute',
                                    bottom: `${scaledValue(getDotYPosition(tray.dotPosition || 1))}px`,
                                    left: `${scaledValue(10)}px`,
                                    width: `${scaledValue(tray.trayWidth)}px`,
                                    height: `${scaledValue(tray.trayHeight)}px`,
                                    zIndex: tray.isDragging ? 40 : 1
                                }}
                            />
                        ))
                    ) : (
                        <div className="text-gray-500 text-center">Geen trays gevonden in deze configuratie.</div>
                    )}
                </MachineConfigurationZone>
            </div>
        </div>
    );
};