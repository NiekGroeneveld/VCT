import { useCallback, useEffect } from 'react';
import { Tray } from '../types/tray.types';
import { TrayPositionService } from '../services/TrayPositionService';

/**
 * Hook that manages persistent collision detection for all trays
 * Automatically updates collision status when trays change
 */
export const useCollisionDetection = (
    trays: Tray[],
    setTrays: (trays: Tray[] | ((prev: Tray[]) => Tray[])) => void
) => {
    /**
     * Updates collision status for all trays
     */
    const updateCollisionStatus = useCallback(() => {
        setTrays(prev => {
            const updatedTrays = TrayPositionService.updateCollisionStatus(prev);
            
            // Only update if there are actual changes to avoid infinite loops
            const hasChanges = updatedTrays.some((tray, index) => 
                tray.hasCollision !== prev[index]?.hasCollision
            );
            
            if (hasChanges) {
                console.log('Collision status updated:', updatedTrays.map(t => ({ 
                    id: t.id, 
                    hasCollision: t.hasCollision,
                    position: t.dotPosition,
                    height: t.height
                })));
            }
            
            return hasChanges ? updatedTrays : prev;
        });
    }, [setTrays]);

    /**
     * Force recalculation of collision status
     */
    const recalculateCollisions = useCallback(() => {
        updateCollisionStatus();
    }, [updateCollisionStatus]);

    // Auto-update collision status whenever trays change
    useEffect(() => {
        updateCollisionStatus();
    }, [trays.length, ...trays.map(t => `${t.id}-${t.dotPosition}-${t.height}`)]);

    return {
        recalculateCollisions
    };
};
