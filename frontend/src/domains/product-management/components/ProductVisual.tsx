// src/components/common/ProductVisual.tsx
import React from "react";
import { useDrag } from "react-dnd";
import { DragItem } from '../../machine-configuration/types/configuration.types'; // Adjust the import path as needed
import { Product, PlacedProduct } from "../types/product.types";
import { useCompany } from "../../../Context/useCompany";
import { useConfig } from "../../../Context/useConfig";
import { configurationService } from "../../../domains/machine-configuration/services/ConfigurationService";
import { MoreVertical } from "lucide-react";

interface ProductVisualProps {
  product: Product | PlacedProduct;
  scale?: number; // Optional scale override (default is 1:1 real size)
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  showLabel?: boolean;
  showStabilityIndicator?: boolean;
  draggable?: boolean;
  showInfoButton?: boolean; // New prop to control info button visibility
  onInfoClick?: () => void; // Callback when info button is clicked
}
export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  scale = 1, // ✅ DEFAULT: 1mm = 1px (real size)
  className = "",
  style = {},
  onClick,
  showLabel = true,
  showStabilityIndicator = true,
  draggable = false,
  showInfoButton = false,
  onInfoClick,
}) => {
  const { selectedCompany } = useCompany();
  const { selectedConfiguration } = useConfig();
  const companyId = selectedCompany ? Number(selectedCompany.id) : null;
  const configurationId = selectedConfiguration ? Number(selectedConfiguration.id) : null;
  // ✅ REAL SIZE: Direct conversion mm to px
  const [{ isDragging }, drag] = useDrag<
    DragItem,
    any,
    { isDragging: boolean }
  >({
    //Type identifier - mast match accept type in drop target
    type: "PRODUCT",

    item: () => {
      console.log("Dragging product:", product);
      return {
        type: "PRODUCT" as const,
        product: product as Product, // Cast to Product type
        fromTray: "trayId" in product ? product.trayId : undefined,
      };
    },

    canDrag: () => draggable, // Only allow dragging if draggable is true
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),

    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item.product && dropResult ) {
        console.log(
          `Dropped product ${item.product.name || 'Unknown'} into tray ${dropResult.trayId}`
        );
        if (companyId && configurationId) {
          // Backend expects 1-based OnTrayIndex
          const positionOnTray = (dropResult.targetIndex ?? 0) + 1;
          configurationService.PlaceProductOnTrayAPI(Number(companyId), Number(configurationId), dropResult.trayId, item.product.id, positionOnTray)
            .then(() => {
              // Dispatch event to refresh products in configuration list
              window.dispatchEvent(new CustomEvent('refreshProductsInConfiguration'));
            })
            .catch((error) => {
              console.error('Failed to place product on tray:', error);
            });
        }
        else{
          console.error("Cannot place product on tray: Missing company or configuration ID");
        }

      } else if (item.product) {
        console.log(
          `Product ${item.product.name || 'Unknown'} was dragged but not dropped into a tray`
        );
      }
      else {
        console.log("Drag operation ended without a valid item or drop result");
      }
    },
  });

  const width = product.width * scale;
  const height = product.height * scale;

  // Calculate text color based on background brightness
  const getTextColor = (hexColor: string): string => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate luminance (perceived brightness)
    // Using the relative luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark backgrounds, black for light backgrounds
    return luminance < 0.5 ? '#FFFFFF' : '#000000';
  };

  const backgroundColor = product.color || product.ColorHex || "#dbeafe";
  const textColor = getTextColor(backgroundColor);

  // Determine label content
  const productName = product?.name || 'Unknown';
  const isActive = product?.isActive ?? true; // Default to true if not specified

  const labelContent = showLabel ? (
    width > 30 && height > 20 ? (
      <div className="text-center leading-tight px-1" style={{ color: textColor }}>
        {/* Inactive Label */}
        {!isActive && (
          <div className="text-[0.6rem] font-bold text-red-600 mb-0.5">
            Verwijderd
          </div>
        )}
        <div className="text-xs font-bold">
          {productName.length > product.width / scale
            ? productName.substring(0, 6) + ".."
            : productName}
        </div>
        <div className="text-[0.6rem] mt-0.5 flex flex-col items-center justify-center gap-0.5">
          <span className="flex items-center gap-0.5">
            <span className="font-bold">|</span>
            <span>{product.height}</span>
          </span>
          <span className="flex items-center gap-0.5">
            <span className="font-bold">—</span>
            <span>{product.width}</span>
          </span>
        </div>
      </div>
    ) : (
      <span className="text-xs font-bold" style={{ color: textColor }}>{productName.charAt(0)}</span>
    )
  ) : null;

  const baseClasses = `relative ${
    draggable ? "cursor-move" : "cursor-pointer"
  } border border-gray-400 bg-blue-100 flex items-center justify-center ${className}`;

  const dragStyles = isDragging
    ? {
        opacity: 0.5,
        transform: "scale(1.05)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }
    : {};

  const combinedStyles = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: backgroundColor,
    opacity: !isActive ? 0.4 : 1, // Make inactive products semi-transparent
    ...style,
    ...dragStyles,
  };

  const productElement = (
    <div className={`${baseClasses} group`} style={combinedStyles} onClick={onClick}>
      {labelContent}

      {/* Info Button - Only shown when showInfoButton is true */}
      {showInfoButton && onInfoClick && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick();
          }}
          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     hover:bg-gray-100 z-10"
          title="Product Information"
        >
          <MoreVertical className="w-3 h-3 text-gray-700" />
        </button>
      )}

      {/* Stability indicator */}
      {showStabilityIndicator && !product.stable && (
        <div
          className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
          title="Unstable product"
        />
      )}
    </div>
  );

  return draggable ? drag(productElement) : productElement;
};

  