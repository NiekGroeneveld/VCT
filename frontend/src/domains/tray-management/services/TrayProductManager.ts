// src/services/TrayProductManager.ts

import { Tray, TrayConstants } from "../types/tray.types";
import { PlacedProduct, Product } from "../../product-management/types/product.types";
import { getCanalHeight } from "../../product-management/utils/productUtils";
import { calculateYPosition} from "../utils/trayUtils";
import { extractorConstants } from "../../product-management/types/extractor.types";
import { ProductSpacingService } from "./ProductSpacingService";

/**
 * Service class for managing tray products with pure functions
 * This provides a clean API for tray operations without hook dependencies
 */
export class TrayProductManager {
  
  /**
   * Assigns onTrayIndex based on X position (left to right order)
   */
  static assignOnTrayIndex(tray: Tray): Tray {
    // Sort products by X position
    const sortedProducts = [...tray.products].sort((a, b) => a.x - b.x);
    
    // Assign index based on sorted order
    for (let i = 0; i < sortedProducts.length; i++) {
      sortedProducts[i].onTrayIndex = i; // 0-based index
    }
    
    return {
      ...tray,
      products: sortedProducts
    };
  }

  
  



  /**
   * Creates a PlacedProduct from a Product with proper extractor configuration
   */
  static createPlacedProduct(product: Product, x: number, trayId: number): PlacedProduct {
    const y = calculateYPosition(product);
    const baseProduct = {
      ...product,
      x,
      y,
      placedAt: Date.now(),
      trayId,
  onTrayIndex: 0 // Will be recalculated by assignOnTrayIndex (0-based)
    };

    if (product.stable) {
      return {
        ...baseProduct,
        extractorType: 'low' as const,
        extractorHeight: extractorConstants.LOW_EXTRACTOR_HEIGHT
      };
    } else {
      return {
        ...baseProduct,
        extractorType: 'high' as const,
        extractorHeight: extractorConstants.HIGH_EXTRACTOR_HEIGHT,
        clipDistance: extractorConstants.CLIP_DELTA
      };
    }
  }

  /**
   * Calculates optimal tray height based on products
   */
  static calculateOptimalHeight(products: PlacedProduct[]): number {
    if (products.length === 0) {
      return TrayConstants.MINIMAL_TRAY_HEIGHT;
    }

    const tallestCanalHeight = Math.max(...products.map(p => getCanalHeight(p)));
    return Math.max(tallestCanalHeight, TrayConstants.MINIMAL_TRAY_HEIGHT);
  }

  /**
   * Adds a product to a tray and returns the updated tray
   */
  static addProductToTray(tray: Tray, product: Product, requestedX?: number): Tray | null {
    // Create placed product with temporary position
    const placedProduct = this.createPlacedProduct(product, 0, tray.id);
    const updatedProducts = [...tray.products, placedProduct];
    
    // Use advanced spacing to position all products including the new one
    const repositionedProducts = ProductSpacingService.calculateAdvancedSpacing(tray, updatedProducts);
    const newTrayHeight = Math.max(tray.trayHeight, ...repositionedProducts.map(p => getCanalHeight(p)));

    let updatedTray: Tray = {
      ...tray,
      products: repositionedProducts,
      trayHeight: newTrayHeight
    };

    // Assign correct onTrayIndex based on X positions
    updatedTray = this.assignOnTrayIndex(updatedTray);

    return updatedTray;
  }

  /**
   * Removes a product by ID and returns updated tray
   */
  static removeProductById(tray: Tray, productId: number): Tray {
    const updatedProducts = tray.products.filter((p: PlacedProduct) => p.id !== productId);
    
    // Use advanced spacing to reposition remaining products
    const repositionedProducts = ProductSpacingService.calculateAdvancedSpacing(tray, updatedProducts);
    const newTrayHeight = this.calculateOptimalHeight(repositionedProducts);

    let updatedTray: Tray = {
      ...tray,
      products: repositionedProducts,
      trayHeight: newTrayHeight
    };

    // Assign correct onTrayIndex based on X positions
    updatedTray = this.assignOnTrayIndex(updatedTray);

    return updatedTray;
  }

