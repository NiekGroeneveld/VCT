
/*
unified drag item interface for react-dnd 
supports dragging both products and trays
*/

import { Product } from "./product.types";
import { Tray } from "./tray.types";


export interface DragItem{
    type: 'PRODUCT' | 'TRAY' | 'TRAY_PRODUCT' | 'TRAY_POSITION'; // Type of the item being dragged
    product?: Product; // Product details if the item is a product
    tray?: Tray; // Tray details if the item is a tray
    fromTray?: number;  //Source tray when moving between trays
    // Additional properties for cross-tray operations
    sourceIndex?: number; // Index in source tray for TRAY_PRODUCT moves
    sourceTrayId?: number; // Source tray ID for TRAY_PRODUCT moves
    // Legacy properties for backwards compatibility
    index?: number; // Legacy: same as sourceIndex
    trayId?: number; // Legacy: same as sourceTrayId
}

/**
 * Result of a succesful drop operation
 * Contains validation status and final position
 */

export interface DropResult{
    trayId: number; // ID of the tray where the item was dropped
    position: {
        x: number; // X coordinate of the drop position 
        y: number; // Y coordinate of the drop position
    };
    isValid: boolean; // Indicates if the drop was valid
    // Additional properties for cross-tray operations
    targetIndex?: number; // Target index for insertion
    operation?: 'add-product' | 'cross-tray-move' | 'reorder'; // Type of operation
}


/**
 * validation result of a drop operation
 * used for user guidance and error handling
 */
export interface ValidationResult{
    isValid: boolean; // Indicates if the drop is valid
    errors: string[];   //Critical issues
    warnings: string[]; // Non-critical issues
}

export const ConfigurationConstants = {
    DOTS : 72,                  //Total number of dots in the machine
    DOT_DELTA : 13.5,           // mm - Distance between dots
    TOP_SPACE: 272,             // mm - Space above the top dot
    get MACHINE_HEIGHT() { return this.DOT_DELTA * this.DOTS + this.TOP_SPACE; }, // mm - Total height: 13.5*72+200 = 1172mm
    TRAY_COLLISION_MARGIN: 10,  // mm - Margin for tray collision detection
}

export const getDotYPosition = (dotNumber: number): number => {
    //Dot 1 is at the bottom of the machine
    return (dotNumber - 1) * ConfigurationConstants.DOT_DELTA 
}

export const getYPositionDot = (yPosition: number): number => {
    return Math.round(yPosition / ConfigurationConstants.DOT_DELTA) + 1;
}