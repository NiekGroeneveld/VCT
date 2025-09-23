import React, { useCallback, useState } from "react";
import { useCompany } from "../../Context/useCompany";
import { useConfig } from "../../Context/useConfig";
import { openA4PrintWindowForMachineConfiguration } from "../services/PdfExportService";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

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

  const [liftStand, setLiftStand] = useState("1");
  const [liftAccessoires, setLiftAccessoires] = useState("rollenbaantje");

  const renderCircles = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <svg key={i} width="10" height="10" viewBox="0 0 10 10" className="inline ml-1">
        <circle cx="5" cy="5" r="4" fill="#fbbf24" />
      </svg>
    ));
  };

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
      orientation: "portrait",
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
        <h4 className="text-md font-semibold text-left mb-2">Lift Instelling</h4>
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-500" />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">LiftStand</label>
            <Select.Root value={liftStand} onValueChange={setLiftStand}>
              <Select.Trigger className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-vendolutionBlue flex items-center justify-between w-full">
                <Select.Value />
                <ChevronDown className="h-4 w-4" />
              </Select.Trigger>
              <Select.Content className="bg-white border border-gray-300 rounded shadow-lg z-10">
                <Select.Item value="1" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <Select.ItemText>1 - {renderCircles(1)}</Select.ItemText>
                </Select.Item>
                <Select.Item value="2" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <Select.ItemText>2 - {renderCircles(2)}</Select.ItemText>
                </Select.Item>
                <Select.Item value="3" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <Select.ItemText>3 - {renderCircles(3)}</Select.ItemText>
                </Select.Item>
                <Select.Item value="4" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <Select.ItemText>4 - {renderCircles(4)}</Select.ItemText>
                </Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Lift Assecoires</label>
            <Select.Root value={liftAccessoires} onValueChange={setLiftAccessoires}>
              <Select.Trigger className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-vendolutionBlue flex items-center justify-between w-full">
                <Select.Value />
                <ChevronDown className="h-4 w-4" />
              </Select.Trigger>
              <Select.Content className="bg-white border border-gray-300 rounded shadow-lg z-10">
                <Select.Item value="Leeg" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <Select.ItemText>Leeg</Select.ItemText>
                </Select.Item>
                <Select.Item value="schuimbodem en schuimrand" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <Select.ItemText>Schuimbodem - Rand</Select.ItemText>
                </Select.Item>
                <Select.Item value="Rollenbaantje" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <Select.ItemText>Rollenbaantje</Select.ItemText>
                </Select.Item>
                <Select.Item value="Glijplaat" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <Select.ItemText>Glijplaat</Select.ItemText>
                </Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        {/* Info panel: show currently loaded configuration */}
        <div className="mt-6 text-sm text-gray-700">
          {selectedConfiguration ? (
            <div>
              <div className="font-medium">Huidige configuratie</div>
              <div className="text-gray-600">
                Tips voor gebruik: Moet nog geimplementeerd worden.
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Geen configuratie geladen</div>
          )}
        </div>
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
