import {DragItem, DropResult, ValidationResult} from '../../machine-configuration/types/configuration.types';
import {Tray} from '../types/tray.types';
import { TrayProductManager } from './TrayProductManager';
import { CrossTrayDragDropService } from './CrossTrayDragDropService';

/**
 * Handles drag and drop operation for trays
 * Separates drop logic from component concerns
 * Now supports both new product placement and cross-tray moves
 */
export class TrayDropHandler {
    /**
     * Handles the drop operation for a tray
     */
    static handleProductDrop(
        item: DragItem,
        tray: Tray,
        onTrayUpdate: (updatedTray: Tray) => void,
        onCrossTrayMove?: (sourceTrayId: number, targetTrayId: number, sourceIndex: number, targetIndex?: number) => void
    ) : DropResult {
        if(!item.product) {
            console.error("Invalid drop item: Product is required");
            return {
                trayId: tray.id,
                position: { x: 0, y: 0 },
                isValid: false
            };
        }
        
        // Handle cross-tray moves
        if (item.type === 'TRAY_PRODUCT' && item.fromTray && item.fromTray !== tray.id) {
            console.log("Cross-tray move detected:", item.product.name, "from tray", item.fromTray, "to tray", tray.id);
            
            if (onCrossTrayMove && item.sourceIndex !== undefined) {
                // Delegate to parent component for cross-tray coordination
                onCrossTrayMove(item.fromTray, tray.id, item.sourceIndex);
                
                return {
                    trayId: tray.id,
                    position: { x: 0, y: 0 }, // Position will be calculated by the move operation
                    isValid: true,
                    operation: 'cross-tray-move'
                };
            }
        }
        
        // Handle new product placement
        console.log("Product dropped on tray:", item.product.name, "at tray ID:", tray.id);

        const updatedTray = TrayProductManager.addProductToTray(tray, item.product);
        if (updatedTray){
            //Find the newly added product to get its position
            const newProduct = updatedTray.products[updatedTray.products.length - 1];

            onTrayUpdate(updatedTray);

            return {
                trayId: updatedTray.id,
                position: { x: newProduct.x, y: newProduct.y },
                isValid: true,
                operation: 'add-product'
            };
        }

        //Could not add product
        return {
            trayId: tray.id,
            position: { x: 0, y: 0 },
            isValid: false
        }
    }

    /**
     * Validates if a product can be dropped on a tray
     */
    static canDropProduct(
        item: DragItem,
        tray: Tray
    ): boolean {
        if (!item.product){
            console.error("Invalid drop item: Product is required");
            return false;
        }

        // For cross-tray moves, check if it's not the same tray
        if (item.type === 'TRAY_PRODUCT' && item.fromTray === tray.id) {
            return false; // Can't drop on the same tray
        }

        return TrayProductManager.canPlaceProduct(tray, item.product);
    }

    /**
     * creates drop configuration for react-dnd
     */
    static createDropConfig(
        tray: Tray,
        onTrayUpdate: (updatedTray: Tray) => void,
        onCrossTrayMove?: (sourceTrayId: number, targetTrayId: number, sourceIndex: number, targetIndex?: number) => void
    ) {
        return {
            accept: ['PRODUCT', 'TRAY_PRODUCT'], // Accept both new products and cross-tray moves
            drop: (item: DragItem) => this.handleProductDrop(item, tray, onTrayUpdate, onCrossTrayMove),
            canDrop: (item: DragItem) => this.canDropProduct(item, tray),
            collect: (monitor: any) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
                itemType: monitor.getItemType()
            })
        };
    }
}
