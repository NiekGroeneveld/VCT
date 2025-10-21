// src/domains/product-management/components/ProductInfoModal.tsx
import React, { useState } from "react";
import { Product } from "../types/product.types";
import { ProductVisual } from "./ProductVisual";
import { X } from "lucide-react";
import { productService } from "../services/productService";
import { useCompany } from "../../../Context/useCompany";

interface ProductInfoModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onProductUpdated?: () => void; // Callback to refresh product list
}

export const ProductInfoModal: React.FC<ProductInfoModalProps> = ({
  product,
  open,
  onClose,
  onProductUpdated,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { selectedCompany } = useCompany();

  if (!product) return null;

  const handleClose = () => {
    onClose();
  };

  const handleActivateProduct = async () => {
    if (!selectedCompany) {
      console.error("No company selected");
      return;
    }

    setIsProcessing(true);
    try {
      const success = await productService.ActivateProductAPI(
        Number(selectedCompany.id),
        product.id
      );

      if (success) {
        console.log("Product activated successfully");
        onProductUpdated?.(); // Refresh product list
        onClose(); // Close modal
      } else {
        console.error("Failed to activate product");
      }
    } catch (error) {
      console.error("Error activating product:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeactivateProduct = async () => {
    if (!selectedCompany) {
      console.error("No company selected");
      return;
    }

    setIsProcessing(true);
    try {
      const success = await productService.DeActivateProductAPI(
        Number(selectedCompany.id),
        product.id
      );

      if (success) {
        console.log("Product deactivated successfully");
        onProductUpdated?.(); // Refresh product list
        onClose(); // Close modal
      } else {
        console.error("Failed to deactivate product");
      }
    } catch (error) {
      console.error("Error deactivating product:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedCompany) {
      console.error("No company selected");
      return;
    }

    // Confirm deletion
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"?\n\n` +
      "If the product is in use, it will be deactivated instead of deleted."
    );

    if (!confirmDelete) return;

    setIsProcessing(true);
    try {
      const result = await productService.ProductSoftDeleteAPI(
        Number(selectedCompany.id),
        product.id
      );

      if (result) {
        console.log(`Product ${result.action}:`, result.message);
        
        // Show user-friendly message
        if (result.action === "deleted") {
          alert(`Product "${product.name}" has been permanently deleted.`);
        } else if (result.action === "deactivated") {
          alert(`Product "${product.name}" is in use and has been deactivated instead.`);
        }

        onProductUpdated?.(); // Refresh product list
        onClose(); // Close modal
      } else {
        console.error("Failed to delete product");
        alert("Failed to delete the product. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
            transition-colors ${
              open
                ? "bg-black bg-opacity-50 visible pointer-events-auto"
                : "bg-transparent invisible pointer-events-none"
            }
            `}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl p-6 relative
            transition-all max-w-2xl w-full mx-4 ${
              open ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={handleClose}
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Modal Content */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {product.name}
            </h2>
            <p className="text-sm text-gray-500">Product Details</p>
          </div>

          {/* Product Visual and Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Visual Preview */}
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
              <div className="mb-4">
                <ProductVisual
                  product={product}
                  scale={1.5} // Larger preview
                  draggable={false}
                  showLabel={true}
                  showStabilityIndicator={true}
                />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">Color:</span>
                  <div
                    className="w-6 h-6 rounded border-2 border-gray-300"
                    style={{ backgroundColor: product.color }}
                  />
                  <span className="font-mono text-xs text-gray-700">
                    {product.color}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Product Information */}
            <div className="space-y-4">
              {/* Dimensions Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Dimensions
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="font-bold text-lg">—</span>
                      Width
                    </span>
                    <span className="font-semibold text-gray-800">
                      {product.width} mm
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="font-bold text-lg">|</span>
                      Height
                    </span>
                    <span className="font-semibold text-gray-800">
                      {product.height} mm
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="font-bold text-lg">⊡</span>
                      Depth
                    </span>
                    <span className="font-semibold text-gray-800">
                      {product.depth} mm
                    </span>
                  </div>
                </div>
              </div>

              {/* Properties Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Properties
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`font-semibold ${
                        product.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Stability</span>
                    <span
                      className={`font-semibold ${
                        product.stable ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.stable ? "Stable (Low Motor)" : "Unstable (High Motor)"}
                    </span>
                  </div>
                  {!product.stable && product.palletConfig && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Pallet Configuration</span>
                      <span className="font-mono text-sm font-semibold text-gray-800">
                        {product.palletConfig}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Product ID</span>
                    <span className="font-mono text-sm font-semibold text-gray-800">
                      #{product.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            {/* Left side - Activate/Deactivate and Delete buttons */}
            <div className="flex gap-3">
              {product.isActive ? (
                <button
                  onClick={handleDeactivateProduct}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    "Deactivate"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleActivateProduct}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    "Activate"
                  )}
                </button>
              )}
              
              {/* Delete Button */}
              <button
                onClick={handleDeleteProduct}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  "Delete Product"
                )}
              </button>
            </div>

            {/* Right side - Close button */}
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoModal;
