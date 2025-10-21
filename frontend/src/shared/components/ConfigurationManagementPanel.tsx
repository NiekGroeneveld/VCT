import React, { useCallback, useState } from "react";
import { useCompany } from "../../Context/useCompany";
import { useConfig } from "../../Context/useConfig";
import { openA4PrintWindowForMachineConfiguration } from "../services/PdfExportService";
import { VisionV8ElevatorSettings } from "./VisionV8ElevatorSettings";
import { NuukElevatorSettings } from "./NuukElevatorSettings";
import DuplicateConfigurationModal from "../modals/duplicateConfigurationModal";
import { configurationService } from "../../domains/machine-configuration/services/ConfigurationService";
import { Copy, Trash2, Printer } from "lucide-react";

type Props = {
  className?: string;
};

/**
 * Right sidebar panel for configuration management actions.
 * Reads the loaded configuration from context and provides actions like Print to PDF.
 */
export const ConfigurationManagementPanel: React.FC<Props> = ({ className = "" }) => {
  const { selectedCompany } = useCompany();
  const { selectedConfiguration, setSelectedConfiguration } = useConfig();

  // Helper function to convert UTC date string to local time display
  const formatUTCDateToLocal = (utcDateString: string | undefined): string => {
    if (!utcDateString) return 'Onbekend';
    
    // Ensure the date string is treated as UTC by adding 'Z' if not present
    const dateStr = utcDateString.endsWith('Z') ? utcDateString : `${utcDateString}Z`;
    const date = new Date(dateStr);
    
    return date.toLocaleString('nl-NL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDuplicate = useCallback(async (newName: string) => {
    if (!selectedCompany?.id || !selectedConfiguration?.id) {
      console.error("No company or configuration selected");
      return;
    }

    try {
      console.log('Duplicating configuration:', {
        companyId: selectedCompany.id,
        configurationId: selectedConfiguration.id,
        newName
      });

      const copiedConfig = await configurationService.CloneConfigurationAPI(
        Number(selectedCompany.id),
        selectedConfiguration.id,
        newName
      );

      console.log('Copied configuration response:', copiedConfig);

      if (copiedConfig) {
        // The API now returns a fully processed ConfigurationAreaDTO
        setSelectedConfiguration(copiedConfig);
        // Refresh the configurations list in NavBar
        window.dispatchEvent(new Event('refreshConfigurations'));
        alert(`Configuratie succesvol gedupliceerd als "${newName}"`);
      } else {
        alert("Fout bij dupliceren van configuratie");
      }
    } catch (error) {
      console.error("Error duplicating configuration:", error);
      alert("Fout bij dupliceren van configuratie: " + (error as Error).message);
    }
  }, [selectedCompany?.id, selectedConfiguration?.id, setSelectedConfiguration]);

  const handleDelete = useCallback(async () => {
    if (!selectedCompany?.id || !selectedConfiguration?.id) {
      console.error("No company or configuration selected");
      return;
    }

    const confirmDelete = window.confirm(
      `Weet je zeker dat je de configuratie "${selectedConfiguration.name}" wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const success = await configurationService.DeleteConfigurationAPI(
        Number(selectedCompany.id),
        selectedConfiguration.id
      );

      if (success) {
        setSelectedConfiguration(null);
        // Refresh the configurations list in NavBar
        window.dispatchEvent(new Event('refreshConfigurations'));
        alert("Configuratie succesvol verwijderd");
      } else {
        alert("Fout bij verwijderen van configuratie");
      }
    } catch (error) {
      console.error("Error deleting configuration:", error);
      alert("Fout bij verwijderen van configuratie");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedCompany?.id, selectedConfiguration?.id, selectedConfiguration?.name, setSelectedConfiguration]);

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
                  {formatUTCDateToLocal(selectedConfiguration.createdAt)}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Laatst Bewerkt:</span>
                <div className="text-gray-900 mt-1">
                  {formatUTCDateToLocal(selectedConfiguration.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Tips */}
        {selectedConfiguration && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <h4 className="text-md font-semibold text-left mb-3 text-blue-800">Configuratie Tips</h4>
            <hr className="h-px bg-blue-200 border-0 mb-3" />
            <div className="text-sm text-gray-700 space-y-2">
              <p> 
                • Maak eerst alle producten aan om een goed overzicht te krijgen van de producten die in de automaat moeten. 
              </p>
              <p className="leading-relaxed">
                • Begin met het configurereen van de bovenste lade en werk naar beneden. De bovenste lade heeft namelijk de meeste ruimt in de hoogte, dit bepaalt ook de liftstand. 
              </p>
              <p className="leading-relaxed">
                • Plaats eerst de hoge producten en sorteer de producten per lade op hoogte. 
              </p>
              <p className="leading-relaxed">
                • Controleer de rode collision waarschuwingen voor overlappende producten
              </p>
              <p className = "leading-relaxed">
                • Je kunt in de productlijst producten bewerken en als nieuw product opslaan om snel varianten toe te voegen.
              </p>
              <p>
                • Gebruik de print knop om een PDF overzicht van de configuratie te genereren
              </p>
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
        {/* Action buttons - only show when configuration is loaded */}
        {selectedConfiguration && (
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShowDuplicateModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-colors"
              title="Dupliceer Configuratie"
            >
              <Copy size={18} />
              Dupliceer
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Verwijder Configuratie"
            >
              <Trash2 size={18} />
              {isDeleting ? "Verwijderen..." : "Verwijder"}
            </button>
            <button
              onClick={handlePrintToPdf}
              className="flex items-center justify-center gap-2 bg-vendolutionWarm hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded shadow transition-colors"
              title="Export Configuration to PDF"
            >
              <Printer size={18} />
              Print PDF
            </button>
          </div>
        )}
      </div>

      {/* Duplicate Configuration Modal */}
      {selectedConfiguration && (
        <DuplicateConfigurationModal
          isOpen={showDuplicateModal}
          onClose={() => setShowDuplicateModal(false)}
          onDuplicate={handleDuplicate}
          originalName={selectedConfiguration.name}
        />
      )}
    </div>
  );
};

export default ConfigurationManagementPanel;
