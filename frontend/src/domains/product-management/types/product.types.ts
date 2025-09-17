import {extractorType, extractorConstants} from "./extractor.types";

export interface Product {
    id: number;         // Unique identifier for the product
    name: string;       // Product name
    width: number;      // Width in mm      
    height: number;     // Height in mm
    depth: number;      // Depth in mm
    stable: boolean;    // Indicates if the product is stable
    color: string;      // Visual representation color of the product
    ColorHex?: string;  // Optional: backend color property for fallback
}

export interface PlacedProductBase extends Product {
    x: number;        // X coordinate wihtin tray
    y: number;        // Y coordinate within tray
    onTrayIndex: number; // The place of the product in the tray
    placedAt: number; // Timestamp when the product was placed
    trayId: number; // ID of the tray where the product is placed
}

//Low extractor interface
export interface LowExtractorProduct extends PlacedProductBase {
    extractorType: 'low';        // Type of extractor product
    extractorHeight: typeof extractorConstants.LOW_EXTRACTOR_HEIGHT; // Height of the low extractor product
}

//High extractor interface
export interface HighExtractorProduct extends PlacedProductBase {
    extractorType: 'high';                                               // Type of extractor product
    extractorHeight: typeof extractorConstants.HIGH_EXTRACTOR_HEIGHT; // Height of the low extractor product
    clipDistance: number;                                               // Distance between clips in deltas
}

export type PlacedProduct = LowExtractorProduct | HighExtractorProduct;

export const ProductBoundaries = {
    MIN_WIDTH: 50,   // Minimum width in mm
    MAX_WIDTH: 320,  // Maximum width in mm
    MIN_HEIGHT: 10,  // Minimum height in mm
    MAX_HEIGHT: 340, // Maximum height in mm
    MIN_DEPTH: 1,   // Minimum depth in mm
    MAX_DEPTH: 560   // Maximum depth in mm
}