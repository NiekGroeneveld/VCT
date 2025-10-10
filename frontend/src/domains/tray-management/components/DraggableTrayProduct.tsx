import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Tray } from "../types/tray.types";
import { PlacedProduct } from "../../product-management/types/product.types";
import { DragItem } from "../../machine-configuration/types/configuration.types";
import { ProductVisual } from "../../product-management/components/ProductVisual";
import { CrossTrayDragDropService } from "../services/CrossTrayDragDropService";
import { useScaling } from "../../../hooks/useScaling";

interface DraggableTrayProductProps{
    product: PlacedProduct;
    tray: Tray;
    index: number;
    onReorder: (fromIndex: number, toIndex: number) => void;
    onRemove: () => void;
    onMoveBetweenTrays?: (product: PlacedProduct, fromIndex: number, targetTrayId: number) => void;
}

export const DraggableTrayProduct: React.FC<DraggableTrayProductProps> = ({
    product,
    tray,
    index,
    onReorder,
    onRemove,
    onMoveBetweenTrays
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scaledValue, scale } = useScaling();
    
    //Drag functionality
    const [{isDragging}, drag] = useDrag({
        type: "TRAY_PRODUCT",
        item: (): DragItem => ({
            type: "TRAY_PRODUCT",
            product,
            fromTray: tray.id,
            sourceIndex: index,
            sourceTrayId: tray.id,
            // Legacy properties for backwards compatibility
            index,
            trayId: tray.id
        }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
    });

    //Drop functionality
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: "TRAY_PRODUCT",
        hover: (draggedItem: DragItem, monitor) => {
        if(!ref.current) return;
        
        const dragIndex = draggedItem.index;
        const hoverIndex = index;
        

        //Same item
        if (dragIndex === hoverIndex) {
            return;
        }

        // Only handle reordering within the same tray
        if(draggedItem.trayId === tray.id && dragIndex !== undefined) {
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
            const clientOffset = monitor.getClientOffset();

            if(!clientOffset) return;

            const hoverClientX = clientOffset.x - hoverBoundingRect.left;
            
            //Only perform the move when the mouse has crossed half of the item's width
            if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
            if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

            //Perform the reorder
            onReorder(dragIndex, hoverIndex);

            //Update the dragged items index to prevent repeated calls
            draggedItem.index = hoverIndex;
        }
    },
    drop: (draggedItem: DragItem) => {
      // Handle cross-tray moves
      if (draggedItem.trayId !== tray.id && onMoveBetweenTrays && draggedItem.product && draggedItem.index !== undefined) {
        // Cast to PlacedProduct since we know it comes from a tray
        onMoveBetweenTrays(draggedItem.product as PlacedProduct, draggedItem.index, tray.id);
      }
    },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

    //Combine drag and drop refs
    drag(drop(ref));

    const opacity = isDragging ? 0.5 : 1;
    const transform = isDragging ? "scale(0.95)" : "none";

    return (
    <>
      {/* Extractor Visual */}
      <div
        className="absolute bg-gray-500 border border-gray-800"
        style={{
          left: `${scaledValue(product.x)}px`,
          bottom: `0px`, // Position at bottom of tray container
          width: `${scaledValue(product.width)}px`,
          height: `${scaledValue(product.extractorHeight)}px`,
          zIndex: 0,
          opacity,
        }}
        title={`${product.extractorType} extractor (${product.extractorHeight}mm)`}
      />

      {/* Product Visual with Drag & Drop */}
      <div
        ref={ref}
        className={`absolute group cursor-move ${
          isOver && canDrop ? "ring-2 ring-blue-400" : ""
        }`}
        style={{
          left: `${scaledValue(product.x)}px`,
          bottom: `${scaledValue(product.y)}px`, // Position from bottom of tray container
          zIndex: 2,
          opacity,
          transform,
          transition: isDragging ? "none" : "all 0.2s ease",
        }}
      >
        <ProductVisual
          product={product}
          scale={scale} // Pass the current scale factor
          draggable={false} // Handled by react-dnd
          showLabel={true}
          showStabilityIndicator={true}
        />
        
        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Remove product"
        >
          ×
        </button>

        {/* Drag Handle */}
        <div className="absolute -top-1 -left-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
          ⋮⋮
        </div>

        {/* Order Indicator */}
        <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-br opacity-0 group-hover:opacity-100 transition-opacity">
          #{index + 1}
        </div>
      </div>

      {/* Drop Indicators */}
      {isOver && canDrop && (
        <div
          className="absolute bg-blue-400 opacity-50"
          style={{
            left: `${scaledValue(product.x - 2)}px`,
            bottom: `0px`, // Position at bottom of tray container
            width: `${scaledValue(4)}px`,
            height: `${scaledValue(product.extractorHeight + product.height)}px`,
            zIndex: 5,
          }}
        />
      )}
    </>
  );
}