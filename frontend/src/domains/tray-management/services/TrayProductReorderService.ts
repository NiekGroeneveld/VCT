// src/services/TrayProductReorderService.ts

import { Tray, TrayConstants } from "../types/tray.types";
import { PlacedProduct } from "../../product-management/types/product.types";
import  {ProductSpacingService} from "./ProductSpacingService";

/**
 * Service for handling product reordering and positioning within trays
 */
export class TrayProductReorderService {
  
  /**
   * Reorders products within a tray and recalculates positions
   */
  static reorderProducts(
    tray: Tray, 
    fromIndex: number, 
    toIndex: number,
    useAdvanced: boolean = true
  ): Tray {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
      return tray;
    }

    const products = [...tray.products];
    
    // Validate indices
    if (fromIndex >= products.length || toIndex >= products.length) {
      console.log(`Invalid indices: fromIndex=${fromIndex}, toIndex=${toIndex}, array length=${products.length}`);
      return tray;
    }

    // Perform the reorder
    const [movedProduct] = products.splice(fromIndex, 1);
    products.splice(toIndex, 0, movedProduct);

    // Recalculate positions
    const repositionedProducts = ProductSpacingService.calculateAdvancedSpacing(tray, products);

    return {
      ...tray,
      products: repositionedProducts
    };
  }

  /**
   * Moves a product from one tray to another at a specific index
   */
  static moveProductBetweenTrays(
    sourceTray: Tray,
    targetTray: Tray,
    sourceIndex: number,
    targetIndex?: number
  ): { sourceTray: Tray; targetTray: Tray } | null {
    
    if (sourceIndex < 0 || sourceIndex >= sourceTray.products.length) {
      console.warn(`Invalid source index: ${sourceIndex} for tray with ${sourceTray.products.length} products`);
      return null;
    }

    const productToMove = sourceTray.products[sourceIndex];
    
    // Remove from source
    const sourceProducts = sourceTray.products.filter((_, index) => index !== sourceIndex);
    const updatedSourceTray = {
      ...sourceTray,
      products: ProductSpacingService.calculateAdvancedSpacing(sourceTray, sourceProducts)
    };

    // Add to target
    const targetProducts = [...targetTray.products];
    const insertIndex = targetIndex !== undefined 
      ? Math.min(targetIndex, targetProducts.length) 
      : targetProducts.length;
    
    // Update product with new tray ID
    const updatedProduct = {
      ...productToMove,
      trayId: targetTray.id,
      placedAt: Date.now(),
      onTrayIndex: 0 // Will be recalculated by assignOnTrayIndex
    };
    
    targetProducts.splice(insertIndex, 0, updatedProduct);
    
    const updatedTargetTray = {
      ...targetTray,
      products: ProductSpacingService.calculateAdvancedSpacing(targetTray, targetProducts)
    };

    return {
      sourceTray: updatedSourceTray,
      targetTray: updatedTargetTray
    };
  }

  /**
   * Gets the index range that a product can be moved to within a tray
   */
  static getValidMoveRange(tray: Tray, currentIndex: number): { min: number; max: number } {
    return {
      min: 0,
      max: Math.max(0, tray.products.length - 1)
    };
  }

  /**
   * Validates if a reorder operation is valid
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
    console.log(`DragDrop indicators for tray ${tray.id}: ${isValid}, draggedIndex: ${draggedIndex}, hoverIndex: ${hoverIndex}`);
    return {
      showDropBefore: isValid && hoverIndex < draggedIndex,
      showDropAfter: isValid && hoverIndex > draggedIndex,
      isValidDrop: isValid
    };
  }
}