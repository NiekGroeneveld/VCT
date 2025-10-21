// src/domains/product-management/components/ProductInfoModal.tsx
import React, { useState, useEffect } from "react";
import { Product } from "../types/product.types";
import { ProductVisual } from "./ProductVisual";
import { X, Edit2, Check, Trash2 } from "lucide-react";
import { productService } from "../services/productService";
import { useCompany } from "../../../Context/useCompany";
import { ColorPicker } from "../../../shared/components/ui/ColorPicker";

interface ProductInfoModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onProductUpdated?: () => void; // Callback to refresh product list
}

interface EditableFormData {
  name: string;
  width: number;
  height: number;
  depth: number;
  stable: boolean;
  color: string;
  palletConfig: string;
}

export const ProductInfoModal: React.FC<ProductInfoModalProps> = ({
  product,
  open,
  onClose,
  onProductUpdated,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditableFormData | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSaveAsNewModal, setShowSaveAsNewModal] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProductInUse, setIsProductInUse] = useState<boolean | null>(null);
  const { selectedCompany } = useCompany();

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        width: product.width,
        height: product.height,
        depth: product.depth,
        stable: product.stable,
        color: product.color,
        palletConfig: product.palletConfig || "",
      });
      setErrorMessage(null); // Clear errors when product changes
    }
  }, [product]);

  // Fetch product in-use status when modal opens
  useEffect(() => {
    const fetchInUseStatus = async () => {
      if (product && selectedCompany && open) {
        try {
          const inUse = await productService.ProductInUseAPI(
            Number(selectedCompany.id),
            product.id
          );
          setIsProductInUse(inUse);
        } catch (error) {
          console.error("Failed to check product in-use status:", error);
          setIsProductInUse(null);
        }
      }
    };

    fetchInUseStatus();
  }, [product, selectedCompany, open]);

  if (!product || !formData) return null;

  const handleClose = () => {
    setEditingField(null);
    setShowColorPicker(false);
    setShowSaveAsNewModal(false);
    setErrorMessage(null);
    onClose();
  };

  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
    setErrorMessage(null); // Clear error when user starts editing
  };

  const handleFieldChange = (field: keyof EditableFormData, value: string | number | boolean) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
    setErrorMessage(null); // Clear error when user makes changes
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedCompany || !formData) {
      console.error("No company selected or no form data");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null); // Clear any previous errors
    try {
      // Check if product is in use
      const isInUse = await productService.ProductInUseAPI(
        Number(selectedCompany.id),
        product.id
      );

      if (isInUse) {
        setErrorMessage(
          "⚠️ Dit product is momenteel in gebruik en kan niet worden gewijzigd. " +
          "Verwijder het eerst uit alle configuraties of sla het op als een nieuw product."
        );
        setIsProcessing(false);
        return;
      }
      const updateData = {
        name: formData.name,
        width: formData.width,
        height: formData.height,
        depth: formData.depth,
        stable: formData.stable,
        ColorHex: formData.color,
        PalletConfig: formData.palletConfig || "",
        isActive: product.isActive,
      };

      const updatedProduct = await productService.UpdateProductAPI(
        Number(selectedCompany.id),
        product.id,
        updateData
      );

      if (updatedProduct) {
        console.log("Product updated successfully");
        onProductUpdated?.(); // Refresh product list
        handleClose(); // Close modal
      } else {
        console.error("Failed to update product");
        alert("Product bijwerken is mislukt. Probeer het opnieuw.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Er is een fout opgetreden bij het bijwerken van het product.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAsNew = () => {
    // Generate default name
    const defaultName = `${formData?.name || "Product"} (${Date.now() % 1000})`;
    setNewProductName(defaultName);
    setErrorMessage(null); // Clear any errors
    setShowSaveAsNewModal(true);
  };

  const handleConfirmSaveAsNew = async () => {
    if (!selectedCompany || !formData) {
      console.error("No company selected or no form data");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null); // Clear any errors;
    try {
      const newProductData = {
        name: newProductName,
        width: formData.width,
        height: formData.height,
        depth: formData.depth,
        stable: formData.stable,
        ColorHex: formData.color,
        PalletConfig: formData.palletConfig || "",
      };

      const createdProduct = await productService.CreateProductAPI(
        Number(selectedCompany.id),
        newProductData
      );

      if (createdProduct) {
        console.log("New product created successfully");
        onProductUpdated?.(); // Refresh product list
        setShowSaveAsNewModal(false);
        handleClose(); // Close modal
      } else {
        console.error("Failed to create product");
        alert("Product aanmaken is mislukt. Probeer het opnieuw.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Er is een fout opgetreden bij het aanmaken van het product.");
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
      `Weet je zeker dat je "${product.name}" wilt verwijderen?\n\n` +
      "Als het product in gebruik is, wordt het gedeactiveerd in plaats van verwijderd."
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
          alert(`Product "${product.name}" is permanent verwijderd.`);
        } else if (result.action === "deactivated") {
          alert(`Product "${product.name}" is in gebruik en is gedeactiveerd.`);
        }

        onProductUpdated?.(); // Refresh product list
        handleClose(); // Close modal
      } else {
        console.error("Failed to delete product");
        alert("Product verwijderen is mislukt. Probeer het opnieuw.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Er is een fout opgetreden bij het verwijderen van het product.");
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
          {/* Header - Editable Name */}
          <div>
            {editingField === "name" ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={handleFieldBlur}
                autoFocus
                className="text-2xl font-bold text-gray-800 mb-1 border-b-2 border-blue-500 outline-none w-full bg-transparent"
              />
            ) : (
              <h2 
                className="text-2xl font-bold text-gray-800 mb-1 cursor-pointer hover:bg-gray-100 rounded px-2 -mx-2"
                onClick={() => handleFieldClick("name")}
              >
                {formData.name}
              </h2>
            )}
            <p className="text-sm text-gray-500">Klik op een eigenschap om te bewerken</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
              <p className="text-red-700 font-semibold text-sm leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Product Visual and Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Visual Preview */}
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
              <div className="mb-4">
                <ProductVisual
                  product={{ ...product, ...formData }}
                  scale={1.5} // Larger preview
                  draggable={false}
                  showLabel={true}
                  showStabilityIndicator={true}
                />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">Kleur:</span>
                  <div
                    className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                    style={{ backgroundColor: formData.color }}
                    onClick={() => setShowColorPicker(true)}
                    title="Klik om kleur te wijzigen"
                  />
                  <span className="font-mono text-xs text-gray-700">
                    {formData.color}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Product Information */}
            <div className="space-y-4">
              {/* Dimensions Section - Editable */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Afmetingen
                </h3>
                <div className="space-y-2">
                  {/* Width */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="font-bold text-lg">—</span>
                      Breedte
                    </span>
                    {editingField === "width" ? (
                      <input
                        type="number"
                        value={formData.width}
                        onChange={(e) => handleFieldChange("width", parseInt(e.target.value) || 0)}
                        onBlur={handleFieldBlur}
                        autoFocus
                        className="font-semibold text-gray-800 border-b-2 border-blue-500 outline-none text-right bg-transparent w-24"
                      />
                    ) : (
                      <span 
                        className="font-semibold text-gray-800 cursor-pointer hover:bg-gray-100 rounded px-2"
                        onClick={() => handleFieldClick("width")}
                      >
                        {formData.width} mm
                      </span>
                    )}
                  </div>

                  {/* Height */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="font-bold text-lg">|</span>
                      Hoogte
                    </span>
                    {editingField === "height" ? (
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleFieldChange("height", parseInt(e.target.value) || 0)}
                        onBlur={handleFieldBlur}
                        autoFocus
                        className="font-semibold text-gray-800 border-b-2 border-blue-500 outline-none text-right bg-transparent w-24"
                      />
                    ) : (
                      <span 
                        className="font-semibold text-gray-800 cursor-pointer hover:bg-gray-100 rounded px-2"
                        onClick={() => handleFieldClick("height")}
                      >
                        {formData.height} mm
                      </span>
                    )}
                  </div>

                  {/* Depth */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="font-bold text-lg">⊡</span>
                      Diepte
                    </span>
                    {editingField === "depth" ? (
                      <input
                        type="number"
                        value={formData.depth}
                        onChange={(e) => handleFieldChange("depth", parseInt(e.target.value) || 0)}
                        onBlur={handleFieldBlur}
                        autoFocus
                        className="font-semibold text-gray-800 border-b-2 border-blue-500 outline-none text-right bg-transparent w-24"
                      />
                    ) : (
                      <span 
                        className="font-semibold text-gray-800 cursor-pointer hover:bg-gray-100 rounded px-2"
                        onClick={() => handleFieldClick("depth")}
                      >
                        {formData.depth} mm
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Properties Section - Editable Stability and Pallet Config */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Eigenschappen
                </h3>
                <div className="space-y-2">
                  {/* Status - Read only */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`font-semibold ${
                        product.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.isActive ? "Actief" : "Inactief"}
                    </span>
                  </div>

                  {/* In Use - Read only */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">In Gebruik</span>
                    {isProductInUse === null ? (
                      <span className="text-gray-400 text-sm">Laden...</span>
                    ) : (
                      <span
                        className={`font-semibold ${
                          isProductInUse ? "text-orange-600" : "text-green-600"
                        }`}
                      >
                        {isProductInUse ? "Ja" : "Nee"}
                      </span>
                    )}
                  </div>

                  {/* Stability - Toggle Switch */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Motor Type</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleFieldChange("stable", !formData.stable)}
                        className={`relative inline-flex h-8 w-10 flex-col items-center rounded-md transition-colors ${
                          formData.stable ? "bg-vendolutionBlue" : "bg-vendolutionBlue"
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-8 transform rounded-sm bg-white transition-transform ${
                            formData.stable ? "translate-y-4" : "translate-y-1"
                          }`}
                        />
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        {formData.stable ? "Lage Motor" : "Hoge Motor"}
                      </span>
                    </div>
                  </div>

                  {/* Pallet Configuration - Editable for high motors */}
                  {!formData.stable && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Pallet Configuratie</span>
                      {editingField === "palletConfig" ? (
                        <input
                          type="text"
                          value={formData.palletConfig}
                          onChange={(e) => handleFieldChange("palletConfig", e.target.value)}
                          onBlur={handleFieldBlur}
                          autoFocus
                          className="font-mono text-sm font-semibold text-gray-800 border-b-2 border-blue-500 outline-none text-right bg-transparent w-32"
                        />
                      ) : (
                        <span 
                          className="font-mono text-sm font-semibold text-gray-800 cursor-pointer hover:bg-gray-100 rounded px-2"
                          onClick={() => handleFieldClick("palletConfig")}
                        >
                          {formData.palletConfig || "(leeg)"}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Product ID - Read only */}
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
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 gap-3">
            {/* Delete Button - Left side */}
            <button
              onClick={handleDeleteProduct}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Verwijderen
            </button>

            {/* Right side buttons */}
            <div className="flex gap-3">
              {/* Save Changes Button */}
              <button
                onClick={handleSaveChanges}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Opslaan...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Wijzigingen Opslaan
                  </>
                )}
              </button>

              {/* Save as New Product Button */}
              <button
                onClick={handleSaveAsNew}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
              >
                Opslaan als Nieuw Product
              </button>

              {/* Close button */}
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 rounded-md transition-colors"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setShowColorPicker(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Selecteer Kleur</h3>
            
            <ColorPicker
              value={formData.color}
              onChange={(newColor) => handleFieldChange("color", newColor)}
            />
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowColorPicker(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Klaar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save as New Product Modal */}
      {showSaveAsNewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 relative max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setShowSaveAsNewModal(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Opslaan als Nieuw Product</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Naam
              </label>
              <input
                type="text"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Voer product naam in"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSaveAsNewModal(false)}
                disabled={isProcessing}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 rounded-md transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={handleConfirmSaveAsNew}
                disabled={isProcessing || !newProductName.trim()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
              >
                {isProcessing ? "Bezig..." : "Product Aanmaken"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfoModal;
