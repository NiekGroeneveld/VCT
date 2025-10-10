import {Tray} from '../../tray-management/types/tray.types';
import { Configuration, ConfigurationConstants, getDotYPosition, ConfigurationConstantsService } from '../types/configuration.types';

export class TrayPositionService {
    /**
     * Validates if a tray can be placed at a specific dot position
     * @param tray - The tray to validate
     * @param targetDot - The target dot position
     * @param existingTrays - Array of existing trays to check for collisions
     * @param configuration - The current configuration with type data
     */

    static canPlaceTrayAtDot(
        tray: Tray,
        targetDot: number,
        existingTrays: Tray[],
        configuration: Configuration
    ) : {canPlace: boolean, error?: string}{
        // Get configuration-specific values
        const amountDots = ConfigurationConstantsService.getAmountDots(configuration);
        const dotsDelta = ConfigurationConstantsService.getDotsDelta(configuration);
        const machineHeight = ConfigurationConstantsService.getMachineHeight(configuration);

        //check bounds
        if (targetDot < 1 || targetDot > amountDots) {
            return {
                canPlace: false,
                error: `Dot position ${targetDot} is out of bounds (1-${amountDots})`
            }
        }

        //Check top space constraints
        const trayBottomY = (targetDot - 1) * dotsDelta;
        const trayTopPosition = trayBottomY + tray.trayHeight;

        if(trayTopPosition > machineHeight) {
            return {
                canPlace: false,
                error: `Tray exceeds machine height at dot ${targetDot} (max: ${machineHeight}mm)`
            }
        }

        //Check collision with other trays
        const trayBottomDot = targetDot;
        const trayTopDot = this.calculateTopDotForTray(tray, targetDot, configuration);

        for(const existingTray of existingTrays){
            if (existingTray.id === tray.id) continue; // Skip self-collision

            const otherBottomDot = existingTray.dotPosition;
            const otherTopDot = this.calculateTopDotForTray(existingTray, existingTray.dotPosition, configuration);

            //Check overlap
            if (this.doTraysOverlap(trayBottomDot, trayTopDot, otherBottomDot, otherTopDot)) {
                return {
                    canPlace: false,
                    error: `Tray overlaps with existing tray at dot ${existingTray.dotPosition}`
                }
            }
        }
        return {
            canPlace: true}


    }

    /**
     * Calculates which dot the top of the tray reaches
     * @param tray - The tray to calculate for
     * @param targetDot - The bottom dot position of the tray
     * @param configuration - The current configuration with type data
     */
    static calculateTopDotForTray(tray: Tray, targetDot: number, configuration: Configuration): number {
        const dotsDelta = ConfigurationConstantsService.getDotsDelta(configuration);
        const bottomY = (targetDot - 1) * dotsDelta;
        const topY = bottomY + tray.trayHeight;
        return Math.ceil(topY / dotsDelta);
    }

    /**
     * Check if two trays overlap based on their dot positions
     */
    static doTraysOverlap(
        tray1BottomDot: number,
        tray1TopDot: number,
        tray2BottomDot: number,
        tray2TopDot: number
    ): boolean {
        return !(tray1TopDot < tray2BottomDot || tray2TopDot < tray1BottomDot);
    }

    /**
     * Finds the nearest valid dot position for a tray
     */
    static findNearestValidDot(
        tray: Tray,
        targetDot: number,
        existingTrays: Tray[],
        configuration: Configuration
    ) : number | null {
        //Try exact position first
        if (this.canPlaceTrayAtDot(tray, targetDot, existingTrays, configuration).canPlace){
            return targetDot;
        }

        //Search nearby positions
        for (let offset = 1; offset < ConfigurationConstants.DOTS; offset++){
            //Try below
            const belowDot = targetDot - offset
            if (belowDot >= 1 && this.canPlaceTrayAtDot(tray, belowDot, existingTrays, configuration).canPlace){
                return belowDot;
            }

            //Try above
            const aboveDot = targetDot + offset;
            if (aboveDot <= ConfigurationConstants.DOTS && this.canPlaceTrayAtDot(tray, aboveDot, existingTrays, configuration).canPlace){
                return aboveDot;
            }
        }

        return null; // No valid position found
    }

    /**
     * Gets all occupied dots ranges
     */

    static getOccupiedDotRanges(trays: Tray[], configuration: Configuration): Array<{trayId: number; bottomDot: number; topDot: number}> {
        return trays.map(tray => {
            const bottomDot = tray.dotPosition;
            const topDot = this.calculateTopDotForTray(tray, bottomDot, configuration);
            return { trayId: tray.id, bottomDot, topDot };
        });
    }

    /**
     * Detects all collisions between trays and returns IDs of colliding trays
     */
    static detectCollisions(trays: Tray[], configuration: Configuration): Set<number> {
        const collidingTrayIds = new Set<number>();
        
        // Check every tray against every other tray
        for (let i = 0; i < trays.length; i++) {
            for (let j = i + 1; j < trays.length; j++) {
                const tray1 = trays[i];
                const tray2 = trays[j];
                
                const tray1BottomDot = tray1.dotPosition;
                const tray1TopDot = this.calculateTopDotForTray(tray1, tray1BottomDot, configuration);
                const tray2BottomDot = tray2.dotPosition;
                const tray2TopDot = this.calculateTopDotForTray(tray2, tray2BottomDot, configuration);

                // Check if trays overlap
                if (this.doTraysOverlap(tray1BottomDot, tray1TopDot, tray2BottomDot, tray2TopDot)) {
                    collidingTrayIds.add(tray1.id);
                    collidingTrayIds.add(tray2.id);
                }
            }
        }
        
        return collidingTrayIds;
    }

    /**
     * Updates collision status for all trays
     */
    static updateCollisionStatus(trays: Tray[], configuration: Configuration): Tray[] {
        const collidingTrayIds = this.detectCollisions(trays, configuration);

        return trays.map(tray => ({
            ...tray,
            hasCollision: collidingTrayIds.has(tray.id)
        }));
    }


}