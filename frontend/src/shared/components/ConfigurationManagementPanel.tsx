import React, { useCallback } from "react";
import { useCompany } from "../../Context/useCompany";
import { useConfig } from "../../Context/useConfig";
import { openA4PrintWindowForMachineConfiguration } from "../services/PdfExportService";
import { VisionV8ElevatorSettings } from "./VisionV8ElevatorSettings";
import { NuukElevatorSettings } from "./NuukElevatorSettings";

type Props = {
  className?: string;
};

/**
 * Right sidebar panel for configuration management actions.
 * Reads the loaded configuration from context and provides actions like Print to PDF.
 */
export const ConfigurationManagementPanel: React.FC<Props> = ({ className = "" }) => {
  const { selectedCompany } = useCompany();
  const { selectedConfiguration } = useConfig();

  const handlePrintToPdf = useCallback(async () => {
    const el = document.getElementById("machine-configuration-zone");
    if (!el) {
      console.error("MachineConfigurationZone element not found");
      return;
    }
    await openA4PrintWindowForMachineConfiguration({
      element: el,
      companyName: selectedCompany?.name,
      configurationName: selectedConfiguration?.name,
      configurationTypeDataName:
        (selectedConfiguration as any)?.configurationType ||
        (selectedConfiguration as any)?.configurationTypeDataName,
      orientation: "landscape",
      configuration: selectedConfiguration ?? undefined,
    });
  }, [selectedCompany?.name, selectedConfiguration?.name, selectedConfiguration]);

  return (
    <div className={`flex flex-col bg-gray-100 h-full border-gray-600 rounded-lg border ${className}`}>
      {/* Header */}
      <div className="p-4 bg-white rounded-t-lg border-b border-gray-300 flex-shrink-0">
        <h3 className="text-xl font-semibold text-center">Configuratie Beheer</h3>
      </div>
      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

      {/* Content Area */}
      <div className="flex-grow overflow-auto p-4">
        {/* Info Panel */}
        {selectedConfiguration && (
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h4 className="text-md font-semibold text-left mb-3">Configuratie Informatie</h4>
            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-500 mb-3" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Configuratie Type:</span>
                <div className="text-gray-900 mt-1">
                  {selectedConfiguration.ConfigurationType || selectedConfiguration.configurationTypeData?.configurationType || 'Onbekend'}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Configuratie Naam:</span>
                <div className="text-gray-900 mt-1">
                  {selectedConfiguration.name}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Aangemaakt:</span>
                <div className="text-gray-900 mt-1">
                  {selectedConfiguration.createdAt ? new Date(selectedConfiguration.createdAt).toLocaleString('nl-NL') : 'Onbekend'}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Laatst Bewerkt:</span>
                <div className="text-gray-900 mt-1">
                  {selectedConfiguration.updatedAt ? new Date(selectedConfiguration.updatedAt).toLocaleString('nl-NL') : 'Onbekend'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lift Instelling - show appropriate component based on machine type */}
        {selectedConfiguration?.configurationTypeData?.configurationType === "VisionV8" && (
          <VisionV8ElevatorSettings />
        )}
        {selectedConfiguration?.configurationTypeData?.configurationType === "Nuuk" && (
          <NuukElevatorSettings />
        )}

      </div>

      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
      {/* ButtonSpace */}
      <div className="p-4 bg-white rounded-b-lg border-t border-gray-300 flex-shrink-0">
        <button
          onClick={handlePrintToPdf}
          className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold px-4 py-2 rounded shadow"
          title="Export Configuration to PDF"
        >
          Print to PDF
        </button>
      </div>
    </div>
  );
};

export default ConfigurationManagementPanel;
