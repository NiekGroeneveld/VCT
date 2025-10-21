// src/services/productService.ts - Enhanced version of your existing service
import { Product } from '../types/product.types';
// import { useCompany } from '../../../Context/useCompany';
import axios from 'axios';
import { use } from 'react';
import { API_BASE_URL } from '../../../shared/constants';

export const GetCompanyProductsAPI = async (companyId: number, includePublics: boolean = false): Promise<Product[]> => {
    try {
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error ("No company selected");
        const response = await axios.get(API_BASE_URL + `companies/${companyId}/products/getCompanyProductsActive/${includePublics}`, {
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
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error ("No company selected");
        const response = await axios.post(API_BASE_URL + `companies/${companyId}/products`, productData, {
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

export const DeActivateProductAPI = async (companyId: number, productId: number): Promise<boolean> => {
    try {
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error ("No company selected");
        const response = await axios.post(API_BASE_URL + `companies/${companyId}/products/${productId}/deactivate`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.status === 204;
    } catch (error) {
        console.error('Failed to deactivate product:', error);
        return false;
    }
}

export const ActivateProductAPI = async (companyId: number, productId: number): Promise<boolean> => {
    try {
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error ("No company selected");
        const response = await axios.post(API_BASE_URL + `companies/${companyId}/products/${productId}/activate`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.status === 204;
    } catch (error) {
        console.error('Failed to activate product:', error);
        return false;
    }
}

export const ProductSoftDeleteAPI = async (companyId: number, productId: number): Promise<{message: string, action: string, productId: number} | null> => {
    try {
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error ("No company selected");
        const response = await axios.delete(API_BASE_URL + `companies/${companyId}/products/${productId}/SoftDelete`, {
            headers: {  
                Authorization: `Bearer ${token}`
            }
        });
        return response.data; // Expecting { message: string, action: string, productId: number }
    } catch (error) {
        console.error('Failed to soft delete product:', error);
        return null;
    }
}

export const UpdateProductAPI = async (companyId: number, productId: number, updatedData: any): Promise<Product | null> => {    
    try {
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");  
        if (!companyId) throw new Error ("No company selected");
        const response = await axios.put(API_BASE_URL + `companies/${companyId}/products/${productId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update product:', error);
        return null;
    }
}

export const ProductInUseAPI = async (companyId: number, productId: number): Promise<boolean> => {
    try {
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");  
        if (!companyId) throw new Error ("No company selected");
        const response = await axios.get(API_BASE_URL + `companies/${companyId}/products/productInUse/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.inUse;
    } catch (error) {
        console.error('Failed to check if product is in use:', error);
        return false;
    }
}

export const ProductsInConfigurationAPI = async (companyId: number, configurationId: number): Promise<Product[]> => {
    try {
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error ("No company selected");
        const response = await axios.get(API_BASE_URL + `companies/${companyId}/products/productsInConfiguration/${configurationId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch products in configuration:', error);
        return [];
    }
}
    

// Export a singleton instance
export const productService = {
    GetCompanyProductsAPI,
    CreateProductAPI,
    DeActivateProductAPI,
    ActivateProductAPI,
    ProductSoftDeleteAPI,
    UpdateProductAPI,
    ProductInUseAPI,
    ProductsInConfigurationAPI
}
