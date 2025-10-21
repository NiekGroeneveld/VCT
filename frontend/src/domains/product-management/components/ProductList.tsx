// src/components/ProductList.tsx - Clean version using ProductVisual
import React, { useState, useEffect } from "react";
import { useCompany } from "../../../Context/useCompany";
import { useConfig } from "../../../Context/useConfig";
import { Plus, Search } from "lucide-react";
import { Product } from "../types/product.types";
import { productService } from "../services/productService";
import { ProductVisual } from "./ProductVisual";
import useGridDimensions from "../hooks/useGridDimensions";
import MakeProductModal from "./MakeProductModal";
import ProductInfoModal from "./ProductInfoModal";
import { useScaling } from "../../../hooks/useScaling";

type ProductFilter = 'all' | 'in_config' | 'not_in_config';

interface ProductListProps {
  className?: string;
}

export const ProductList: React.FC<ProductListProps> = ({ className = "" }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsInConfig, setProductsInConfig] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState<ProductFilter>('all');
  const [addProductModalOpen, setAddProductModalOpen] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productInfoModalOpen, setProductInfoModalOpen] = useState<boolean>(false);
  const { scale } = useScaling();
  const { selectedCompany } = useCompany();
  const { selectedConfiguration } = useConfig();

  useEffect(() => {
    if (selectedCompany) {
      loadProducts();
    } else {
      setProducts([]);
      setProductsInConfig([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany]);

  // Load products in configuration when configuration changes
  useEffect(() => {
    if (selectedConfiguration && selectedCompany) {
      loadProductsInConfiguration();
    } else {
      setProductsInConfig([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConfiguration, selectedCompany]);

  // Listen for refresh events when products are added/removed from trays
  useEffect(() => {
    const handleRefreshProductsInConfiguration = () => {
      console.log('Refreshing products in configuration...');
      if (selectedConfiguration && selectedCompany) {
        loadProductsInConfiguration();
      }
    };

    window.addEventListener('refreshProductsInConfiguration', handleRefreshProductsInConfiguration);
    return () => {
      window.removeEventListener('refreshProductsInConfiguration', handleRefreshProductsInConfiguration);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany, selectedConfiguration]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (!selectedCompany) {
        setProducts([]);
        return;
      }
    const CompanyProducts = await productService.GetCompanyProductsAPI(Number(selectedCompany.id));
      setProducts(CompanyProducts);
      
      // Also refresh products in configuration if a configuration is selected
      if (selectedConfiguration) {
        await loadProductsInConfiguration();
      }
      
      // Dispatch event to notify other components (like ConfigurationArea) that products were refreshed
      window.dispatchEvent(new CustomEvent('productRefresh', { 
        detail: { products: CompanyProducts, companyId: selectedCompany.id } 
      }));
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductsInConfiguration = async () => {
    try {
      if (!selectedCompany || !selectedConfiguration) {
        setProductsInConfig([]);
        return;
      }
      const productsInConf = await productService.ProductsInConfigurationAPI(
        Number(selectedCompany.id),
        selectedConfiguration.id
      );
      setProductsInConfig(productsInConf);
    } catch (error) {
      console.error("Failed to load products in configuration:", error);
      setProductsInConfig([]);
    }
  };
  // ✅ Filter products based on search term and configuration filter
  const filteredProducts = React.useMemo(() => {
    // Step 1: Apply configuration filter
    let baseProducts = products;
    
    if (productFilter === 'in_config') {
      // YES: Show only products IN configuration (intersection)
      const inConfigIds = new Set(productsInConfig.map(p => p.id));
      baseProducts = products.filter(p => inConfigIds.has(p.id));
    } else if (productFilter === 'not_in_config') {
      // NO: Show only products NOT IN configuration (difference)
      const inConfigIds = new Set(productsInConfig.map(p => p.id));
      baseProducts = products.filter(p => !inConfigIds.has(p.id));
    }
    // ALL: Use all products (no filtering)

    // Step 2: Apply search term filter
    if (!searchTerm.trim()) {
      return baseProducts;
    }

    const filtered = baseProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered;
  }, [products, productsInConfig, searchTerm, productFilter]);

  // ✅ FIXED: Use filtered products and scale for grid calculations
  const gridDimensions = useGridDimensions(containerRef, filteredProducts, scale);

  const handleProductClick = (product: Product) => {
    console.log("Product clicked:", product.name);
    // TODO: This will be replaced with drag functionality
  };

  const handleAddFromCatalog = () => {
    console.log("Add from catalog clicked");
    // TODO: Open catalog modal or navigate to catalog
  };

  if (loading) {
    return (
      <div
        className={`bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 ${className}`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-100 rounded-lg border-2 border-gray-300 h-full flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b border-gray-300 flex-shrink-0">
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Producten</h3>
          <button
            onClick={() => setAddProductModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md flex items-center gap-2 transition-colors text-sm"
          >
            <Plus size={16} />
            <span>Nieuw Product</span>
          </button>
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
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Configuration Filter */}
        {selectedConfiguration && (
          <div className="px-3 pb-3">
            <div className="flex gap-1 bg-gray-200 rounded-md p-1">
              <button
                onClick={() => setProductFilter('all')}
                className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  productFilter === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Alle
              </button>
              <button
                onClick={() => setProductFilter('in_config')}
                className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  productFilter === 'in_config'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                In Configuratie
              </button>
              <button
                onClick={() => setProductFilter('not_in_config')}
                className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  productFilter === 'not_in_config'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Niet in Configuratie
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div ref={setContainerRef} className="p-4 flex-1 overflow-auto relative">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${gridDimensions.cols}, max-content)`, 
            justifyContent: "center", // Center the grid columns in the container
            alignItems: "center", // Center items vertically in their rows
            justifyItems: "center", // Center items horizontally within their columns
          }}
        >
          {filteredProducts.map((product) => (
            <ProductVisual
              key={product.id}
              product={product}
              scale={scale} // Pass the current scale factor
              onClick={() => handleProductClick(product)}
              draggable={true}
              showLabel={true}
              showStabilityIndicator={true}
              showInfoButton={true}
              onInfoClick={() => {
                setSelectedProduct(product);
                setProductInfoModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white rounded-b-lg border-t border-gray-300 flex-shrink-0">
        <div className="p-3 flex items-center">
          <h3 className="font-semibold text-gray-800"></h3>
        </div>
      </div>

      {/* Product Creation Modal */}
      <MakeProductModal 
        open={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        onProductCreated={loadProducts}
      />

      {/* Product Info Modal */}
      <ProductInfoModal
        product={selectedProduct}
        open={productInfoModalOpen}
        onClose={() => {
          setProductInfoModalOpen(false);
          setSelectedProduct(null);
        }}
        onProductUpdated={loadProducts}
      />
    </div>
  );
}
