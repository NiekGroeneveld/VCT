// src/components/configuration/Tray/TrayComponent.tsx

import React from "react";
import { useDrop } from "react-dnd";
import { Tray } from "../types/tray.types";
import { DragItem, DropResult } from "../../machine-configuration/types/configuration.types";
import { PlacedProduct } from "../../product-management/types/product.types";
import { TrayDropHandler } from "../services/TrayDropHandler";
import { TrayProductManager } from "../services/TrayProductManager";
import { TrayProductReorderService } from "../services/TrayProductReorderService";
import { DraggableTrayProduct } from "./DraggableTrayProduct";

interface TrayComponentProps {
  tray: Tray;
  onUpdate: (tray: Tray) => void;
  onRemove: () => void;
  onProductMoveBetweenTrays?: (product: PlacedProduct, fromIndex: number, fromTrayId: number, toTrayId: number) => void;
  variant?: 'standalone' | 'managed'; // New prop to control behavior
}

export const TrayComponent: React.FC<TrayComponentProps> = ({
  tray,
  onUpdate,
  onRemove,
  onProductMoveBetweenTrays,
  variant = 'standalone'
}) => {
  
  /**
   * Handles cross-tray product movement coordination
   */
  const handleCrossTrayMove = (sourceTrayId: number, targetTrayId: number, sourceIndex: number, targetIndex?: number) => {
    // This gets called when a TRAY_PRODUCT is dropped on this tray from another tray
    // We need to find the source product to pass to the parent handler
    console.log(`Cross-tray move: from tray ${sourceTrayId} index ${sourceIndex} to tray ${targetTrayId}`);
    
    // Since we don't have direct access to other trays here, we'll need to use a different approach
    // Let's emit a custom event that the parent (ConfigurationArea) can listen for
    const moveEvent = new CustomEvent('requestCrossTrayMove', {
      detail: { sourceTrayId, targetTrayId, sourceIndex, targetIndex },
      bubbles: true
    });
    
    // Dispatch the event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(moveEvent);
    }
  };

  // Configure drop behavior using the enhanced drop handler service
  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    DropResult,
    { isOver: boolean; canDrop: boolean }
  >(TrayDropHandler.createDropConfig(tray, onUpdate, handleCrossTrayMove));

  /**
   * Handles product removal by index
   */
  const handleRemoveProduct = (productIndex: number) => {
    const updatedTray = TrayProductManager.removeProductByIndex(tray, productIndex);
    onUpdate(updatedTray);
  };

  /**
   * Handles reordering products within the tray
   */
  const handleReorderProducts = (fromIndex: number, toIndex: number) => {
    const updatedTray = TrayProductReorderService.reorderProducts(tray, fromIndex, toIndex);
    onUpdate(updatedTray);
  };

  /**
   * Handles moving product between trays
   */
  const handleMoveBetweenTrays = (product: PlacedProduct, fromIndex: number, targetTrayId: number) => {
    if (onProductMoveBetweenTrays && targetTrayId !== tray.id) {
      onProductMoveBetweenTrays(product, fromIndex, tray.id, targetTrayId);
    }
  };

  // Dynamic styling based on drop state
  const trayClasses = `
    relative border-2 transition-colors duration-200
    ${isOver && canDrop ? "border-green-400 bg-green-50" : ""}
    ${isOver && !canDrop ? "border-red-400 bg-red-50" : ""}
    ${!isOver ? "border-gray-300 bg-gray-100" : ""}
  `.trim();

  const trayStyle = {
    width: `${tray.width}px`, // Direct mm width
    height: `${tray.height}px`, // Direct mm height
  };

  return (
    <div ref={drop as any} className={`${trayClasses} group`} style={trayStyle}>
      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity z-20"
        title="Remove tray"
      >
        ×
      </button>
      
      {tray.products.length === 0 ? (
        <TrayEmptyState tray={tray} />
      ) : (
        <TrayProductsDisplay 
          tray={tray}
          onRemoveProduct={handleRemoveProduct}
          onReorderProducts={handleReorderProducts}
          onMoveBetweenTrays={handleMoveBetweenTrays}
        />
      )}

      {/* Drop Feedback */}
      <TrayDropFeedback isOver={isOver} canDrop={canDrop} />
    </div>
  );
};

/**
 * Empty state when tray has no products
 */
const TrayEmptyState: React.FC<{ tray: Tray }> = ({ tray }) => (
  <div className="flex items-center justify-center h-32 text-gray-500">
    <div className="text-center">
      <div className="text-sm">Drop products here</div>
      <div className="text-xs">(Drag from product list)</div>
    </div>
    {/* Tray Base for Empty State */}
    <div
      className="absolute bg-gray-200 border border-gray-400"
      style={{
        left: "0px",
        bottom: "0px", // Position at the bottom of the container
        width: `${tray.width}px`, // Account for padding in mm
        height: "28px",
        zIndex: 0,
      }}
    />
  </div>
);

/**
 * Displays all products in the tray with drag and drop functionality
 */
const TrayProductsDisplay: React.FC<{
  tray: Tray;
  onRemoveProduct: (index: number) => void;
  onReorderProducts: (fromIndex: number, toIndex: number) => void;
  onMoveBetweenTrays: (product: PlacedProduct, fromIndex: number, targetTrayId: number) => void;
}> = ({ tray, onRemoveProduct, onReorderProducts, onMoveBetweenTrays }) => (
  <div className="relative" style={{ padding: 0, margin: 0, height: "100%", bottom: "0px" }}>
    <TrayBase tray={tray} />
    {tray.products.map((product, index) => (
      <DraggableTrayProduct
        key={`${product.id}-${index}-${product.placedAt}`} // Unique key that includes placement time
        product={product}
        tray={tray}
        index={index}
        onReorder={onReorderProducts}
        onRemove={() => onRemoveProduct(index)}
        onMoveBetweenTrays={onMoveBetweenTrays}
      />
    ))}
  </div>
);

/**
 * Visual representation of the tray base
 */
const TrayBase: React.FC<{ tray: Tray }> = ({ tray }) => (
  <div
    className="absolute bg-gray-200 border border-gray-400"
    style={{
      left: "0px",
      bottom: `0px`, // Direct mm positioning
      width: `${tray.width}px`, // Account for padding in mm
      height: "28px",
      zIndex: 1,
    }}
  />
);

/**
 * Feedback shown during drag operations
 */
const TrayDropFeedback: React.FC<{
  isOver: boolean;
  canDrop: boolean;
}> = ({ isOver, canDrop }) => {
  if (!isOver) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className={`text-lg font-semibold ${
          canDrop ? "text-green-600" : "text-red-600"
        }`}
      >
        {canDrop ? "Drop here" : "Cannot fit here"}
      </div>
    </div>
  );
};