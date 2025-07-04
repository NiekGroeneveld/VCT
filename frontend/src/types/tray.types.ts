import {PlacedProduct} from './product.types';

export const TrayConstants = {
    DEFAULT_TRAY_WIDTH: 640, // Default width for trays
    MINIMAL_TRAY_HEIGHT: 124 // Default height for trays
} as const;


export interface Tray{
    id: number;          // Unique identifier for the tray
    width: number;       // Width in mm
    height: number;     // Height adjustable by products placed on the tray
    products: PlacedProduct[]; // Array of products placed in the tray
    name?: string;      // Optional name for the tray (maybe for standardtrays later on )
    position: number;   // Order within config, 0-based
}

export interface TrayConfiguration {
    id: number;
    name: string;       // Name of the tray configuration
    trays: Tray[];      // Array of trays in the configuration
    clientId: number; // ID of the client this configuration belongs to
    machinedId?: number; // ID of the machine this configuration is for
    createdAt: string; // Timestamp when the configuration was created
    updatedAt: string; // Timestamp when the configuration was last updated
}

