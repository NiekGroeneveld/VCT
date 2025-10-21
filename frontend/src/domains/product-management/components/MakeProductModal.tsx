import React, { useState, useEffect, useRef } from "react";
import { Product, PlacedProduct } from "../types/product.types";
import { productService } from "../services/productService";
import { ColorPicker } from "../../../shared/components/ui/ColorPicker";
import { ProductVisual } from "./ProductVisual";
import { useCompany } from "../../../Context/useCompany";
import { useConfig } from "../../../Context/useConfig";
import { getPalletConfigurationString } from "../services/palletService";
import { Lock, Unlock } from "lucide-react";


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
  palletConfig: string;
}

const MakeProductModal: React.FC<MakeProductModalProps> = ({
  open,
  onClose,
  onProductCreated,
}) => {
  // Use ref to persist form data across renders/remounts
  const persistedFormData = useRef<ProductFormData>({
    name: "",
    width: 50,
    height: 120,
    depth: 100,
    stable: true,
    color: "#003B7D",
    palletConfig: "",
  });

  const [formData, setFormData] = useState<ProductFormData>(persistedFormData.current);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPalletConfigLocked, setIsPalletConfigLocked] = useState(true);
  const { selectedCompany } = useCompany();
  const { selectedConfiguration } = useConfig();
  const companyId = selectedCompany ? Number(selectedCompany.id) : 0;

  // Sync formData changes to persisted ref
  useEffect(() => {
    persistedFormData.current = formData;
  }, [formData]);

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

  // Auto-update palletConfig when dimensions or stability change (only if locked)
  useEffect(() => {
    if (isPalletConfigLocked && !formData.stable) {
      const calculatedConfig = getClipConfigString();
      if (calculatedConfig !== formData.palletConfig) {
        setFormData((prev) => ({
          ...prev,
          palletConfig: calculatedConfig,
        }));
      }
    }
  }, [formData.width, formData.depth, formData.stable, isPalletConfigLocked]);

  // Helper function to calculate clip config string
  const getClipConfigString = (): string => {
    if (formData.stable) return ""; // Only for high motors (unstable)
    
    let palletDelta = selectedConfiguration?.configurationTypeData?.palletDelta;
    if (!palletDelta) {
      console.warn("No pallet delta found, using hardcoded value of: 135 mm");
      palletDelta = 135;
    }
    
    // Create a mock PlacedProduct for the getPalletConfigurationString function
    const mockPlacedProduct: PlacedProduct = {
      ...previewProduct,
      x: 0,
      y: 0,
      onTrayIndex: 0,
      placedAt: Date.now(),
      trayId: 0,
      extractorType: 'high',
      extractorHeight: 25,
      clipDistance: 0,
      rotation: 0,
    };

    return getPalletConfigurationString(mockPlacedProduct, palletDelta);
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
    
    // Validate palletConfig for high motors (unstable products)
    if (!formData.stable && formData.palletConfig) {
      // Only allow numbers, forward slash (/), backslash (\), and dots (.)
      const validPalletConfigRegex = /^[0-9\/\\.]*$/;
      if (!validPalletConfigRegex.test(formData.palletConfig)) {
        setError("Pallet configuratie bevat ongeldige karakters. Alleen nummers, /, \\ en . zijn toegestaan.");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Create product object matching the backend DTO
      const newProduct = {
        name: formData.name.trim(),
        width: formData.width,
        height: formData.height,
        depth: formData.depth,
        stable: formData.stable,
        ColorHex: formData.color, // Use ColorHex to match backend
        PalletConfig: formData.palletConfig || "", // Match backend PascalCase
      };

      console.log("Creating product with data:", newProduct);
      console.log("Form data palletConfig:", formData.palletConfig);

      // Call the product service to create the product
      await productService.CreateProductAPI(companyId, newProduct);

      // Reset only the name field, keep other settings for next product
      setFormData(prev => ({
        ...prev,
        name: "",
      }));

      // Notify parent component
      onProductCreated?.();

      // Close modal after successful creation
      onClose();
    } catch (err) {
      console.error("Failed to create product:", err);
      setError("Er is een fout opgetreden bij het aanmaken van het product");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Don't reset form data - keep settings for next time modal opens
    // Only clear the error state
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
    color: formData.color || "#3B82F6",
    isActive: true, // New products are active by default
    palletConfig: null, // Will be calculated below
  };

  // Calculate extractor height based on stability
  const extractorHeight = formData.stable ? 10 : 25; // Low extractor: 37mm, High extractor: 90mm

  const clipConfigString = formData.palletConfig || getClipConfigString();

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
        className={`bg-white rounded-lg shadow-xl p-6 relative
            transition-all max-w-4xl w-full mx-4 ${
              open ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={handleClose}
          aria-label="Close"
        >
          <span className="text-gray-600 text-xl">×</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Column - Form */}
          <div className="space-y-4 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800">
              Nieuw Product Toevoegen
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 flex flex-col flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Naam *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Voer product naam in..."
                className="w-full px-3 py-2 border bg-white text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border bg-white border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border bg-white border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border bg-white border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Stabiel product
                  </span>
                </label>
                <div className="flex items-center gap-2">
                    <button
                    type="button"
                    onClick={() => handleInputChange("stable", !formData.stable)}
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
            </div>

            {/* Pallet Configuratie Section - Only for high motors */}
            {!formData.stable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pallet Configuratie
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.palletConfig}
                    onChange={(e) => handleInputChange("palletConfig", e.target.value)}
                    disabled={isPalletConfigLocked}
                    className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isPalletConfigLocked 
                        ? "bg-gray-300 text-gray-900 border-gray-300 cursor-not-allowed" 
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                    placeholder="/.../..."
                  />
                  <button
                    type="button"
                    onClick={() => setIsPalletConfigLocked(!isPalletConfigLocked)}
                    className={`px-3 py-2 border rounded-md transition-colors ${
                      isPalletConfigLocked
                        ? "bg-red-500 hover:bg-red-600 border-red-500"
                        : "bg-green-200 hover:bg-green-300 border-green-200"
                    }`}
                    title={isPalletConfigLocked ? "Unlock to edit" : "Lock to auto-calculate"}
                  >
                    {isPalletConfigLocked ? (
                      <Lock className="w-4 h-4 text-white" />
                    ) : (
                      <Unlock className="w-4 h-4 text-gray-700" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {isPalletConfigLocked
                    ? "Automatisch berekend. Klik op het slot om handmatig te bewerken."
                    : "Handmatig invoeren. Klik op het slot om terug te schakelen naar automatische berekening."}
                </p>
              </div>
            )}

            {/* Color Picker Section */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="px-4 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
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
            <h3 className="text-lg font-semibold text-gray-800">
              Product Preview
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center flex-1">
              {/* Product with Extractor Preview */}
              <div className="mb-4 relative" style={{ height: `${previewProduct.height + extractorHeight + 20}px` }}>
                {/* Extractor */}
                <div
                  className="absolute bg-gray-500 border border-gray-800 flex items-center justify-center"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: '0px',
                    width: `${previewProduct.width}px`,
                    height: `${extractorHeight}px`,
                  }}
                  title={`${formData.stable ? 'Low' : 'High'} extractor (${extractorHeight}mm)`}
                >
                  {/* Clip configuration string for high motors */}
                  {!formData.stable && clipConfigString && (
                    <span
                      className="font-mono font-bold text-gray-100"
                      style={{
                        fontSize: '16px',
                      }}
                    >
                      {clipConfigString}
                    </span>
                  )}
                </div>
                
                {/* Product on top of extractor */}
                <div
                  className="absolute"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: `${extractorHeight}px`,
                  }}
                >
                  <ProductVisual
                    product={previewProduct}
                    scale={1} // Real scale, same as ProductList
                    draggable={false}
                    showLabel={true}
                    showStabilityIndicator={true}
                    className="mx-auto"
                  />
                </div>
              </div>
              
              {/* Product Info */}
              <div className="text-center space-y-2 mt-4">
                <div className="text-gray-800 font-medium">
                  {previewProduct.name}
                </div>
                <div className="text-gray-600 text-sm space-y-1">
                  <div>Product: {previewProduct.width} × {previewProduct.height} × {previewProduct.depth} mm</div>
                  <div>Extractor: {formData.stable ? "Lage Motor" : "Hoge Motor"} ({extractorHeight}mm)</div>
                  <div>Hoogte: {previewProduct.height} mm</div>
                  <div className="flex items-center justify-center gap-2">
                    <span>Kleur:</span>
                    <div 
                      className="w-4 h-4 rounded border border-gray-300"
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
