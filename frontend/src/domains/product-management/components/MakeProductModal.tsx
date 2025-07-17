import React, { useState } from "react";
import { Product } from "../types/product.types";
import { productService } from "../services/productService";
import { ColorPicker } from "../../../shared/components/ui/ColorPicker";
import { ProductVisual } from "./ProductVisual";

type MakeProductModalProps = {
  open: boolean;
  onClose: () => void;
  onProductCreated?: () => void; // Callback when product is successfully created
};

interface ProductFormData {
  name: string;
  width: number;
  height: number;
  depth: number;
  stable: boolean;
  color: string;
}

const MakeProductModal: React.FC<MakeProductModalProps> = ({
  open,
  onClose,
  onProductCreated,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    width: 0,
    height: 0,
    depth: 0,
    stable: true,
    color: "#003B7D", // Default color
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Product naam is verplicht");
      return false;
    }
    if (formData.width < 50 || formData.width > 340) {
      setError("Breedte moet tussen 50 en 340 mm zijn");
      return false;
    }
    if (formData.height < 1 || formData.height > 340) {
      setError("Hoogte moet positief zijn en maximaal 340 mm");
      return false;
    }
    if (formData.depth <= 0 || formData.depth > 540) {
      setError("Diepte moet tussen 1 en 540 mm zijn");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Create product object matching the Product interface
      const newProduct: Omit<Product, "id"> = {
        name: formData.name.trim(),
        width: formData.width,
        height: formData.height,
        depth: formData.depth,
        stable: formData.stable, // Use the actual stable value from form
        source: "client" as const,
        color: formData.color, // Use the selected color from form
      };

      // Call the product service to create the product
      await productService.createProduct(newProduct);

      // Reset form
      setFormData({
        name: "",
        width: 0,
        height: 0,
        depth: 0,
        stable: true,
        color: "#3B82F6",
      });

      // Notify parent component
      onProductCreated?.();

      // Close modal
      onClose();
    } catch (err) {
      console.error("Failed to create product:", err);
      setError("Er is een fout opgetreden bij het aanmaken van het product");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form and error state when closing
    setFormData({
      name: "",
      width: 50,
      height: 340,
      depth: 540,
      stable: true,
      color: "#3B82F6",
    });
    setError(null);
    onClose();
  };

  // Create a preview product from current form data
  const previewProduct: Product = {
    id: 0, // Temporary ID for preview
    name: formData.name || "Product Preview",
    width: formData.width || 50,
    height: formData.height || 120,
    depth: formData.depth || 50,
    stable: formData.stable,
    source: "client",
    color: formData.color || "#3B82F6",
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] 
            transition-colors ${
              open
                ? "bg-black bg-opacity-50 visible pointer-events-auto"
                : "bg-transparent invisible pointer-events-none"
            }
            `}
      onClick={handleClose}
    >
      <div
        className={`bg-gray-800 rounded-lg shadow-xl p-6 relative
            transition-all max-w-4xl w-full mx-4 ${
              open ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 py-1 px-2 
                border border-white rounded-md text-white
                bg-red-600 hover:bg-red-800 hover:text-white transition-colors z-10"
          onClick={handleClose}
        >
          ×
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Column - Form */}
          <div className="space-y-4 flex flex-col">
            <h2 className="text-xl font-semibold text-white">
              Nieuw Product Toevoegen
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 flex flex-col flex-1">
            <div>
              <label className="block text-sm font-medium text-white mb-1 border-black">
                Product Naam *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Voer product naam in..."
                className="w-full px-3 py-2 border bg-gray-600 text-white border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Breedte (mm) *
                </label>
                <input
                  type="number"
                  min="5"
                  value={formData.width || ""}
                  onChange={(e) =>
                    handleInputChange("width", parseInt(e.target.value) || 0)
                  }
                  placeholder="50"
                  className="w-full px-3 py-2 border  bg-gray-600 border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Hoogte (mm) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.height || ""}
                  onChange={(e) =>
                    handleInputChange("height", parseInt(e.target.value) || 0)
                  }
                  placeholder="120"
                  className="w-full px-3 py-2 border bg-gray-600 border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Diepte (mm) *
                </label>
                <input
                  type="number"
                  min="5"
                  value={formData.depth || ""}
                  onChange={(e) =>
                    handleInputChange("depth", parseInt(e.target.value) || 0)
                  }
                  placeholder="50"
                  className="w-full px-3 py-2 border  bg-gray-600 border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">
                    Stabiel product
                  </span>
                </label>
                <div className="flex items-center">
                    <button
                    type="button"
                    onClick={() => handleInputChange("stable", !formData.stable)}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                        formData.stable ? "bg-green-500" : "bg-gray-600"
                    }`}
                    >
                    <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        formData.stable ? "translate-x-9" : "translate-x-1"
                        }`}
                    />
                    </button>
                    <span className="ml-2 text-sm font-medium text-white">
                        {formData.stable ? "Lage Motor" : "Hoge Motor"}
                    </span>
                </div>
              </div>
            </div>

            {/* Color Picker Section */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-2">
                Product Kleur *
              </label>
              <ColorPicker
                value={formData.color}
                onChange={(color) => handleInputChange('color', color)}
                className="w-full"
              />
            </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Bezig...
                    </>
                  ) : (
                    "Product Toevoegen"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Product Preview */}
          <div className="space-y-4 border-l border-gray-200 pl-6 flex flex-col">
            <h3 className="text-lg font-semibold text-white">
              Product Preview
            </h3>
            
            <div className="bg-gray-700 rounded-lg p-6 flex flex-col items-center justify-center flex-1">
              <div className="mb-4">
                <ProductVisual
                  product={previewProduct}
                  scale={1} // Real scale, same as ProductList
                  draggable={false}
                  showLabel={true}
                  showStabilityIndicator={true}
                  className="mx-auto"
                />
              </div>
              
              {/* Product Info */}
              <div className="text-center space-y-2">
                <div className="text-white font-medium">
                  {previewProduct.name}
                </div>
                <div className="text-gray-300 text-sm space-y-1">
                  <div>Afmetingen: {previewProduct.width} × {previewProduct.height} × {previewProduct.depth} mm</div>
                  <div>Stabiliteit: {previewProduct.stable ? "Stabiel" : "Instabiel"}</div>
                  <div className="flex items-center justify-center gap-2">
                    <span>Kleur:</span>
                    <div 
                      className="w-4 h-4 rounded border border-gray-400"
                      style={{ backgroundColor: previewProduct.color }}
                    />
                    <span className="font-mono text-xs">{previewProduct.color}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeProductModal;
