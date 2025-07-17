import { Tray } from '../types/tray.types';
import { PlacedProduct } from '../../product-management/types/product.types';

export class ProductSpacingService {
    /**
       * Advanced spacing algorithm that distributes products evenly across tray width
      */
      static calculateAdvancedSpacing(tray: Tray, products: PlacedProduct[], minSpacing: number = 2): PlacedProduct[] {
        if (products.length === 0) {
          return [];
        }
    
        console.log(`TrayProductManager.calculateAdvancedSpacing for ${products.length} products in tray ${tray.id}`);
    
        const trayWidth = tray.width;
        const totalProductWidth = products.reduce((sum, p) => sum + p.width, 0);
        const productCount = products.length;
        
        // Calculate available space for spacing
        const availableSpace = trayWidth - totalProductWidth;
        
        // If products don't fit, use simple left-aligned spacing
        if (availableSpace < 0) {
          console.warn(`Products don't fit in tray width ${trayWidth}mm, using simple spacing`);
          return this.calculateSimpleSpacing(products, minSpacing);
        }
        
        // Calculate spacing between products
        let spacing: number;
        let startX: number;
        
        if (productCount === 1) {
          // Center single product
          spacing = 0;
          startX = (trayWidth - totalProductWidth) / 2;
        } else {
          // Calculate total spacing needed (including half spacing at start and end)
          const totalSpacingSlots = productCount + 1; // Between products + start + end
          const spacingPerSlot = availableSpace / totalSpacingSlots;
          
          spacing = spacingPerSlot;
          startX = spacingPerSlot; // Start with half spacing
        }
      
        
        // Position products
        const positionedProducts: PlacedProduct[] = [];
        let currentX = startX;
        
        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          const positionedProduct: PlacedProduct = {
            ...product,
            x: Math.round(currentX)
          };
          
          positionedProducts.push(positionedProduct);
          currentX += product.width + spacing;
        }
        
        return positionedProducts;
      }

        /**
         * Simple spacing algorithm for products (fallback)
         */
        static calculateSimpleSpacing(products: PlacedProduct[], spacing: number = 10): PlacedProduct[] {
          let currentX = 0;
          return products.map((product) => {
            const positionedProduct: PlacedProduct = {
              ...product,
              x: currentX
            };
            currentX += product.width + spacing;
            return positionedProduct;
          });
        }

}
