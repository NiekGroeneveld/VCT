// src/components/common/ProductVisual.tsx
import React from 'react';
import { Product, PlacedProduct } from '../../../types/product.types';

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
    className = '',
    style = {},
    onClick,
    showLabel = true,
    showStabilityIndicator = true,
    draggable = false
}) => {
    // ✅ REAL SIZE: Direct conversion mm to px
    const width = product.width * scale;
    const height = product.height * scale;

    // Determine label content
    const labelContent = showLabel ? (
        width > 30 && height > 20 ? (
            <span className="text-xs text-center leading-tight px-1">
                {product.name.length > product.width ? 
                    product.name.substring(0, 6) + '..' : 
                    product.name
                }
            </span>
        ) : (
            <span className="text-xs font-bold">
                {product.name.charAt(0)}
            </span>
        )
    ) : null;

    return (
        <div 
            className={`relative ${draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} group ${className}`}
            onClick={onClick}
            title={`${product.name} (${product.width}×${product.height}×${product.depth}mm)`}
        >
            {/* Main product rectangle */}
            <div
                className="border-2 rounded-md flex items-center justify-center font-medium text-white shadow-sm hover:shadow-md transition-all"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: product.color,
                    borderColor: product.color,
                    ...style
                }}
            >
                {labelContent}
            </div>
            
            {/* Stability indicator for unstable products */}
            {showStabilityIndicator && !product.stable && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-white">
                    <span className="text-white text-xs leading-none flex items-center justify-center h-full">!</span>
                </div>
            )}
            
            {/* Optional: Extractor height indicator for placed products */}
            {'extractorHeight' in product && (
                <div 
                    className="absolute -left-1 border-l-2 border-dashed border-gray-400 opacity-60"
                    style={{
                        bottom: `${height}px`,
                        height: `${(product.extractorHeight || 0) * scale}px`
                    }}
                    title={`Extractor: ${product.extractorHeight}mm`}
                />
            )}
        </div>
    );
};