import React from 'react';
import { useDrop } from 'react-dnd';
import { Trash2 } from 'lucide-react';
import { Tray } from '../../../types/tray.types';
import { DragItem, DropResult } from '../../../types/configuration.types';
import { Product, PlacedProduct } from '../../../types/product.types';
import { ProductVisual } from '../Product/ProductVisual';

import { findBestXPosition, canPlaceAt, calculateYPosition } from '../../../utils/trayUtils';
import { extractorConstants } from '../../../types/extractor.types';

interface TrayComponentProps {
    tray: Tray;
    onUpdate: (tray: Tray) => void;
    onRemove: () => void;
}

export const TrayComponent: React.FC<TrayComponentProps> = ({
    tray,
    onUpdate,
    onRemove,
}) => {
    const[{isOver, canDrop}, drop] = useDrop<DragItem, DropResult, {isOver: boolean; canDrop: boolean}>({
        accept: 'PRODUCT',
        drop: (item, monitor) => {
            if(!item.product) {
                console.error('Dropped item missing product data');
                return {
                    trayId: tray.id,
                    position: { x: 0, y: 0 },
                    isValid: false
                };
            }

            const clientOffset = monitor.getClientOffset();
            const targetRect = (monitor.getDropResult() as any)?.targetRect;

            console.log('Product dropped in tray:', item.product.name, ' Tray ID:', tray.id);

            const bestX = findBestXPosition(item.product, tray);

            if(bestX !== null)
            {
                const y = calculateYPosition(item.product);
                const newProduct: PlacedProduct = item.product.stable ? {
                    ...item.product,
                    x: bestX,
                    y,
                    placedAt: Date.now(),
                    trayId: tray.id,
                    extractorType: 'low',
                    extractorHeight: extractorConstants.LOW_EXTRACTOR_HEIGHT
                } : {
                    ...item.product,
                    x: bestX,
                    y,
                    placedAt: Date.now(),
                    trayId: tray.id,
                    extractorType: 'high',
                    extractorHeight: extractorConstants.HIGH_EXTRACTOR_HEIGHT,
                    clipDistance: extractorConstants.CLIP_DELTA // Default clip distance, calculation will be added later
                };

                //===============Update Tray with new product================
                const updatedTray: Tray = {
                    ...tray,
                    products: [...tray.products, newProduct]
                };

                onUpdate(updatedTray);

                return {
                    trayId: updatedTray.id,
                    position: { x: bestX, y: y },
                    isValid: true
                };
            }

            return {
                trayId: tray.id,
                position: { x: 0, y: 0 },
                isValid: false
            };
        },

        canDrop: (item) => {
            if(!item.product){
                return false;
            }

            const bestX = findBestXPosition(item.product, tray);
            return bestX !== null 
        },

        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    //=====PRODUCT MANAGEMENT FUNCTIONS=====
    const removeProduct = (productId: number) => {
        const updatedTray: Tray = {
            ...tray,
            products: tray.products.filter(product => product.id !== productId)
        };
        onUpdate(updatedTray);
    };

    const trayClasses = `
        relative border-2 rounded-lg p-4 transition-colors duration-200
        ${isOver && canDrop ? 'border-green-400 bg-green-50' : ' '}
        ${isOver && !canDrop ? 'border-red-400 bg-red-50' : ' '}
        ${!isOver ? 'border-gray-300 bg-gray-100' : ' '}
    `;

    const trayStyle = {
        width : `${tray.width}px`,
        minHeight: `${tray.height}px`,
    }

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            {/* ========== TRAY HEADER ========== */}
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h3 className="font-medium text-gray-800">
                        Tray {tray.id} ({tray.width}mm × {tray.height}mm)
                    </h3>
                    <p className="text-sm text-gray-600">
                        {tray.products.length} product{tray.products.length !== 1 ? 's' : ''}
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
            {/* ================================= */}

            {/* ========== TRAY DROP AREA ========== */}
            <div ref={drop as any} className={trayClasses} style={trayStyle}>
                {/* EMPTY STATE: Show when no products in tray */}
                {tray.products.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                        <div className="text-center">
                            <div className="text-sm">Drop products here</div>
                            <div className="text-xs">(Drag from product list)</div>
                        </div>
                    </div>
                ) : (
                    // ========== PRODUCTS DISPLAY ==========
                    // Show all products positioned within the tray
                    <div className="relative">
                        {tray.products.map((product, index) => (
                            <div
                                key={index}
                                className="absolute group" // Group for hover effects
                                style={{
                                    left: `${product.x}px`,    // X position from product data
                                    bottom: `${product.y}px`,  // Y position (from bottom up)
                                }}
                            >
                                {/* Render the actual product visual */}
                                <ProductVisual
                                    product={product}
                                    scale={1}                    // 1:1 scale (1mm = 1px)
                                    draggable={false}           // Products in trays aren't draggable yet
                                    showLabel={true}
                                    showStabilityIndicator={true}
                                />
                                {/* ========== REMOVE BUTTON ========== */}
                                {/* Only visible on hover - allows removing products */}
                                <button
                                    onClick={() => removeProduct(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove product"
                                >
                                    ×
                                </button>
                                {/* =================================== */}
                            </div>
                        ))}
                    </div>
                    // =====================================
                )}
                
                {/* ========== DROP FEEDBACK ========== */}
                {/* Show feedback message during drag hover */}
                {isOver && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className={`text-lg font-semibold ${canDrop ? 'text-green-600' : 'text-red-600'}`}>
                            {canDrop ? 'Drop here' : 'Cannot fit here'}
                        </div>
                    </div>
                )}
                {/* ================================== */}
            </div>
            {/* =================================== */}
        </div>
    );
};