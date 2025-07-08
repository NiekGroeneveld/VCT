import {Tray} from '../types/tray.types';
import {PlacedProduct} from '../types/product.types';
import { findBestXPosition} from '../utils/trayUtils';

/** 
 * Service class for managing product reordering in trays
 */
export class TrayProductReorderService {
    /**
     * Calculates X positions for all products in a tray base don their order
     */

    static calculateOptimalXPositions(tray: Tray, products : PlacedProduct[]): PlacedProduct[] {
        const sortedProducts = [...products]; //Assuming sorting is always done before calling this method
        const positionedProducts: PlacedProduct[] = [];

        //Create a temporary tray state for collision checks
        let tempTray: Tray = { ...tray, products: [] };
        for(let i = 0; i < sortedProducts.length; i++) {
            const product = sortedProducts[i];
            
            //Find best position considering already place products
            const bestX = findBestXPosition(product, tempTray);
            if (bestX !== null) {
                const positionedProduct = {
                    ...product,
                    x: bestX
                };
                positionedProducts.push(positionedProduct);
                tempTray = {...tempTray, products: [...tempTray.products, positionedProduct]}; //Update temp tray with new product
            } else {
                console.warn(`Could not find a valid position for product ${product.name} in tray ${tray.id}`);
                positionedProducts.push(product);
                tempTray = {...tempTray, products: [...tempTray.products, product]}; //Add product without position
            }
        }
        return positionedProducts;
    }

    /**
     * Simple left spacing algorithm for products (alternative to Optimal)
     */

    static calculateSimpleSpacing(products: PlacedProduct[], spacing: number = 10): PlacedProduct[] {
        let currentX = 0;
        return products.map((product) => {
            const positionedProduct: PlacedProduct = {
                ...product,
                x: currentX
            };
            currentX += product.width + spacing; // Add spacing after each product
            return positionedProduct;
        });
    }

    /**
     * Reorders products within a tray and recalculates their X positions
     */

    static reorderProducts(
        tray: Tray,
        fromIndex: number,
        toIndex: number,
        useOptimal: boolean = true
    ): Tray {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0){
            return tray;
        }
        const products = [...tray.products];

        //Validate indices
        if (fromIndex >= products.length || toIndex >= products.length || fromIndex > 10 || toIndex > 10) {
            console.warn(`Invalid indices for reordering: fromIndex=${fromIndex}, toIndex=${toIndex} for tray with ${products.length} products`);
            return tray; // No changes
        }

        //Perform reordering
        const [movedProduct] = products.splice(fromIndex, 1);
        products.splice(toIndex, 0, movedProduct);

        //Recalculate X positions
        const repositionedProducts = useOptimal
            ? this.calculateOptimalXPositions(tray, products)
            : this.calculateSimpleSpacing(products);
        
        return {
            ...tray,
            products: repositionedProducts
        };
    }

    /**
     * Move product from one tray to another at a specific index
     */

    static moveProductToTray(
        sourceTray: Tray,
        targetTray: Tray,
        sourceIndex: number,
        targetIndex?: number
    ): { sourceTray: Tray; targetTray: Tray } | null{
        if (sourceIndex < 0 || sourceIndex >= sourceTray.products.length  ) {
            console.warn(`Invalid source index: ${sourceIndex} for source tray with ${sourceTray.products.length} products`);
            return null; // Invalid index
        }
        const productToMove = sourceTray.products[sourceIndex];

        //Remove from source
        const sourceProducts = sourceTray.products.filter((_, index) => index !== sourceIndex);
        const updatedSourceTray: Tray = {
            ...sourceTray,
            products: this.calculateOptimalXPositions(sourceTray, sourceProducts),
        };

        //Add to target
        const targetProducts = [...targetTray.products];
        const insertIndex = targetIndex !== undefined
            ? Math.min(targetIndex, targetProducts.length) // Ensure index is within bounds
            : targetProducts.length; // Default to end if no index provided
        
        //Update product with new tray ID and X position
        const updatedProduct = {
            ...productToMove,
            trayId: targetTray.id,
            placedAt: Date.now(), // Update placedAt timestamp
            onTrayIndex: -1
        };

        targetProducts.splice(insertIndex, 0, updatedProduct);

        const updatedTargetTray: Tray = {
            ...targetTray,
            products: this.calculateOptimalXPositions(targetTray, targetProducts),
        };

        return {
            sourceTray: updatedSourceTray,
            targetTray: updatedTargetTray
        };
    }

    /**
     * Gets the index range that a product can be moved to within a tray
     */
    static getValidMoveRange(tray: Tray, currentIndex: number) : { min: number; max: number } {
        return {
            min: 0,
            max: tray.products.length - 1
        };
    }

    /**
     *Validates if a reorder is valid 
    */

     static isValidReorder(tray: Tray, fromIndex: number, toIndex: number): boolean {
        const range = this.getValidMoveRange(tray, fromIndex);
        return (
            fromIndex >= 0 &&
            fromIndex < tray.products.length &&
            toIndex >= range.min &&
            toIndex <= range.max &&
            fromIndex !== toIndex
        );
     }


     /**
      * Gets visual indicators for drag and drop operations
      */

    static getDragDropIndicators(
        tray: Tray,
        draggedIndex: number,
        hoverIndex: number
    ): {
        showDropBefore: boolean;
        showDropAfter: boolean;
        isValidDrop: boolean;
    } {
        const isValid = this.isValidReorder(tray, draggedIndex, hoverIndex);
        
        return {
        showDropBefore: isValid && hoverIndex < draggedIndex,
        showDropAfter: isValid && hoverIndex > draggedIndex,
        isValidDrop: isValid
        };
    }

}