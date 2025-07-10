import { useCallback, useState } from 'react';
import { Tray } from '../types/tray.types';
import { TrayPositionService } from '../services/TrayPositionService';
import { getYPositionDot, ConfigurationConstants } from '../types/configuration.types';

export const useTrayDragDrop = (
    trays: Tray[],
    setTrays: (trays: Tray[] | ((prev: Tray[]) => Tray[])) => void
) => {
    const [draggedTray, setDraggedTray] = useState<Tray | null>(null);

    /**
     * starts dragging a tray 
     * */
    const startTrayDrag = useCallback((tray: Tray) => {
        setDraggedTray(tray);
        setTrays(prev => prev.map(t =>
            t.id === tray.id
             ? {...t, isDragging: true, dragStartDot: t.dotPosition}
             : t

        ));
    }, [setTrays]);

    /**
     * Updates tray position while dragging
     * Now includes collision detection for visual feedback
     */
    const updateTrayPosition = useCallback((trayId: number, newYposition: number) => {
        // Convert screen Y to dot position using the same logic as getDotYPosition
        // Since dot 1 is at Y=0, dot 2 at Y=135, etc., we can directly convert
        const newDot = getYPositionDot(newYposition);
        const clampedDot = Math.max(1, Math.min(newDot, ConfigurationConstants.DOTS));

        setTrays(prev => prev.map(tray => {
            if (tray.id !== trayId) return tray;
            
            // Check if this position is valid (for visual feedback)
            const otherTrays = prev.filter(t => t.id !== trayId);
            const validation = TrayPositionService.canPlaceTrayAtDot(tray, clampedDot, otherTrays);
            
            return {
                ...tray, 
                dotPosition: clampedDot,
                // Add a flag to indicate if current position is valid (for visual feedback)
                isValidPosition: validation.canPlace
            };
        }));
    }, [setTrays]);
         
    /**
     * Ends dragging a tray and validates the new position
     */
    const endTrayDrag = useCallback((trayId: number, finalYPosition: number) => {
        // Convert screen Y to dot position using the same logic as updateTrayPosition
        const targetDot = getYPositionDot(finalYPosition);
        const clampedDot = Math.max(1, Math.min(targetDot, ConfigurationConstants.DOTS));
        
        const tray = trays.find(t => t.id === trayId);

        if(!tray) {
            console.warn(`Tray with ID ${trayId} not found`);
            return false;
        }

        const originalDot = tray.dragStartDot || tray.dotPosition;
        const otherTrays = trays.filter(t => t.id !== trayId);
        const validation = TrayPositionService.canPlaceTrayAtDot(tray, clampedDot, otherTrays);

        console.log(`Attempting to place tray ${trayId} at dot ${clampedDot}, validation:`, validation);

        if(validation.canPlace) {
            // Valid position - place the tray there
            setTrays(prev => prev.map(t =>
                t.id === trayId
                ? {...t, dotPosition: clampedDot, isDragging: false, dragStartDot: undefined, isValidPosition: true}
                : t
            ));
            setDraggedTray(null);
            console.log(`Tray ${trayId} successfully placed at dot ${clampedDot}`);
            return true;
        } else {
            // Invalid position - allow placement but collision detection will mark it as colliding
            console.log(`Allowing placement of tray ${trayId} at dot ${clampedDot} - collision will be detected`);
            
            setTrays(prev => prev.map(t =>
                t.id === trayId
                ? {...t, dotPosition: clampedDot, isDragging: false, dragStartDot: undefined, isValidPosition: true}
                : t
            ));
            setDraggedTray(null);
            return true;
        }
    }, [setTrays, trays]);

    return {
        startTrayDrag,
        updateTrayPosition,
        endTrayDrag,
        getDragFeedback: () => draggedTray
    };
};
