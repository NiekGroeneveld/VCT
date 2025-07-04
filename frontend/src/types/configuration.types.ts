
/*
unified drag item interface for react-dnd 
supports dragging both products and trays
*/

import { Product } from "./product.types";
import { Tray } from "./tray.types";


export interface DragItem{
    type: 'PRODUCT' | 'TRAY'; // Type of the item being dragged
    product?: Product; // Product details if the item is a product
    tray?: Tray; // Tray details if the item is a tray
    fromTray?: number;  //Source tray when moving between trays
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
    DOTS : 72,
    DOT_DELTA : 13, // mm
}