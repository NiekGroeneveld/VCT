import {Product, PlacedProduct} from "../types/product.types";
import {Tray, TrayConstants} from "../types/tray.types";
import {getCanalHeight, getCanalHeightProduct} from "./productUtils";
import {extractorConstants} from "../types/extractor.types";


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
 * check if a product fits in the tray at a give X
 */

export const fitsInTrayWidth = (x: number, productWidth: number, trayWidth: number): boolean => {
    return x >= 0 && (x + productWidth) <= trayWidth;
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

export const fitsInTrayHeight = (product: Product, tray: Tray): boolean => {
    // Check if the product fits within the tray's height
    return getCanalHeightProduct(product) <= tray.height;
};

export const upSizeTray = (tray: Tray, product: Product): Tray => {
    // Calculate the new height based on the tallest product in the tray
    const newHeight = Math.max(tray.height, getCanalHeightProduct(product));
    
    // Return a new tray object with the updated height
    return {
        ...tray,
        height: newHeight
    };
}

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

/**
 * validates if a product can be placed on a tray at the specified position
 */

export const canPlaceAt = (x: number, product: Product, tray: Tray): boolean => {
    // Check if the product fits in the tray's width
    if (!fitsInTrayWidth(x, product.width, tray.width)) {
        return false; // Product does not fit in tray width
    }

    // Check for X-axis collision with existing products
    if (hasXAxisCollision(x, product.width, tray)) {
        return false; // Collision detected with existing products
    }

    // Check if the product fits in the tray's height
    if (!fitsInTrayHeight(product, tray)) {
        return false; // Product does not fit in tray height
    }

    return true; // All checks passed, product can be placed
}

/**
 * Calculates tray utilization metrics and minimum required height
 */

/**
 * Calculates tray utilization metrics and minimum required height
 */
export const calculateTrayStats = (tray: Tray) => {
    const MINIMAL_TRAY_HEIGHT = TrayConstants.MINIMAL_TRAY_HEIGHT;
    const totalArea = tray.width * tray.height;
    const usedArea = tray.products.reduce((sum, p) => sum + (p.width * p.height), 0);
    
    // Find the tallest canal (product + extractor) to determine minimum required height
    const tallestCanalHeight = tray.products.reduce((max, p) => {
        return Math.max(max, getCanalHeight(p));
    }, 0);
    
    const minimumRequiredHeight = Math.max(MINIMAL_TRAY_HEIGHT, tallestCanalHeight);
    
    // Count extractor types
    const lowExtractorCount = tray.products.filter(p => p.extractorType === 'low').length;
    const highExtractorCount = tray.products.filter(p => p.extractorType === 'high').length;
    
    return {
        utilization: totalArea > 0 ? (usedArea / totalArea) * 100 : 0,
        productCount: tray.products.length,
        tallestCanalHeight,
        minimumRequiredHeight,
        canReduceHeight: tray.height > minimumRequiredHeight,
        heightBuffer: tray.height - tallestCanalHeight,
        extractorStats: {
            lowExtractorCount,
            highExtractorCount,
            totalExtractorHeight: tray.products.reduce((sum, p) => sum + p.extractorHeight, 0)
        }
    };
};