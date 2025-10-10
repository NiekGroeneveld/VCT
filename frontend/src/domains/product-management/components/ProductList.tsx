// src/components/ProductList.tsx - Clean version using ProductVisual
import React, { useState, useEffect } from "react";
import { useCompany } from "../../../Context/useCompany";
import { Plus, Search } from "lucide-react";
import { Product } from "../types/product.types";
import { productService } from "../services/productService";
import { ProductVisual } from "./ProductVisual";
import useGridDimensions from "../hooks/useGridDimensions";
import MakeProductModal from "./MakeProductModal";
import ProductInfoModal from "./ProductInfoModal";
import { useScaling } from "../../../hooks/useScaling";

interface ProductListProps {
  className?: string;
}

export const ProductList: React.FC<ProductListProps> = ({ className = "" }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addProductModalOpen, setAddProductModalOpen] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productInfoModalOpen, setProductInfoModalOpen] = useState<boolean>(false);
  const { scale } = useScaling();
  const { selectedCompany } = useCompany();

  useEffect(() => {
    if (selectedCompany) {
      loadProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (!selectedCompany) {
        setProducts([]);
        return;
      }
    const CompanyProducts = await productService.GetCompanyProductsAPI(Number(selectedCompany.id));
      setProducts(CompanyProducts);
      
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
// Removed stray if (!selectedCompany) {
  // ✅ NEW: Filter products based on search term
  const filteredProducts = React.useMemo(() => {
    if (!searchTerm.trim()) {
      console.log("No search term, showing all products");
      return products;
    }

    const filtered = products.filter((product) => {
      const matches = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      console.log(
        `Product: "${product.name}" | Search: "${searchTerm}" | Matches: ${matches}`
      );
      return matches;
    });

    console.log("=== FILTER RESULTS ===");
    console.log("Search term:", `"${searchTerm}"`);
    console.log("Total products:", products.length);
    console.log("Filtered products:", filtered.length);
    console.log(
      "Filtered names:",
      filtered.map((p) => p.name)
    );
    console.log("=====================");

    return filtered;
  }, [products, searchTerm]);

  // ✅ FIXED: Use filtered products for grid calculations
  const gridDimensions = useGridDimensions(containerRef, filteredProducts);

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
      </div>

      {/* Product Grid */}
      <div ref={setContainerRef} className="p-4 flex-1 overflow-auto relative">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${gridDimensions.cols}, max-content)`, 
            justifyContent: "start", 
            alignItems: "start",
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
