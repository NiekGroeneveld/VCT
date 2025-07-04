import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import {Plus} from 'lucide-react';
import {DragItem, DropResult, ConfigurationConstants} from '../../types/configuration.types';
import {Tray, TrayConstants} from '../../types/tray.types';
import {TrayComponent} from './Tray/TrayComponent';

  

export const ConfigurationArea: React.FC = () => {
    // ========== STATE MANAGEMENT ==========
    // Manage the list of trays in this configuration
    const [trays, setTrays] = useState<Tray[]>([]);
    // Generate unique IDs for new trays
    const [nextTrayId, setNextTrayId] = useState(1);
    // ======================================

    // ========== DROP ZONE SETUP ==========
    // useDrop creates a drop zone that accepts dragged products
    // This is specifically for when NO trays exist yet - creates the first tray
    const [{ isOver, canDrop }, drop] = useDrop<DragItem, DropResult, { isOver: boolean; canDrop: boolean }>({
        // Accept only 'PRODUCT' type items (matches the type in ProductVisual)
        accept: 'PRODUCT',
        
        // Drop function: called when a valid item is dropped here
        drop: (item, monitor) => {
            // ========== TYPE SAFETY CHECK ==========
            // Ensure the item has a product (should always be true for PRODUCT type)
            if (!item.product) {
                console.error('Dropped item missing product data');
                return {
                    trayId: -1,
                    position: { x: 0, y: 0 },
                    isValid: false
                };
            }
            // ======================================
            
            console.log('Product dropped in configuration area:', item.product.name);
            
            // AUTO-CREATE FIRST TRAY: If no trays exist, create one automatically
            if (trays.length === 0) {
                const newTray: Tray = {
                    id: nextTrayId,
                    width: TrayConstants.DEFAULT_TRAY_WIDTH,  // Use default width from constants
                    height: TrayConstants.MINIMAL_TRAY_HEIGHT, // Use minimal height
                    products: [], // Start empty - the actual product placement happens in TrayComponent
                    position: 0,  // First tray gets position 0
                };
                
                // Update state to include the new tray
                setTrays([newTray]);
                setNextTrayId(prev => prev + 1);
                
                // Return success result that the drag source can use
                return {
                    trayId: newTray.id,
                    position: { x: 0, y: 0 },
                    isValid: true
                };
            }
            
            // If trays already exist, this drop zone shouldn't be used
            // (products should be dropped on specific trays instead)
            return {
                trayId: -1,
                position: { x: 0, y: 0 },
                isValid: false
            };
        },
        
        // Collect function: provides props for visual feedback
        collect: (monitor) => ({
            isOver: monitor.isOver(),    // True when item is hovering over this drop zone
            canDrop: monitor.canDrop(),  // True when item can be dropped here
        }),
    });

    const addNewTray = () => {
        // Create a new tray with default dimensions
        const newTray: Tray = {
            id: nextTrayId,
            width: TrayConstants.DEFAULT_TRAY_WIDTH,
            height: TrayConstants.MINIMAL_TRAY_HEIGHT,
            products: [],
            position: trays.length, // Position based on current number of trays
        };

        
        // Update state with the new tray
        setTrays(prev => [...prev, newTray]);
        setNextTrayId(prev => prev + 1);
    };

    const removeTray = (trayId: number) => {
        // Remove tray by filtering out the one with matching ID
        setTrays(prev => prev.filter(tray => tray.id !== trayId));
    };

    const updateTray = (updatedTray : Tray) => {
        setTrays(prev => prev.map(tray =>
            tray.id === updatedTray.id ? updatedTray : tray
        ))
    };

    //Visual FEEDBACK STYLES
    const dropZoneClasses = `
        transition-colors duration-200 ease-in-out
        ${isOver && canDrop ? 'bg-green-100 border-green-400' : 'bg-white border-gray-300'}
        ${canDrop ? 'border-dashed' : 'border-solid'}
    `;

    //============ EMPTY CONFIGURATION AREA ============
    if (trays.length === 0) {
        return (
            <div 
                ref={drop as any} // Apply drop functionality to this div
                className={`${dropZoneClasses} rounded-lg border-2 h-96 flex items-center justify-center`}
            >
                <div className="text-center">
                    <div className="text-lg font-semibold mb-2 text-gray-700">
                        Configuration Area
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                        Drag a product here to create your first tray
                    </div>
                    <button
                        onClick={addNewTray}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center gap-2 mx-auto transition-colors"
                    >
                        <Plus size={16} />
                        <span>Add Empty Tray</span>
                    </button>
                </div>
            </div>
        );
    }

            
    // ========== TRAYS EXIST STATE ==========
 // Show list of trays with add button when trays exist
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                    Configuration ({trays.length} tray{trays.length !== 1 ? 's' : ''})
                </h2>
                <button
                    onClick={addNewTray}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
                >
                    <Plus size={16} />
                    <span>Add Tray</span>
                </button>
            </div>
            
            {/* Render each tray as a TrayComponent */}
            
            <div className="space-y-4">
                {trays.map((tray) => (
                    <TrayComponent
                        key={tray.id}
                        tray={tray}
                        onUpdate={updateTray}        // Pass update function
                        onRemove={() => removeTray(tray.id)} // Pass remove function
                    />
                    
                ))}
            </div>
        </div>
    );
    // ======================================
};           
            
           