// src/services/productService.ts - Enhanced version of your existing service
import { Product } from '../types/product.types';

class ProductService {
    private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    async getClientProducts(): Promise<Product[]> {
        try {
            const response = await fetch(`${this.baseUrl}/products/client`);
            if (!response.ok) {
                throw new Error(`Error fetching client products: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch client products:', error);
            return this.getMockClientProducts();
        }
    }

    async getAccountProducts(): Promise<Product[]> {
        try {
            const response = await fetch(`${this.baseUrl}/products/account`);
            if (!response.ok) {
                throw new Error(`Error fetching account products: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch account products:', error);
            return this.getMockAccountProducts();
        }
    }

    // NEW: Method to get library products for drag and drop testing
    async getLibraryProducts(): Promise<Product[]> {
        try {
            const response = await fetch(`${this.baseUrl}/products/library`);
            if (!response.ok) {
                throw new Error(`Error fetching library products: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch library products:', error);
            return this.getMockLibraryProducts();
        }
    }

    private getMockClientProducts(): Product[] {
        return [
            { 
                id: 1, 
                name: 'Custom Client Snack', 
                width: 100, 
                height: 50, 
                depth: 30, 
                stable: true, 
                source: 'client', 
                color: '#FF5733' 
            },
            { 
                id: 2, 
                name: 'Client Special Drink', 
                width: 120, 
                height: 60, 
                depth: 40, 
                stable: false, 
                source: 'client', 
                color: '#33FF57' 
            }
        ];
    }

    private getMockAccountProducts(): Product[] {
        return [
            { 
                id: 51, 
                name: 'Account Product 1', 
                width: 110, 
                height: 55, 
                depth: 35, 
                stable: true, 
                source: 'account', 
                color: '#3357FF' 
            },
            { 
                id: 52, 
                name: 'Account Product 2', 
                width: 130, 
                height: 65, 
                depth: 45, 
                stable: false, 
                source: 'account', 
                color: '#FF33A1' 
            }
        ];
    }

    // NEW: Realistic mock data for drag and drop testing
    private getMockLibraryProducts(): Product[] {
        return [
            { 
                id: 101, 
                name: 'Coca Cola', 
                width: 60, 
                height: 165, 
                depth: 60, 
                stable: true, 
                source: 'account', 
                color: '#FF0000' 
            },
            { 
                id: 102, 
                name: 'Pepsi', 
                width: 60, 
                height: 165, 
                depth: 60, 
                stable: true, 
                source: 'account', 
                color: '#0066CC' 
            },
            { 
                id: 103, 
                name: 'KitKat', 
                width: 115, 
                height: 30, 
                depth: 45, 
                stable: false, 
                source: 'account', 
                color: '#8B4513' 
            },
            { 
                id: 104, 
                name: 'Snickers', 
                width: 120, 
                height: 50, 
                depth: 50, 
                stable: false, 
                source: 'account', 
                color: '#654321' 
            },
            { 
                id: 105, 
                name: 'Water Bottle', 
                width: 65, 
                height: 200, 
                depth: 65, 
                stable: true, 
                source: 'account', 
                color: '#87CEEB' 
            },
            { 
                id: 106, 
                name: 'Energy Drink', 
                width: 55, 
                height: 155, 
                depth: 55, 
                stable: true, 
                source: 'account', 
                color: '#FFD700' 
            },
            { 
                id: 107, 
                name: 'Pringles', 
                width: 70, 
                height: 240, 
                depth: 70, 
                stable: true, 
                source: 'account', 
                color: '#FF6347' 
            },
            { 
                id: 108, 
                name: 'Mars Bar', 
                width: 112, 
                height: 40, 
                depth: 48, 
                stable: false, 
                source: 'account', 
                color: '#8B0000' 
            }
        ];
    }
}

// Export a singleton instance
export const productService = new ProductService();