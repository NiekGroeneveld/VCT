// src/hooks/useGridDimensions.tsx
import React from 'react';
import { Product } from '../types/product.types';

export const useGridDimensions = (
    containerRef: HTMLDivElement | null,
    products: Product[],
    minCols: number = 1,
    maxCols: number = 8
) => {
    const [gridDimensions, setGridDimensions] = React.useState({
        cols: 4
    });

    const calculateGridDimensions = React.useCallback(() => {
        if (!containerRef || products.length === 0) return;

        // ✅ FULL CONTAINER WIDTH: Get the actual container width
        const containerWidth = containerRef.clientWidth;
        const gap = 12; // Gap between grid items
        const containerPadding = 32; // Total left + right padding (16px each side)
        
        // ✅ ACTUAL AVAILABLE WIDTH: Subtract padding from container width
        const availableWidth = containerWidth - containerPadding;
        
        // ✅ REAL SIZE: Find widest product at 1:1 scale (1mm = 1px)  
        const widestProductWidth = Math.max(...products.map(p => p.width));
        
        console.log('=== GRID CALCULATION ===');
        console.log('Container width:', containerWidth);
        console.log('Available width:', availableWidth);
        console.log('Widest product:', widestProductWidth);
        
        // ✅ NO CROPPING: Calculate columns that fit without exceeding available width
        let cols = minCols;
        
        // ✅ SMART LOGIC: Don't show more columns than products
        const maxColumnsNeeded = Math.min(maxCols, products.length);
        
        console.log(`Smart limit: max ${maxColumnsNeeded} columns (have ${products.length} products)`);
        
        // Try increasing columns until we can't fit anymore
        for (let testCols = minCols; testCols <= maxColumnsNeeded; testCols++) {
            const totalGapWidth = (testCols - 1) * gap;
            const totalProductWidth = testCols * widestProductWidth;
            const requiredWidth = totalProductWidth + totalGapWidth;
            
            console.log(`Testing ${testCols} columns: need ${requiredWidth}px, have ${availableWidth}px`);
            
            if (requiredWidth <= availableWidth) {
                cols = testCols; // This many columns fit
                console.log(`✅ ${testCols} columns FIT`);
            } else {
                console.log(`❌ ${testCols} columns TOO WIDE`);
                break; // Can't fit more columns
            }
        }
        
        console.log('Final columns:', cols);
        console.log('========================');
        
        // ✅ ENSURE AT LEAST minCols: Even if it means horizontal scrolling
        cols = Math.max(minCols, cols);
        
        setGridDimensions({
            cols: cols
        });
    }, [containerRef, products, minCols, maxCols]);

    React.useEffect(() => {
        calculateGridDimensions();
    }, [calculateGridDimensions]);

    React.useEffect(() => {
        const handleResize = () => {
            calculateGridDimensions();
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [calculateGridDimensions]);

    return gridDimensions;
};

// ✅ ALSO ADD DEFAULT EXPORT for compatibility
export default useGridDimensions;