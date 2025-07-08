// src/components/configuration/Tray/TrayComponent.tsx

import React from "react";
import { useDrop } from "react-dnd";
import { Trash2 } from "lucide-react";
import { Tray } from "../../../types/tray.types";
import { DragItem, DropResult } from "../../../types/configuration.types";
import { PlacedProduct } from "../../../types/product.types";
import { TrayDropHandler } from "../../../services/TrayDropHandler";
import { TrayProductManager } from "../../../services/TrayProductManager";
import { TrayProductReorderService } from "../../../services/TrayProductReorderService";
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
  
  // Configure drop behavior using the drop handler service
  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    DropResult,
    { isOver: boolean; canDrop: boolean }
  >(TrayDropHandler.createDropConfig(tray, onUpdate));

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
    width: `${tray.width}px`,
    minHeight: `${tray.height}px`,
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      
      {/* Tray Header */}
      <TrayHeader 
        tray={tray} 
        onRemove={onRemove}
      />

      {/* Tray Drop Area */}
      <div ref={drop as any} className={trayClasses} style={trayStyle}>
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
    </div>
  );
};

/**
 * Tray header component with title and remove button
 */
const TrayHeader: React.FC<{
  tray: Tray;
  onRemove: () => void;
}> = ({ tray, onRemove }) => (
  <div className="flex justify-between items-center mb-3">
    <div>
      <h3 className="font-medium text-gray-800">
        Tray {tray.id} ({tray.width}mm × {tray.height}mm)
      </h3>
      <p className="text-sm text-gray-600">
        {tray.products.length} product{tray.products.length !== 1 ? "s" : ""}
      </p>
    </div>
    <button
      onClick={onRemove}
      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100"
      title="Remove tray"
    >
      <Trash2 size={16} />
    </button>
  </div>
);

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
        bottom: "0px", // Position at the bottom of the container, not beneath it
        width: `${tray.width - 4}px`,
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
  <div className="relative" style={{ padding: 0, margin: 0, height: "100%" }}>
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
      bottom: `${-tray.height}px`,
      width: `${tray.width - 4}px`,
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