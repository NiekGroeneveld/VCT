// src/services/productService.ts - Enhanced version of your existing service
import { Product } from '../types/product.types';
// import { useCompany } from '../../../Context/useCompany';
import axios from 'axios';
import { use } from 'react';


    

    export const GetCompanyProductsAPI = async (companyId: number, includePublics: boolean = false): Promise<Product[]> => {
        try {
            const api = "http://localhost:5268/api/";
            const token  = localStorage.getItem("token");
            if (!token) throw new Error("No token found");
            if (!companyId) throw new Error ("No company selected");
            const response = await axios.get(api + `companies/${companyId}/products/getCompanyProducts/${includePublics}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Map colorHex (lowercase) to color for frontend compatibility
            return response.data.map((p: any) => ({ ...p, color: p.colorHex }));
        } catch (error) {
            console.error('Failed to fetch company products:', error);
            return [];
        }
    }


    // Create a new product
    export const CreateProductAPI = async (companyId: number, productData: any): Promise<Product | null> => {
        try {
            const api = "http://localhost:5268/api/";
            const token  = localStorage.getItem("token");
            if (!token) throw new Error("No token found");
            if (!companyId) throw new Error ("No company selected");
            const response = await axios.post(api + `companies/${companyId}/products`, productData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const newProduct: Product = response.data;
            return newProduct;
        } catch (error) {
            console.error('Failed to create product:', error);
            return null;
        }
    }
// Export a singleton instance
export const productService = {
    GetCompanyProductsAPI,
    CreateProductAPI
}
