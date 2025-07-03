import { useState, useCallback } from "react";
import { Tray, TrayConstants } from "../types/tray.types";
import { PlacedProduct, Product } from "../types/product.types";
import {
  findBestXPosition,
  canPlaceAt,
  calculateYPosition,
} from "../utils/trayUtils";
import { extractorConstants } from "../types/extractor.types";
import { request } from "http";

export const useTrayData = () => {
  const [trays, setTrays] = useState<Tray[]>([]);

  /**
   * Creates a PlacedProduct from a Product with proper extractor configuration
   * Moved inside the hook to be accessible in callbacks
   */
  const createPlacedProduct = useCallback((
    product: Product, 
    x: number, 
    trayId: number
  ): PlacedProduct => {
    const y = calculateYPosition(product);
    const baseProduct = {
      ...product,
      x,
      y,
      placedAt: Date.now(),
      trayId
    };

    // Determine extractor type based on product stability
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
        clipDistance: extractorConstants.CLIP_DELTA // Default clip distance
      };
    }
  }, []);

  const addTray = useCallback((width: number = 300, height: number = 200) => {
    const newTray: Tray = {
      id: Date.now(),
      width,
      height,
      products: [],
      position: trays.length,
      name: `Tray ${trays.length + 1}`
    };
    setTrays(prev => [...prev, newTray]);
    return newTray;
  }, [trays.length]);

  const updateTray = useCallback((trayId: number, updates: Partial<Tray>) => {
    setTrays(prev => prev.map((tray: Tray) => {
      if (tray.id !== trayId) return tray;
      
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
      
      return updatedTray;
    }));
  }, []);

  const removeTray = useCallback((trayId: number) => {
    setTrays(prev => prev.filter((tray: Tray) => tray.id !== trayId));
  }, []);

  const addProductToTray = useCallback((
    trayId: number, 
    product: Product, 
    requestedX?: number
  ): boolean => {
    // Use the current state directly within setTrays
    let success = false;
    
    setTrays(prev => {
      const tray = prev.find((t: Tray) => t.id === trayId);
      if (!tray) {
        success = false;
        return prev; // No changes
      }

      // Determine X position
      const x = requestedX !== undefined ? requestedX : findBestXPosition(product, tray);
      if (x === null) {
        success = false;
        return prev; // No changes
      }

      // Validate placement - no overlapping allowed
      if (!canPlaceAt(x, product, tray)) {
        console.warn(`Cannot place product ${product.name} at X=${x} in tray ${trayId}`);
        success = false;
        return prev; // No changes
      }

      // Create placed product with appropriate extractor configuration
      const placedProduct = createPlacedProduct(product, x, trayId);

      success = true;
      return prev.map((tray: Tray) => 
        tray.id === trayId 
          ? { ...tray, products: [...tray.products, placedProduct] }
          : tray
      );
    });

    return success;
  }, [createPlacedProduct]);

  const removeProductFromTray = useCallback((trayId: number, productId: number) => {
    setTrays(prev => prev.map((tray: Tray) => 
      tray.id === trayId 
        ? { ...tray, products: tray.products.filter((p: PlacedProduct) => p.id !== productId) }
        : tray
    ));
  }, []);

  const moveProductBetweenTrays = useCallback((
    fromTrayId: number,
    toTrayId: number, 
    productId: number,
    requestedX?: number
  ): boolean => {
    let success = false;
    let productToMove: PlacedProduct | undefined;

    // First, get the product and remove it
    setTrays(prev => {
      const fromTray = prev.find((t: Tray) => t.id === fromTrayId);
      productToMove = fromTray?.products.find((p: PlacedProduct) => p.id === productId);
      
      if (!productToMove) {
        return prev; // No changes
      }

      // Remove from source tray
      return prev.map((tray: Tray) => 
        tray.id === fromTrayId 
          ? { ...tray, products: tray.products.filter((p: PlacedProduct) => p.id !== productId) }
          : tray
      );
    });

    if (!productToMove) return false;

    // Convert back to base Product for placement
    const baseProduct: Product = {
      id: productToMove.id,
      name: productToMove.name,
      width: productToMove.width,
      height: productToMove.height,
      depth: productToMove.depth,
      stable: productToMove.extractorType === 'low', // Derive stability from extractor type
      source: productToMove.source,
      color: productToMove.color
    };
    
    // Add to destination tray
    return addProductToTray(toTrayId, baseProduct, requestedX);
  }, [addProductToTray]);

  return {
    trays,
    addTray,
    updateTray,
    removeTray,
    addProductToTray,
    removeProductFromTray,
    moveProductBetweenTrays
  };
};
