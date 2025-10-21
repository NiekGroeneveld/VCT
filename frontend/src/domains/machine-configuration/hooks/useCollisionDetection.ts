import { useCallback, useEffect } from 'react';
import { Tray } from '../../tray-management/types/tray.types';
import { TrayPositionService } from '../services/TrayPositionService';
import { Configuration } from '../types/configuration.types';

/**
 * Hook that manages persistent collision detection for all trays
 * Automatically updates collision status when trays change
 */
export const useCollisionDetection = (
    trays: Tray[],
    setTrays: (trays: Tray[] | ((prev: Tray[]) => Tray[])) => void,
    configuration: Configuration | null
) => {
    /**
     * Updates collision status for all trays
     */
    const updateCollisionStatus = useCallback(() => {
        if (!configuration) {
            console.warn('[useCollisionDetection] No configuration provided, skipping collision detection');
            return;
        }
        
        setTrays(prev => {
            const updatedTrays = TrayPositionService.updateCollisionStatus(prev, configuration);
            
            // Only update if there are actual changes to avoid infinite loops
            const hasChanges = updatedTrays.some((tray: Tray, index: number) => 
                tray.hasCollision !== prev[index]?.hasCollision ||
                tray.isProhibitedPosition !== prev[index]?.isProhibitedPosition
            );
            
            if (hasChanges) {
                console.log('Collision and prohibited position status updated:', updatedTrays.map((t: Tray) => ({ 
                    id: t.id, 
                    hasCollision: t.hasCollision,
                    isProhibitedPosition: t.isProhibitedPosition,
                    position: t.dotPosition,
                    height: t.trayHeight
                })));
            }
            
            return hasChanges ? updatedTrays : prev;
        });
    }, [setTrays, configuration]);

    /**
     * Force recalculation of collision status
     */
    const recalculateCollisions = useCallback(() => {
        updateCollisionStatus();
    }, [updateCollisionStatus]);

    // Join tray info into a single string to keep dependency array stable
    const traySignature = trays.map(t => `${t.id}-${t.dotPosition}-${t.trayHeight}`).join('|');
    const elevatorSetting = configuration?.elevatorSetting ?? 0;
    
    useEffect(() => {
        updateCollisionStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [traySignature, elevatorSetting]);

    return {
        recalculateCollisions
    };
};
