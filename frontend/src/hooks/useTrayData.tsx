// src/hooks/useTrayData.tsx

import { useState, useCallback } from "react";
import { Tray, TrayConstants } from "../types/tray.types";
import { PlacedProduct, Product } from "../types/product.types";
import {
  findBestXPosition,
  canPlaceAt,
  calculateYPosition,
} from "../utils/trayUtils";
import { extractorConstants } from "../types/extractor.types";
import { getCanalHeight } from "../utils/productUtils";
import { TrayProductReorderService } from "../services/TrayProductReorderService";

export const useTrayData = () => {
  const [trays, setTrays] = useState<Tray[]>([]);

  /**
   * Assigns tray indices based on X position (left to right order)
   */
  const assignOnTrayIndex = useCallback((tray: Tray): Tray => {
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
  }, []);

  /**
   * Creates a PlacedProduct from a Product with proper extractor configuration
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
      trayId,
      onTrayIndex: 0 // Will be recalculated by assignOnTrayIndex
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
        clipDistance: extractorConstants.CLIP_DELTA
      };
    }
  }, []);

  /**
   * Recalculates tray height based on its products
   */
  const calculateTrayHeight = useCallback((products: PlacedProduct[]): number => {
    if (products.length === 0) {
      return TrayConstants.MINIMAL_TRAY_HEIGHT;
    }

    const tallestCanalHeight = Math.max(...products.map(p => getCanalHeight(p)));
    return Math.max(tallestCanalHeight, TrayConstants.MINIMAL_TRAY_HEIGHT);
  }, []);

  /**
   * Adds a new tray with specified dimensions or defaults
   */
  const addTray = useCallback((width: number = TrayConstants.DEFAULT_TRAY_WIDTH, height: number = TrayConstants.MINIMAL_TRAY_HEIGHT) => {
    const newTray: Tray = {
      id: Date.now(),
      width,
      height,
      products: [],
      dotPosition: trays.length + 1,
      name: `Tray ${trays.length + 1}`
    };
    setTrays(prev => [...prev, newTray]);
    return newTray;
  }, [trays.length]);

  /**
   * Updates a tray with new properties and assigns correct indices
   */
  const updateTray = useCallback((trayId: number, updates: Partial<Tray>) => {
    setTrays(prev => prev.map((tray: Tray) => {
      if (tray.id !== trayId) return tray;
      
      let updatedTray = { ...tray, ...updates };
      
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
      
      // Assign correct onTrayIndex based on X positions
      updatedTray = assignOnTrayIndex(updatedTray);
      
      return updatedTray;
    }));
  }, [assignOnTrayIndex]);

  /**
   * Removes a tray completely
   */
  const removeTray = useCallback((trayId: number) => {
    setTrays(prev => prev.filter((tray: Tray) => tray.id !== trayId));
  }, []);

  /**
   * Adds a product to a specific tray
   */
  const addProductToTray = useCallback((
    trayId: number, 
    product: Product, 
    requestedX?: number
  ): boolean => {
    let success = false;
    
    setTrays(prev => {
      const tray = prev.find((t: Tray) => t.id === trayId);
      if (!tray) {
        success = false;
        return prev;
      }

      // Determine X position
      const x = requestedX !== undefined ? requestedX : findBestXPosition(product, tray);
      if (x === null) {
        success = false;
        return prev;
      }

      // Validate placement
      if (!canPlaceAt(x, product, tray)) {
        console.warn(`Cannot place product ${product.name} at X=${x} in tray ${trayId}`);
        success = false;
        return prev;
      }

      // Create placed product
      const placedProduct = createPlacedProduct(product, x, trayId);
      const updatedProducts = [...tray.products, placedProduct];
      const newHeight = Math.max(tray.height, getCanalHeight(placedProduct));

      let updatedTray: Tray = {
        ...tray, 
        products: updatedProducts,
        height: newHeight
      };

      // Assign correct onTrayIndex based on X positions
      updatedTray = assignOnTrayIndex(updatedTray);

      success = true;
      return prev.map((tray: Tray) => 
        tray.id === trayId ? updatedTray : tray
      );
    });

    return success;
  }, [createPlacedProduct, assignOnTrayIndex]);

  /**
   * Removes a product from a tray by product ID (keeps for backward compatibility)
   */
  const removeProductFromTray = useCallback((trayId: number, productId: number) => {
    setTrays(prev => prev.map((tray: Tray) => {
      if (tray.id !== trayId) return tray;
      
      const updatedProducts = tray.products.filter((p: PlacedProduct) => p.id !== productId);
      const newHeight = calculateTrayHeight(updatedProducts);
      
      let updatedTray: Tray = {
        ...tray,
        products: updatedProducts,
        height: newHeight
      };

      // Assign correct onTrayIndex based on X positions
      updatedTray = assignOnTrayIndex(updatedTray);
      
      return updatedTray;
    }));
  }, [calculateTrayHeight, assignOnTrayIndex]);

  /**
   * Removes a product from a tray by array index
   */
  const removeProductFromTrayByIndex = useCallback((trayId: number, productIndex: number) => {
    setTrays(prev => prev.map((tray: Tray) => {
      if (tray.id !== trayId) return tray;
      
      const updatedProducts = tray.products.filter((_, index) => index !== productIndex);
      const newHeight = calculateTrayHeight(updatedProducts);
      
      let updatedTray: Tray = {
        ...tray,
        products: updatedProducts,
        height: newHeight
      };

      // Assign correct onTrayIndex based on X positions
      updatedTray = assignOnTrayIndex(updatedTray);
      
      return updatedTray;
    }));
  }, [calculateTrayHeight, assignOnTrayIndex]);

  /**
   * Reorders products within a tray by moving from one index to another
   */
  const reorderProductsInTray = useCallback((trayId: number, fromIndex: number, toIndex: number) => {
    setTrays(prev => prev.map((tray: Tray) => {
      if (tray.id !== trayId) return tray;
      
      // Use TrayProductReorderService for advanced spacing
      const updatedTray = TrayProductReorderService.reorderProducts(tray, fromIndex, toIndex, true);
      
      // Assign correct onTrayIndex based on X positions
      return assignOnTrayIndex(updatedTray);
    }));
  }, [assignOnTrayIndex]);

  /**
   * Moves a product from one tray position to another tray position
   */
  const moveProductBetweenTrayPositions = useCallback((
    fromTrayId: number,
    fromIndex: number,
    toTrayId: number,
    toIndex?: number
  ): boolean => {
    let success = false;
    let productToMove: PlacedProduct | undefined;

    // Get the product to move
    const fromTray = trays.find(t => t.id === fromTrayId);
    if (!fromTray || fromIndex >= fromTray.products.length) {
      return false;
    }
    
    productToMove = fromTray.products[fromIndex];
    if (!productToMove) return false;

    setTrays(prev => {
      const newTrays = prev.map(tray => {
        if (tray.id === fromTrayId) {
          // Remove from source tray
          const updatedProducts = tray.products.filter((_, index) => index !== fromIndex);
          
          // Use advanced spacing for source tray
          const repositionedProducts = TrayProductReorderService.calculateAdvancedSpacing(
            tray, 
            updatedProducts
          );
          
          let updatedSourceTray: Tray = {
            ...tray,
            products: repositionedProducts,
            height: calculateTrayHeight(repositionedProducts)
          };

          // Assign correct onTrayIndex based on X positions
          updatedSourceTray = assignOnTrayIndex(updatedSourceTray);
          
          return updatedSourceTray;
        }
        
        if (tray.id === toTrayId && productToMove) {
          // Add to destination tray
          const updatedProducts = [...tray.products];
          const insertIndex = toIndex !== undefined ? Math.min(toIndex, updatedProducts.length) : updatedProducts.length;
          
          // Update product with new tray information
          const updatedProduct = {
            ...productToMove,
            trayId: toTrayId,
            placedAt: Date.now(),
            onTrayIndex: 0 // Will be recalculated by assignOnTrayIndex
          };
          
          updatedProducts.splice(insertIndex, 0, updatedProduct);
          
          // Recalculate positions using advanced spacing
          const repositionedProducts = TrayProductReorderService.calculateAdvancedSpacing(
            tray, 
            updatedProducts
          );
          
          const newHeight = Math.max(tray.height, ...repositionedProducts.map(p => getCanalHeight(p)));
          
          let updatedTargetTray: Tray = {
            ...tray,
            products: repositionedProducts,
            height: newHeight
          };

          // Assign correct onTrayIndex based on X positions
          updatedTargetTray = assignOnTrayIndex(updatedTargetTray);
          
          success = true;
          return updatedTargetTray;
        }
        
        return tray;
      });
      
      return newTrays;
    });

    return success;
  }, [trays, calculateTrayHeight, assignOnTrayIndex]);

  /**
   * Gets a specific tray by ID
   */
  const getTrayById = useCallback((trayId: number): Tray | undefined => {
    return trays.find(tray => tray.id === trayId);
  }, [trays]);

  /**
   * Updates a specific tray (for external state synchronization)
   */
  const updateTrayState = useCallback((updatedTray: Tray) => {
    // Ensure onTrayIndex is correctly assigned before updating state
    const trayWithCorrectIndices = assignOnTrayIndex(updatedTray);
    
    setTrays(prev => prev.map(tray => 
      tray.id === updatedTray.id ? trayWithCorrectIndices : tray
    ));
  }, [assignOnTrayIndex]);

  return {
    // State
    trays,
    
    // Tray management
    addTray,
    updateTray,
    removeTray,
    getTrayById,
    updateTrayState,
    
    // Product management
    addProductToTray,
    removeProductFromTray,
    removeProductFromTrayByIndex,
    reorderProductsInTray,
    moveProductBetweenTrayPositions,
    
    // Utilities
    calculateTrayHeight,
    createPlacedProduct,
    assignOnTrayIndex
  };
};