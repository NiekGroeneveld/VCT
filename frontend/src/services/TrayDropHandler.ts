import {DragItem, DropResult, ValidationResult} from '../types/configuration.types';
import {Tray} from '../types/tray.types';
import { TrayProductManager } from './TrayProductManager';

/**
 * Handles drag and drop operation for trays
 * Separates drop logic from component concerns
 */
export class TrayDropHandler {
    /**
     * Handles the drop operation for a tray
     */
    static handleProductDrop(
        item: DragItem,
        tray: Tray,
        onTrayUpdate: (updatedTray: Tray) => void,
    ) : DropResult {
        if(!item.product) {
            console.error("Invalid drop item: Product is required");
            return {
                trayId: tray.id,
                position: { x: 0, y: 0 },
                isValid: false
            };
        }
        
        console.log("Product dropped on tray:", item.product.name, "at tray ID:", tray.id);

        const updatedTray = TrayProductManager.addProductToTray(tray, item.product);
        if (updatedTray){
            //Find the newly added product to get its position
            const newProduct = updatedTray.products[updatedTray.products.length - 1];

            onTrayUpdate(updatedTray);

            return {
                trayId: updatedTray.id,
                position: { x: newProduct.x, y: newProduct.y },
                isValid: true
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
        return TrayProductManager.canPlaceProduct(tray, item.product);
    }

    /**
     * creates drop configuration for react-dnd
     */

    static createDropConfig(
        tray: Tray,
        onTrayUpdate: (updatedTray: Tray) => void,
    ) {
        return {
            accept: 'PRODUCT',
            drop: (item: DragItem) => this.handleProductDrop(item, tray, onTrayUpdate),
            canDrop: (item: DragItem) => this.canDropProduct(item, tray),
            collect: (monitor: any) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
                itemType: monitor.getItemType()
            })
        };
    }




}
