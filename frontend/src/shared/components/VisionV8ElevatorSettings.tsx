import React, { useCallback, useState, useEffect } from "react";
import { useCompany } from "../../Context/useCompany";
import { useConfig } from "../../Context/useConfig";
import { configurationService } from "../../domains/machine-configuration/services/ConfigurationService";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

export const VisionV8ElevatorSettings: React.FC = () => {
  const { selectedCompany } = useCompany();
  const { selectedConfiguration, setSelectedConfiguration } = useConfig();

  const [liftStand, setLiftStand] = useState("1");
  const [liftAccessoires, setLiftAccessoires] = useState("rollenbaantje");

  // Sync state with configuration when it loads
  useEffect(() => {
    if (selectedConfiguration?.elevatorSetting) {
      setLiftStand(selectedConfiguration.elevatorSetting.toString());
    }
    if (selectedConfiguration?.elevatorAddition) {
      setLiftAccessoires(selectedConfiguration.elevatorAddition);
    }
  }, [selectedConfiguration]);

  const handleLiftStandChange = useCallback(async (value: string) => {
    if (!selectedConfiguration || !selectedCompany) return;

    setLiftStand(value);
    const setting = parseInt(value);

    try {
      await configurationService.UpdateElevatorSettingsAPI(
        Number(selectedCompany.id),
        selectedConfiguration.id,
        setting,
        selectedConfiguration.elevatorAddition || "rollenbaantje"
      );

      // Reload the full configuration from database
      const reloadedConfig = await configurationService.LoadConfigurationAPI(
        Number(selectedCompany.id),
        selectedConfiguration.id
      );
      if (reloadedConfig) {
        setSelectedConfiguration(reloadedConfig);
      }
    } catch (error) {
      console.error('Failed to update elevator setting:', error);
    }
  }, [selectedConfiguration, selectedCompany, setSelectedConfiguration]);

  const handleLiftAccessoiresChange = useCallback(async (value: string) => {
    if (!selectedConfiguration || !selectedCompany) return;

    setLiftAccessoires(value);

    try {
      await configurationService.UpdateElevatorSettingsAPI(
        Number(selectedCompany.id),
        selectedConfiguration.id,
        selectedConfiguration.elevatorSetting || 1,
        value
      );

      // Reload the full configuration from database
      const reloadedConfig = await configurationService.LoadConfigurationAPI(
        Number(selectedCompany.id),
        selectedConfiguration.id
      );
      if (reloadedConfig) {
        setSelectedConfiguration(reloadedConfig);
      }
    } catch (error) {
      console.error('Failed to update elevator addition:', error);
    }
  }, [selectedConfiguration, selectedCompany, setSelectedConfiguration]);

  const renderCircles = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <svg key={i} width="10" height="10" viewBox="0 0 10 10" className="inline ml-1">
        <circle cx="5" cy="5" r="4" fill="#fbbf24" />
      </svg>
    ));
  };

  return (
    <>
      <h4 className="text-md font-semibold text-left mb-2">Lift Instelling</h4>
      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-500" />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">LiftStand</label>
          <Select.Root value={liftStand} onValueChange={handleLiftStandChange}>
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
          <label className="mb-1 font-medium">Lift Toevoegingen</label>
          <Select.Root value={liftAccessoires} onValueChange={handleLiftAccessoiresChange}>
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
    </>
  );
};