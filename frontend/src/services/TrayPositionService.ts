import {Tray} from '../types/tray.types';
import { ConfigurationConstants, getDotYPosition } from '../types/configuration.types';

export class TrayPositionService {
    /**
     * Validates if a tray can be placed at a speicfic dot position
     */

    static canPlaceTrayAtDot(
        tray: Tray,
        targetDot: number,
        existingTrays: Tray[]
    ) : {canPlace: boolean, error?: string}{
        //check bounds
        if (targetDot < 1 || targetDot > ConfigurationConstants.DOTS) {
            return {
                canPlace: false,
                error: `Dot position ${targetDot} is out of bounds (1-${ConfigurationConstants.DOTS})`
            }
        }

        //Check top space constraints
        const trayTopPosition = getDotYPosition(targetDot) + tray.height;
        const maxAllowedHeight = ConfigurationConstants.MACHINE_HEIGHT

        if(trayTopPosition > maxAllowedHeight) {
            return {
                canPlace: false,
                error: `Tray exceeds machine height at dot ${targetDot} (max: ${maxAllowedHeight}mm)`
            }
        }

        //Check collision with other trays
        const trayBottomDot = targetDot;
        const trayTopDot = this.calculateTopDotForTray(tray, targetDot);

        for(const existingTray of existingTrays){
            if (existingTray.id === tray.id) continue; // Skip self-collision

            const otherBottomDot = existingTray.dotPosition;
            const otherTopDot = this.calculateTopDotForTray(existingTray, existingTray.dotPosition);

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
     */
    static calculateTopDotForTray(tray: Tray, targetDot: number): number {
        const bottomY = getDotYPosition(targetDot);
        const topY = bottomY + tray.height;
        return Math.ceil(topY / ConfigurationConstants.DOT_DELTA);
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
        existingTrays: Tray[]
    ) : number | null {
        //Try exact position first
        if (this.canPlaceTrayAtDot(tray, targetDot, existingTrays).canPlace){
            return targetDot;
        }

        //Search nearby positions
        for (let offset = 1; offset < ConfigurationConstants.DOTS; offset++){
            //Try below
            const belowDot = targetDot - offset
            if (belowDot >= 1 && this.canPlaceTrayAtDot(tray, belowDot, existingTrays).canPlace){
                return belowDot;
            }

            //Try above
            const aboveDot = targetDot + offset;
            if (aboveDot <= ConfigurationConstants.DOTS && this.canPlaceTrayAtDot(tray, aboveDot, existingTrays).canPlace){
                return aboveDot;
            }
        }

        return null; // No valid position found
    }

    /**
     * Gets all occupied dots ranges
     */

    static getOccupiedDotRanges(trays: Tray[]): Array<{trayId: number; bottomDot: number; topDot: number}> {
        return trays.map(tray => {
            const bottomDot = tray.dotPosition;
            const topDot = this.calculateTopDotForTray(tray, bottomDot);
            return { trayId: tray.id, bottomDot, topDot };
        });
    }


}