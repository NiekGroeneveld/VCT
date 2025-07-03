import {Product} from '../types/product.types';

class ProductService {
    private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    async getClientProducts(): Promise<Product[]>{
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

    
    private getMockClientProducts(): Product[] {
        return [
            { id: 1, name: 'Mock Client Product 1', width: 100, height: 50, depth: 30, stable: true, source: 'client', color: '#FF5733' },
            { id: 2, name: 'Mock Client Product 2', width: 120, height: 60, depth: 40, stable: false, source: 'client', color: '#33FF57' }
        ];
    }

    private getMockAccountProducts(): Product[] {
        return [
            { id: 1, name: 'Mock Account Product 1', width: 110, height: 55, depth: 35, stable: true, source: 'account', color: '#3357FF' },
            { id: 2, name: 'Mock Account Product 2', width: 130, height: 65, depth: 45, stable: false, source: 'account', color: '#FF33A1' }
        ];
    }
}

