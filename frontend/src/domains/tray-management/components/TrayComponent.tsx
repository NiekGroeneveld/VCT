import React from "react";
import { useDrop } from "react-dnd";
import { Tray } from "../types/tray.types";
import { DragItem, DropResult } from "../../machine-configuration/types/configuration.types";
import { PlacedProduct } from "../../product-management/types/product.types";
import { TrayDropHandler } from "../services/TrayDropHandler";
import { TrayProductManager } from "../services/TrayProductManager";
import { TrayProductReorderService } from "../services/TrayProductReorderService";
import { DraggableTrayProduct } from "./DraggableTrayProduct";
import { useScaling } from "../../../hooks/useScaling";
import { configurationService } from "../../machine-configuration/services/ConfigurationService";
import { useConfig } from "../../../Context/useConfig";
import { getPalletConfigurationString } from "../../product-management/services/palletService";

interface TrayComponentProps {
  tray: Tray;
  onUpdate: (tray: Tray) => void;
  onRemove: () => void;
  onProductMoveBetweenTrays?: (product: PlacedProduct, fromIndex: number, fromTrayId: number, toTrayId: number) => void;
  variant?: 'standalone' | 'managed'; // New prop to control behavior
  companyId?: number; // Add company ID for API calls
  configurationId?: number; // Add configuration ID for API calls
}

export const TrayComponent: React.FC<TrayComponentProps> = ({
  tray,
  onUpdate,
  onRemove,
  onProductMoveBetweenTrays,
  variant = 'standalone',
  companyId,
  configurationId
}) => {
  const { scaledValue } = useScaling();
  
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
  const handleRemoveProduct = async (productIndex: number) => {
    if (!companyId || !configurationId) {
      console.error('Company ID or Configuration ID not provided for product removal');
      return;
    }

    try {
      // Get the product to find its position on tray
      const productToRemove = tray.products[productIndex];
      if (!productToRemove) {
        console.error('Product not found at index:', productIndex);
        return;
      }

      // Call API to remove product from backend
      await configurationService.RemoveProductFromTrayAPI(
        companyId,
        configurationId,
        tray.id,
        productToRemove.onTrayIndex
      );

      // Update local state by removing the product
      const updatedTray = TrayProductManager.removeProductByIndex(tray, productIndex);
      onUpdate(updatedTray);

      console.log(`Successfully removed product ${productToRemove.name} from tray ${tray.id}`);
    } catch (error) {
      console.error('Failed to remove product:', error);
      // You might want to show a user-friendly error message here
    }
  };

  /**
   * Handles reordering products within the tray
   */
  const handleReorderProducts = async (fromIndex: number, toIndex: number) => {
    // 0-based indices (backend expects 0-based now)
    const oldIndex = fromIndex;
    const newIndex = toIndex;

    // Optimistic update locally
    const prevTray = tray;
    const updatedTray = TrayProductReorderService.reorderProducts(tray, fromIndex, toIndex);
    onUpdate(updatedTray);

    if (!companyId || !configurationId) {
      console.error('Company ID or Configuration ID not provided for reorder');
      return;
    }

    try {
      await configurationService.SameTrayReorderAPI(
        companyId,
        configurationId,
        tray.id,
        oldIndex,
        newIndex
      );
    } catch (err) {
      console.error('Reorder API failed, rolling back UI change', err);
      // Rollback UI on failure
      onUpdate(prevTray);
    }
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
    width: `${scaledValue(tray.trayWidth)}px`, // Scaled width
    height: `${scaledValue(tray.trayHeight)}px`, // Scaled height
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
const TrayEmptyState: React.FC<{ tray: Tray }> = ({ tray }) => {
  const { scaledValue } = useScaling();
  
  const trayBaseHeight = 28; // Height of the tray base in mm
  const availableTextHeight = tray.trayHeight - trayBaseHeight; // Space above the tray base
  
  return (
    <div 
      className="relative text-gray-500"
      style={{ height: `${scaledValue(tray.trayHeight)}px` }}
    >
      {/* Text positioned in the upper portion, above the tray base */}
      <div 
        className="absolute inset-x-0 flex items-center justify-center"
        style={{ 
          top: '0px',
          height: `${scaledValue(availableTextHeight)}px` // Only use space above tray base
        }}
      >
        <div className="text-center">
          <div className="text-sm">Drop products here</div>
          <div className="text-xs">(Drag from product list)</div>
        </div>
      </div>
      
      {/* Tray Base for Empty State - slightly narrower to fit within drop area */}
      <div
        className="absolute bg-gray-200 border border-gray-400"
        style={{
          left: `${scaledValue(0)}px`, // Small margin from edges
          bottom: `${scaledValue(3)}px`,
          width: `${scaledValue(tray.trayWidth - 3)}px`, // Slightly narrower (4px margin on each side)
          height: `${scaledValue(trayBaseHeight)}px`,
          zIndex: 0,
        }}
      />
    </div>
  );
};

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
    <PalletStringsOverlay tray={tray} />
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
 * Visual representation of the tray base (gray bar at bottom)
 */
const TrayBase: React.FC<{ tray: Tray }> = ({ tray }) => {
  const { scaledValue } = useScaling();
  
  return (
    <div
      className="absolute bg-gray-200 border border-gray-400"
      style={{
        left: `${scaledValue(0)}px`,
        bottom: `${scaledValue(0)}px`,
        width: `${scaledValue(tray.trayWidth - 3)}px`,
        height: `${scaledValue(28)}px`,
        zIndex: 1,
      }}
    />
  );
};

/**
 * Overlay component to render pallet configuration strings on top of tray base
 * Separated from TrayBase to avoid nested absolute positioning issues in PDF export
 */
const PalletStringsOverlay: React.FC<{ tray: Tray }> = ({ tray }) => {
  const { scaledValue } = useScaling();
  const { selectedConfiguration } = useConfig();
  const palletDelta = selectedConfiguration?.configurationTypeData?.palletDelta;
  
  if (!palletDelta) return null;
  
  // Get high extractor products (extractorType comes from backend as "High" or "Low")
  const highExtractorProducts = tray.products.filter(p => 
    (p.extractorType as string)?.toLowerCase() === 'high'
  );
  
  return (
    <>
      {highExtractorProducts.map((product, index) => {
        const palletString = getPalletConfigurationString(product, palletDelta);
        
        return (
          <div
            key={`pallet-overlay-${product.id}-${index}`}
            style={{
              position: 'absolute',
              left: `${scaledValue(product.x)}px`,
              bottom: `${scaledValue(4)}px`,
              width: `${scaledValue(product.width)}px`,
              height: `${scaledValue(20)}px`,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${scaledValue(16)}px`,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: '#000',
              pointerEvents: 'none',
            }}
            title={`Pallet Configuration: ${palletString}`}
          >
            {palletString}
          </div>
        );
      })}
    </>
  );
};

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