  /**
   * Removes a product by index and returns updated tray
   */
  static removeProductByIndex(tray: Tray, productIndex: number): Tray {
    if (productIndex < 0 || productIndex >= tray.products.length) {
      console.warn(`Invalid product index: ${productIndex} for tray with ${tray.products.length} products`);
      return tray;
    }

    const updatedProducts = tray.products.filter((_: PlacedProduct, index: number) => index !== productIndex);
    
    // Use advanced spacing to reposition remaining products
    const repositionedProducts = ProductSpacingService.calculateAdvancedSpacing(tray, updatedProducts);
    const newHeight = this.calculateOptimalHeight(repositionedProducts);

    let updatedTray: Tray = {
      ...tray,
      products: repositionedProducts,
      trayHeight: newHeight
    };

    // Assign correct onTrayIndex based on X positions
    updatedTray = this.assignOnTrayIndex(updatedTray);

    return updatedTray;
  }

  /**
   * Updates tray dimensions and validates products still fit
   */
  static updateTrayDimensions(tray: Tray, updates: Partial<Pick<Tray, 'trayWidth' | 'trayHeight' | 'name'>>): Tray {
    const updatedTray = { ...tray, ...updates };
    // If trayHeight was reduced, check if existing products still fit
    if (updates.trayHeight !== undefined && updates.trayHeight < tray.trayHeight) {
      const validProducts = updatedTray.products.filter((product: PlacedProduct) => {
        const totalHeight = product.height + product.extractorHeight;
        return totalHeight <= updatedTray.trayHeight;
      });
      // Log warning if products were removed
      if (validProducts.length !== updatedTray.products.length) {
        const removedCount = updatedTray.products.length - validProducts.length;
        console.warn(`${removedCount} product(s) removed because they exceed the new tray height of ${updatedTray.trayHeight}mm`);
      }
      updatedTray.products = validProducts;
    }
    // If width changed, reposition products with new spacing
    if (updates.trayWidth !== undefined && updates.trayWidth !== tray.trayWidth) {
      const repositionedProducts = ProductSpacingService.calculateAdvancedSpacing(updatedTray, updatedTray.products);
      updatedTray.products = repositionedProducts;
    }
    return updatedTray;
  }

  
  /**
   * Validates if a product can be placed in a tray
   */
  /** 
  static canPlaceProduct(tray: Tray, product: Product, requestedX?: number): boolean {
    // Since we use advanced spacing, we can always fit products unless the tray is too narrow
    const totalWidth = tray.products.reduce((sum: number, p: PlacedProduct) => sum + p.width, 0) + product.width;
    return totalWidth <= tray.trayWidth;
  }
  */
  
  static canPlaceProduct(tray: Tray, product: Product, requestedX?: number): boolean {
    // Check if product fit on the tray.
    // We have to round on 5 mm, and between each there is a bar of 2mm. Minimal canal width is 52 mm.
    let canalWidth = this.getCanalWidth(product);
    let currentUsedWidth = tray.products.reduce((sum: number, p: PlacedProduct) => sum + this.getCanalWidth(p), 0);
    return (currentUsedWidth + canalWidth) <= tray.trayWidth;
  }
  
  static getCanalWidth(product: Product): number {
    return product.width > 52 ? Math.ceil(product.width / 5) * 5 + 2 : 52;
  }
  /**
   * Gets tray utilization statistics
   */
  static getTrayStats(tray: Tray) {
    const totalArea = tray.trayWidth * tray.trayHeight;
  const usedArea = tray.products.reduce((sum: number, p: PlacedProduct) => sum + (p.width * p.height), 0);
    
    const tallestCanalHeight = tray.products.reduce((max: number, p: PlacedProduct) => {
      return Math.max(max, getCanalHeight(p));
    }, 0);
    
    const minimumRequiredHeight = Math.max(TrayConstants.MINIMAL_TRAY_HEIGHT, tallestCanalHeight);
    const lowExtractorCount = tray.products.filter((p: PlacedProduct) => p.extractorType === 'low').length;
    const highExtractorCount = tray.products.filter((p: PlacedProduct) => p.extractorType === 'high').length;
    return {
      utilization: totalArea > 0 ? (usedArea / totalArea) * 100 : 0,
      productCount: tray.products.length,
      tallestCanalHeight,
      minimumRequiredHeight,
      canReduceHeight: tray.trayHeight > minimumRequiredHeight,
      heightBuffer: tray.trayHeight - tallestCanalHeight,
      extractorStats: {
        lowExtractorCount,
        highExtractorCount,
        totalExtractorHeight: tray.products.reduce((sum: number, p: PlacedProduct) => sum + p.extractorHeight, 0)
      }
    };
  }

