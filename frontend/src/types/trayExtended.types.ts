export interface TrayValidationRules {
    maxProductsPerTray: number; // Maximum number of products allowed in a tray
    minTrayHeight: number; // Minimum height of the tray
    maxTrayHeight: number; // Maximum height of the tray
    minTrayWidth: number; // Minimum width of the tray
    maxTrayWidth: number; // Maximum width of the tray
    allowDuplicateProducts: boolean; // Whether duplicate products are allowed in the tray
    requireMinSpacing: boolean; // Whether to require minimum spacing between products
    minSpacing?: number; // Minimum spacing between products, if required
}

/**
 * Product spacing posotioning options
 */

export interface ProductPositioningOptions {
    algorithm: 'optimal' | 'simple' | 'custom'; // Algorithm to use for positioning products
    spacing: number; // Spacing between products in mm
    alignment: 'left' | 'center' | 'right' | 'distribute';
    allowOverlap: boolean;
    prioritizeStability: boolean;
}

/**
 * Tray stastistic and analytics interface
 */
export interface TrayAnalytics {
  utilization: number;
  productCount: number;
  averageProductSize: number;
  tallestProduct: number;
  extractorDistribution: {
    low: number;
    high: number;
  };
  spacingEfficiency: number;
  recommendedOptimizations: string[];
}