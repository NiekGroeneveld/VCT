import { DragItem, DropResult, ValidationResult } from '../../machine-configuration/types/configuration.types';
import { Tray } from '../types/tray.types';
import { PlacedProduct } from '../../product-management/types/product.types';
import { TrayProductManager } from './TrayProductManager';

/**
 * Comprehensive service for handling cross-tray drag and drop operations
 * Provides validation, movement logic, and proper state management
 */
export class CrossTrayDragDropService {
  
  /**
   * Validates if a cross-tray drag operation is valid
   */
  static validateCrossTrayMove(
    dragItem: DragItem,
    sourceTray: Tray,
    targetTray: Tray,
    targetIndex?: number
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (dragItem.type === 'TRAY_PRODUCT' && !dragItem.product) {
      errors.push('Drag item missing product data');
    }

    if (!sourceTray || !targetTray) {
      errors.push('Source or target tray not found');
    }

    if (sourceTray?.id === targetTray?.id) {
      errors.push('Cannot move product to the same tray');
    }

    // Product-specific validation
    if (dragItem.product) {
      const canPlaceResult = TrayProductManager.canPlaceProduct(targetTray, dragItem.product);
      if (!canPlaceResult) {
        errors.push('Product does not fit in target tray');
      }

      // Check if moving would create better utilization
      const sourceStats = TrayProductManager.getTrayStats(sourceTray);
      const targetStats = TrayProductManager.getTrayStats(targetTray);
      
      if (sourceStats.productCount === 1) {
        warnings.push('Moving this product will leave the source tray empty');
      }

      if (targetStats.utilization > 85) {
        warnings.push('Target tray utilization will be very high after this move');
      }
    }

    // Index validation
    if (targetIndex !== undefined && targetIndex < 0) {
      errors.push('Invalid target index');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Executes a cross-tray move operation
   */
  static executeCrossTrayMove(
    dragItem: DragItem,
    sourceTray: Tray,
    targetTray: Tray,
    sourceIndex: number,
    targetIndex?: number
  ): { sourceTray: Tray; targetTray: Tray } | null {
    
    // Validate the operation
    const validation = this.validateCrossTrayMove(dragItem, sourceTray, targetTray, targetIndex);
    if (!validation.isValid) {
      console.error('Cross-tray move validation failed:', validation.errors);
      return null;
    }

    // Log warnings if any
    if (validation.warnings.length > 0) {
      console.warn('Cross-tray move warnings:', validation.warnings);
    }

    // Execute the move using TrayProductManager
    const result = TrayProductManager.moveProductBetweenTrays(
      sourceTray, 
      targetTray, 
      sourceIndex, 
      targetIndex
    );

    if (result) {
      console.log(`Successfully moved product from tray ${sourceTray.id} to tray ${targetTray.id}`);
    }

    return result;
  }

  /**
   * Creates a standardized drag item for cross-tray operations
   */
  static createTrayProductDragItem(
    product: PlacedProduct,
    sourceIndex: number,
    sourceTrayId: number
  ): DragItem {
    return {
      type: 'TRAY_PRODUCT',
      product,
      fromTray: sourceTrayId,
      // Add additional metadata for cross-tray operations
      sourceIndex,
      sourceTrayId
    };
  }

  /**
   * Determines the optimal drop position within a target tray
   */
  static calculateOptimalDropPosition(
    targetTray: Tray,
    draggedProduct: PlacedProduct,
    dropClientOffset?: { x: number; y: number },
    trayElement?: HTMLElement
  ): number {
    
    // If no specific position provided, append to end
    if (!dropClientOffset || !trayElement) {
      return targetTray.products.length;
    }

    // Calculate relative position within tray
    const trayRect = trayElement.getBoundingClientRect();
    const relativeX = dropClientOffset.x - trayRect.left;
    
    // Find the best insertion point based on X position
    let insertIndex = 0;
    for (let i = 0; i < targetTray.products.length; i++) {
      const product = targetTray.products[i];
      const productCenterX = product.x + (product.width / 2);
      
      if (relativeX < productCenterX) {
        break;
      }
      insertIndex = i + 1;
    }
    
    return Math.min(insertIndex, targetTray.products.length);
  }

  /**
   * Handles the drop result for cross-tray operations
   */
  static handleCrossTrayDrop(
    dragItem: DragItem,
    targetTray: Tray,
    dropPosition?: { x: number; y: number },
    trayElement?: HTMLElement
  ): DropResult {
    
    // Determine optimal drop position
    const targetIndex = (dragItem.product && 'x' in dragItem.product)
      ? this.calculateOptimalDropPosition(targetTray, dragItem.product as PlacedProduct, dropPosition, trayElement)
      : targetTray.products.length;

    return {
      trayId: targetTray.id,
      position: dropPosition || { x: 0, y: 0 },
      isValid: true,
      targetIndex, // Additional metadata for the drop operation
      operation: 'cross-tray-move'
    };
  }

  /**
   * Gets visual feedback information for drag operations
   */
  static getDragFeedback(
    dragItem: DragItem,
    targetTray: Tray,
    isOverTarget: boolean
  ): {
    canDrop: boolean;
    feedbackMessage: string;
    feedbackType: 'success' | 'warning' | 'error' | 'info';
  } {
    
    if (!isOverTarget) {
      return {
        canDrop: false,
        feedbackMessage: '',
        feedbackType: 'info'
      };
    }

    if (!dragItem.product) {
      return {
        canDrop: false,
        feedbackMessage: 'Invalid drag item',
        feedbackType: 'error'
      };
    }

    const canPlace = TrayProductManager.canPlaceProduct(targetTray, dragItem.product);
    
    if (!canPlace) {
      return {
        canDrop: false,
        feedbackMessage: 'Product does not fit in this tray',
        feedbackType: 'error'
      };
    }

    // Check if it's a cross-tray move
    if (dragItem.fromTray && dragItem.fromTray === targetTray.id) {
      return {
        canDrop: false,
        feedbackMessage: 'Cannot move to the same tray',
        feedbackType: 'warning'
      };
    }

    const targetStats = TrayProductManager.getTrayStats(targetTray);
    
    if (targetStats.utilization > 85) {
      return {
        canDrop: true,
        feedbackMessage: 'Tray will be nearly full after this move',
        feedbackType: 'warning'
      };
    }

    return {
      canDrop: true,
      feedbackMessage: `Move ${dragItem.product.name} to this tray`,
      feedbackType: 'success'
    };
  }

  /**
   * Cleanup function for drag operations
   */
  static cleanupDragOperation(
    dragItem: DragItem,
    wasSuccessful: boolean
  ): void {
    if (wasSuccessful) {
      console.log(`Cross-tray move completed successfully for product: ${dragItem.product?.name}`);
    } else {
      console.log(`Cross-tray move cancelled or failed for product: ${dragItem.product?.name}`);
    }
  }
}