  /**
   * Moves a product from one tray to another
   * Returns both updated trays or null if the operation fails
   */
  static moveProductBetweenTrays(
    sourceTray: Tray,
    targetTray: Tray,
    productIndex: number,
    targetIndex?: number
  ): { sourceTray: Tray; targetTray: Tray } | null {
    // Validate source index
    if (productIndex < 0 || productIndex >= sourceTray.products.length) {
      console.warn(`Invalid product index: ${productIndex} for source tray with ${sourceTray.products.length} products`);
      return null;
    }

    const productToMove = sourceTray.products[productIndex];
    
    // Check if product can fit in target tray
    if (!this.canPlaceProduct(targetTray, productToMove)) {
      console.warn(`Product ${productToMove.name} cannot fit in target tray`);
      return null;
    }

    // Remove from source tray
    const updatedSourceProducts = sourceTray.products.filter((_: PlacedProduct, index: number) => index !== productIndex);
    const repositionedSourceProducts = ProductSpacingService.calculateAdvancedSpacing(sourceTray, updatedSourceProducts);
    const sourceTrayHeight = this.calculateOptimalHeight(repositionedSourceProducts);

    let updatedSourceTray: Tray = {
      ...sourceTray,
      products: repositionedSourceProducts,
      trayHeight: sourceTrayHeight
    };
    updatedSourceTray = this.assignOnTrayIndex(updatedSourceTray);

    // Add to target tray
    const updatedProduct: PlacedProduct = {
      ...productToMove,
      trayId: targetTray.id,
      placedAt: Date.now(),
      onTrayIndex: 0 // Will be recalculated
    };

    const targetProducts = [...targetTray.products];
    const insertIndex = targetIndex !== undefined 
      ? Math.min(targetIndex, targetProducts.length) 
      : targetProducts.length;
    
    targetProducts.splice(insertIndex, 0, updatedProduct);
    
    const repositionedTargetProducts = ProductSpacingService.calculateAdvancedSpacing(targetTray, targetProducts);
    const targetTrayHeight = Math.max(targetTray.trayHeight, this.calculateOptimalHeight(repositionedTargetProducts));

    let updatedTargetTray: Tray = {
      ...targetTray,
      products: repositionedTargetProducts,
      trayHeight: targetTrayHeight
    };
    updatedTargetTray = this.assignOnTrayIndex(updatedTargetTray);

    return {
      sourceTray: updatedSourceTray,
      targetTray: updatedTargetTray
    };
  }

  /**
   * Validates if a product can be moved from one tray to another
   */
  static canMoveProductBetweenTrays(
    sourceTray: Tray,
    targetTray: Tray,
    productIndex: number
  ): { canMove: boolean; reason?: string } {
    // Check source index validity
    if (productIndex < 0 || productIndex >= sourceTray.products.length) {
      return { canMove: false, reason: 'Invalid product index' };
    }

    // Can't move to same tray
    if (sourceTray.id === targetTray.id) {
      return { canMove: false, reason: 'Cannot move product to the same tray' };
    }

    const productToMove = sourceTray.products[productIndex];
    
    // Check if product fits in target tray
    if (!this.canPlaceProduct(targetTray, productToMove)) {
      return { canMove: false, reason: 'Product does not fit in target tray' };
    }

    return { canMove: true };
  }

  static ensureCorrectYCoordinates(tray: Tray): Tray {
    const correctedProducts = tray.products.map(product => ({
      ...product,
      y: calculateYPosition(product)
    }));

    return {
      ...tray,
      products: correctedProducts
    };
  }

  /**
   * Ensures all products in all trays have correct y coordinates
   */
  static ensureCorrectYCoordinatesForAllTrays(trays: Tray[]): Tray[] {
    return trays.map(tray => this.ensureCorrectYCoordinates(tray));
  }
}