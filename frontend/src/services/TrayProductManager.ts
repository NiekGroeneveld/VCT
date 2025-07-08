import { Tray, TrayConstants } from "../types/tray.types";
import { PlacedProduct, Product } from "../types/product.types";
import { extractorConstants } from "../types/extractor.types";
import { getCanalHeight, getCanalHeightProduct } from "../utils/productUtils";
import { calculateYPosition, findBestXPosition } from "../utils/trayUtils";

/**
 * Service class for managing tray products with pure functions
 * This provides a clean API for tray operations without hook dependencies
 */

export class TrayProductManager {
  /**
   * Assigns onTrayIndex based on X position (left to right order)
   *  */
  static assignOnTrayIndex(tray: Tray): Tray {
    const sortedProducts = [...tray.products].sort((a, b) => a.x - b.x);
    for (let i = 0; i < sortedProducts.length; i++) {
      sortedProducts[i].onTrayIndex = i;
    }
    return {
      ...tray,
      products: sortedProducts,
    };
  }

  /**
   * Creates a PlacedProduct from a Product with proper extractor configuration
   */
  static createPlacedProduct(
    product: Product,
    x: number,
    trayId: number
  ): PlacedProduct {
    const y = calculateYPosition(product);
    const baseProduct = {
      ...product,
      x,
      y,
      placedAt: Date.now(),
      trayId,
      onTrayIndex: 0, // Will be recalculated by assignOnTrayIndex
    };

    if (product.stable) {
      return {
        ...baseProduct,
        extractorType: "low" as const,
        extractorHeight: extractorConstants.LOW_EXTRACTOR_HEIGHT,
      };
    } else {
      return {
        ...baseProduct,
        extractorType: "high" as const,
        extractorHeight: extractorConstants.HIGH_EXTRACTOR_HEIGHT,
        clipDistance: extractorConstants.CLIP_DELTA,
      };
    }
  }

  /**
   * Recalculates the tray height based on the products it contains.
   */
  static calculateOptimalHeight(products: PlacedProduct[]): number {
    if (products.length === 0) {
      return TrayConstants.MINIMAL_TRAY_HEIGHT;
    }
    return Math.max(
      TrayConstants.MINIMAL_TRAY_HEIGHT,
      ...products.map((p) => getCanalHeight(p))
    );
  }

  /**
   * Adds a product to a tray and returns the updated tray
   */
  static addProductToTray(
    tray: Tray,
    product: Product,
    requestedX?: number
  ): Tray | null {
    // Find best position
    const x =
      requestedX !== undefined ? requestedX : findBestXPosition(product, tray);
    if (x === null) {
      return null; // Cannot place product
    }

    // Create placed product
    const placedProduct = this.createPlacedProduct(product, x, tray.id);
    const updatedProducts = [...tray.products, placedProduct];
    const newHeight = Math.max(tray.height, getCanalHeight(placedProduct));

    let updatedTray: Tray = {
      ...tray,
      products: updatedProducts,
      height: newHeight,
    };

    // Assign correct onTrayIndex based on X positions
    updatedTray = this.assignOnTrayIndex(updatedTray);

    return updatedTray;
  }

  /**
   * Removes a product by ID and returns updated tray
   */
  static removeProductById(tray: Tray, productId: number): Tray {
    const updatedProducts = tray.products.filter((p) => p.id !== productId);
    const newHeight = this.calculateOptimalHeight(updatedProducts);

    let updatedTray: Tray = {
      ...tray,
      products: updatedProducts,
      height: newHeight,
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
      console.warn(
        `Invalid product index: ${productIndex} for tray with ${tray.products.length} products`
      );
      return tray;
    }

    const updatedProducts = tray.products.filter(
      (_, index) => index !== productIndex
    );
    const newHeight = this.calculateOptimalHeight(updatedProducts);

    let updatedTray: Tray = {
      ...tray,
      products: updatedProducts,
      height: newHeight,
    };

    // Assign correct onTrayIndex based on X positions
    updatedTray = this.assignOnTrayIndex(updatedTray);

    return updatedTray;
  }

  /**
   * Updates tray dimensions and validates products still fit
   */
  static updateTrayDimensions(
    tray: Tray,
    updates: Partial<Pick<Tray, "width" | "height" | "name">>
  ): Tray {
    const updatedTray = { ...tray, ...updates };

    // If height was reduced, check if existing products still fit
    if (updates.height !== undefined && updates.height < tray.height) {
      const validProducts = updatedTray.products.filter(
        (product: PlacedProduct) => {
          const totalHeight = product.height + product.extractorHeight;
          return totalHeight <= updatedTray.height;
        }
      );

      // Log warning if products were removed
      if (validProducts.length !== updatedTray.products.length) {
        const removedCount = updatedTray.products.length - validProducts.length;
        console.warn(
          `${removedCount} product(s) removed because they exceed the new tray height of ${updatedTray.height}mm`
        );
      }

      updatedTray.products = validProducts;
    }

    return updatedTray;
  }

  /**
   * Validates if a product can be placed in a tray
   */
  static canPlaceProduct(
    tray: Tray,
    product: Product,
    requestedX?: number
  ): boolean {
    const x =
      requestedX !== undefined ? requestedX : findBestXPosition(product, tray);
    return x !== null;
  }

  /**
   * Gets tray utilization statistics
   */
  static getTrayStats(tray: Tray) {
    const totalArea = tray.width * tray.height;
    const usedArea = tray.products.reduce(
      (sum, p) => sum + p.width * p.height,
      0
    );

    const tallestCanalHeight = tray.products.reduce((max, p) => {
      return Math.max(max, getCanalHeight(p));
    }, 0);

    const minimumRequiredHeight = Math.max(
      TrayConstants.MINIMAL_TRAY_HEIGHT,
      tallestCanalHeight
    );

    const lowExtractorCount = tray.products.filter(
      (p) => p.extractorType === "low"
    ).length;
    const highExtractorCount = tray.products.filter(
      (p) => p.extractorType === "high"
    ).length;

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
        totalExtractorHeight: tray.products.reduce(
          (sum, p) => sum + p.extractorHeight,
          0
        ),
      },
    };
  }
}
