// src/services/TrayProductManager.ts

import { Tray, TrayConstants } from "../types/tray.types";
import { PlacedProduct, Product } from "../types/product.types";
import { getCanalHeight } from "../utils/productUtils";
import { calculateYPosition, findBestXPosition } from "../utils/trayUtils";
import { extractorConstants } from "../types/extractor.types";

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
      sortedProducts[i].onTrayIndex = i;
    }
    
    return {
      ...tray,
      products: sortedProducts
    };
  }

  /**
   * Advanced spacing algorithm that distributes products evenly across tray width
   */
  static calculateAdvancedSpacing(tray: Tray, products: PlacedProduct[], minSpacing: number = 2): PlacedProduct[] {
    if (products.length === 0) {
      return [];
    }

    const trayWidth = tray.width;
    const totalProductWidth = products.reduce((sum, p) => sum + p.width, 0);
    const productCount = products.length;
    
    // Calculate available space for spacing
    const availableSpace = trayWidth - totalProductWidth;
    
    // If products don't fit, use simple left-aligned spacing
    if (availableSpace < 0) {
      console.warn(`Products don't fit in tray width ${trayWidth}mm, using simple spacing`);
      return this.calculateSimpleSpacing(products, minSpacing);
    }
    
    // Calculate spacing between products
    let spacing: number;
    let startX: number;
    
    if (productCount === 1) {
      // Center single product
      spacing = 0;
      startX = (trayWidth - totalProductWidth) / 2;
    } else {
      // Calculate total spacing needed (including half spacing at start and end)
      const totalSpacingSlots = productCount + 1; // Between products + start + end
      const spacingPerSlot = availableSpace / totalSpacingSlots;
      
      spacing = spacingPerSlot;
      startX = spacingPerSlot; // Start with half spacing
    }
    
    // Position products
    const positionedProducts: PlacedProduct[] = [];
    let currentX = startX;
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const positionedProduct: PlacedProduct = {
        ...product,
        x: Math.round(currentX)
      };
      
      positionedProducts.push(positionedProduct);
      currentX += product.width + spacing;
    }
    
    return positionedProducts;
  }

  /**
   * Simple spacing algorithm for products (fallback)
   */
  static calculateSimpleSpacing(products: PlacedProduct[], spacing: number = 10): PlacedProduct[] {
    let currentX = 0;
    return products.map((product) => {
      const positionedProduct: PlacedProduct = {
        ...product,
        x: currentX
      };
      currentX += product.width + spacing;
      return positionedProduct;
    });
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
      onTrayIndex: 0 // Will be recalculated by assignOnTrayIndex
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
    const repositionedProducts = this.calculateAdvancedSpacing(tray, updatedProducts);
    const newHeight = Math.max(tray.height, ...repositionedProducts.map(p => getCanalHeight(p)));

    let updatedTray: Tray = {
      ...tray,
      products: repositionedProducts,
      height: newHeight
    };

    // Assign correct onTrayIndex based on X positions
    updatedTray = this.assignOnTrayIndex(updatedTray);

    return updatedTray;
  }

  /**
   * Removes a product by ID and returns updated tray
   */
  static removeProductById(tray: Tray, productId: number): Tray {
    const updatedProducts = tray.products.filter(p => p.id !== productId);
    
    // Use advanced spacing to reposition remaining products
    const repositionedProducts = this.calculateAdvancedSpacing(tray, updatedProducts);
    const newHeight = this.calculateOptimalHeight(repositionedProducts);

    let updatedTray: Tray = {
      ...tray,
      products: repositionedProducts,
      height: newHeight
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

    const updatedProducts = tray.products.filter((_, index) => index !== productIndex);
    
    // Use advanced spacing to reposition remaining products
    const repositionedProducts = this.calculateAdvancedSpacing(tray, updatedProducts);
    const newHeight = this.calculateOptimalHeight(repositionedProducts);

    let updatedTray: Tray = {
      ...tray,
      products: repositionedProducts,
      height: newHeight
    };

    // Assign correct onTrayIndex based on X positions
    updatedTray = this.assignOnTrayIndex(updatedTray);

    return updatedTray;
  }

  /**
   * Updates tray dimensions and validates products still fit
   */
  static updateTrayDimensions(tray: Tray, updates: Partial<Pick<Tray, 'width' | 'height' | 'name'>>): Tray {
    const updatedTray = { ...tray, ...updates };
    
    // If height was reduced, check if existing products still fit
    if (updates.height !== undefined && updates.height < tray.height) {
      const validProducts = updatedTray.products.filter((product: PlacedProduct) => {
        const totalHeight = product.height + product.extractorHeight;
        return totalHeight <= updatedTray.height;
      });
      
      // Log warning if products were removed
      if (validProducts.length !== updatedTray.products.length) {
        const removedCount = updatedTray.products.length - validProducts.length;
        console.warn(`${removedCount} product(s) removed because they exceed the new tray height of ${updatedTray.height}mm`);
      }
      
      updatedTray.products = validProducts;
    }
    
    // If width changed, reposition products with new spacing
    if (updates.width !== undefined && updates.width !== tray.width) {
      const repositionedProducts = this.calculateAdvancedSpacing(updatedTray, updatedTray.products);
      updatedTray.products = repositionedProducts;
    }
    
    return updatedTray;
  }

  /**
   * Validates if a product can be placed in a tray
   */
  static canPlaceProduct(tray: Tray, product: Product, requestedX?: number): boolean {
    // Since we use advanced spacing, we can always fit products unless the tray is too narrow
    const totalWidth = tray.products.reduce((sum, p) => sum + p.width, 0) + product.width;
    return totalWidth <= tray.width;
  }

  /**
   * Gets tray utilization statistics
   */
  static getTrayStats(tray: Tray) {
    const totalArea = tray.width * tray.height;
    const usedArea = tray.products.reduce((sum, p) => sum + (p.width * p.height), 0);
    
    const tallestCanalHeight = tray.products.reduce((max, p) => {
      return Math.max(max, getCanalHeight(p));
    }, 0);
    
    const minimumRequiredHeight = Math.max(TrayConstants.MINIMAL_TRAY_HEIGHT, tallestCanalHeight);
    
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
  }
}