import {Product} from "../../product-management/types/product.types";
import {Tray} from "../types/tray.types";
import {extractorConstants} from "../../product-management/types/extractor.types";


/**
 * All products sit on the bottom of the tray but elevated by extractor height
 * Y position is determined by extractor type based on product stability
 */
export const calculateYPosition = (product: Product): number => {
    return product.stable 
        ? extractorConstants.LOW_EXTRACTOR_HEIGHT
        : extractorConstants.HIGH_EXTRACTOR_HEIGHT;
};

/**
 * Check if a product fits in the tray at a given Y
 */
export const hasXAxisCollision = (x: number, productWidth: number, tray: Tray): boolean =>{
    const productLeft = x;
    const productRight = x + productWidth;

    return tray.products.some(existingProduct => {
        const existingLeft = existingProduct.x;
        const existingRight = existingProduct.x + existingProduct.width;

        // Check for overlap
        return !(productRight <= existingLeft || productLeft >= existingRight);
    });
};

/**
 * finds best X position for a product in a tray
 */
export const findBestXPosition = (product: Product, tray: Tray): number | null => {
    if (product.height > 340) {
        Error("Product height exceeds maximum tray height");
        return null; 
    }

    //Try positions from left to right
    for (let x = 0; x <= tray.width - product.width; x++){
        if( !hasXAxisCollision(x, product.width, tray)){
            return x;
        }
    }
    return null; // No valid position found
}