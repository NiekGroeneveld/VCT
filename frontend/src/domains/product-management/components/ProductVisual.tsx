// src/components/common/ProductVisual.tsx
import React from "react";
import { useDrag } from "react-dnd";
import { DragItem } from '../../machine-configuration/types/configuration.types'; // Adjust the import path as needed
import { Product, PlacedProduct } from "../types/product.types";
import { useCompany } from "../../../Context/useCompany";
import { useConfig } from "../../../Context/useConfig";
import { configurationService } from "../../../domains/machine-configuration/services/ConfigurationService";

interface ProductVisualProps {
  product: Product | PlacedProduct;
  scale?: number; // Optional scale override (default is 1:1 real size)
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  showLabel?: boolean;
  showStabilityIndicator?: boolean;
  draggable?: boolean;
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
          `Dropped product ${item.product.name} into tray ${dropResult.trayId}`
        );
        if (companyId && configurationId) {
          const positionOnTray = dropResult.targetIndex ?? 0;
          configurationService.PlaceProductOnTrayAPI(Number(companyId), Number(configurationId), dropResult.trayId, item.product.id, positionOnTray);
        }
        else{
          console.error("Cannot place product on tray: Missing company or configuration ID");
        }

      } else if (item.product) {
        console.log(
          `Product ${item.product.name} was dragged but not dropped into a tray`
        );
      }
      else {
        console.log("Drag operation ended without a valid item or drop result");
      }
    },
  });

  const width = product.width * scale;
  const height = product.height * scale;

  // Determine label content
  const labelContent = showLabel ? (
    width > 30 && height > 20 ? (
      <span className="text-xs text-center leading-tight px-1">
        {product.name.length > product.width
          ? product.name.substring(0, 6) + ".."
          : product.name}
      </span>
    ) : (
      <span className="text-xs font-bold">{product.name.charAt(0)}</span>
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
    backgroundColor: product.color || product.ColorHex || "#dbeafe",
    ...style,
    ...dragStyles,
  };

  const productElement = (
    <div className={baseClasses} style={combinedStyles} onClick={onClick}>
      {labelContent}

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

  