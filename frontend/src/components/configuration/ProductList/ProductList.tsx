// src/components/ProductList.tsx - Clean version using ProductVisual
import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Product } from '../../../types/product.types';
import { productService } from '../../../services/productService';
import { ProductVisual } from '../Product/ProductVisual'; // ✅ FIXED: Corrected path
import useGridDimensions from '../../../hooks/useGridDimensions'; // ✅ FIXED: Default import

interface ProductListProps {
    className?: string;
}

export const ProductList: React.FC<ProductListProps> = ({ className = '' }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); // ✅ NEW: Search state

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const libraryProducts = await productService.getLibraryProducts();
            setProducts(libraryProducts);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // ✅ NEW: Filter products based on search term
    const filteredProducts = React.useMemo(() => {
        if (!searchTerm.trim()) {
            console.log('No search term, showing all products');
            return products;
        }
        
        const filtered = products.filter(product => {
            const matches = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            console.log(`Product: "${product.name}" | Search: "${searchTerm}" | Matches: ${matches}`);
            return matches;
        });
        
        console.log('=== FILTER RESULTS ===');
        console.log('Search term:', `"${searchTerm}"`);
        console.log('Total products:', products.length);
        console.log('Filtered products:', filtered.length);
        console.log('Filtered names:', filtered.map(p => p.name));
        console.log('=====================');
        
        return filtered;
    }, [products, searchTerm]);

    // ✅ FIXED: Use filtered products for grid calculations
    const gridDimensions = useGridDimensions(containerRef, filteredProducts);

    const handleProductClick = (product: Product) => {
        console.log('Product clicked:', product.name);
        // TODO: This will be replaced with drag functionality
    };

    const handleAddFromCatalog = () => {
        console.log('Add from catalog clicked');
        // TODO: Open catalog modal or navigate to catalog
    };

    if (loading) {
        return (
            <div className={`bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 ${className}`}>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-gray-100 rounded-lg border-2 border-gray-300 ${className}`}>
            {/* Header */}
            <div className="bg-white rounded-t-lg border-b border-gray-300">
                <div className="p-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Producten</h3>
                </div>
                
                {/* Search Bar */}
                <div className="p-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Zoek producten..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendolutionBlue focus:border-transparent text-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Product Grid */}
            <div 
                ref={setContainerRef}
                className="p-4 max-h-[70vh] overflow-auto"
            >
                <div 
                    className="grid gap-3 mb-4"
                    style={{ 
                        gridTemplateColumns: `repeat(${gridDimensions.cols}, max-content)`, // ✅ FIXED: Each column sizes to its content
                        justifyContent: 'start', // ✅ FIXED: Align grid to start instead of stretch
                        alignItems: 'start'
                    }}
                >
                    {filteredProducts.map((product) => (
                        <ProductVisual
                            key={product.id}
                            product={product}
                            onClick={() => handleProductClick(product)}
                            draggable={true}
                            showLabel={true}
                            showStabilityIndicator={true}
                        />
                    ))}
                </div>
                
                {/* Add from Catalog Button - Always visible at bottom */}
                <div className="sticky bottom-0 bg-white border-t border-gray-300 pt-2 -mx-4 px-4">
                    <button
                        onClick={handleAddFromCatalog}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                        <Plus size={16} />
                        <span className="text-sm font-medium">Toevoegen uit Catalogus</span>
                    </button>
                </div>
            </div>
        </div>
    );
};