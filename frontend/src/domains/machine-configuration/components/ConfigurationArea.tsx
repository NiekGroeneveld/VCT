import React, { useState, useEffect, useCallback } from "react";
import { Tray, TrayConstants } from "../../tray-management/types/tray.types";
import {
  getDotYPosition,
  ConfigurationConstants,
} from "../types/configuration.types";
import { DraggableTrayWrapper } from "../../tray-management/components/DraggableTrayWrapper";
import { useScaling } from "../../../hooks/useScaling";
import { useConfig } from "../../../Context/useConfig";
import { useCompany } from "../../../Context/useCompany";
import { MachineConfigurationZone } from "./MachineConfigurationZone";
import { useTrayDragDrop } from "../../../domains/tray-management/hooks/useTrayDragDrop";
import { useCollisionDetection } from "../hooks/useCollisionDetection";
import { useCrossTrayOperations } from "../../../domains/tray-management/hooks/useCrossTrayOperations";
import { TrayPositionService } from "../services/TrayPositionService";
import { configurationService } from "../services/ConfigurationService";
import { Plus } from "lucide-react";
import { get } from "http";

export const ConfigurationArea: React.FC = () => {
  const { selectedConfiguration, setSelectedConfiguration } = useConfig();
  const { selectedCompany } = useCompany();
  const { scaledValue } = useScaling();
  const [trays, setTrays] = useState<Tray[]>([]);

  const { startTrayDrag, updateTrayPosition, endTrayDrag } = useTrayDragDrop(
    trays,
    setTrays
  );

  useEffect(() => {
    if (selectedConfiguration && Array.isArray(selectedConfiguration.trays)) {
      setTrays(selectedConfiguration.trays);
    } else {
      setTrays([]);
    }
  }, [selectedConfiguration]);

  //Hook for collision detection
  const checkCollision = useCollisionDetection(trays, setTrays);

  // Add THIS:: Hook for cross-tray product movement
  const { handleProductMoveBetweenTrays, moveProductBetweenTrays } =
    useCrossTrayOperations(trays, setTrays);

  //ADD This: Event lister for cross-tray product operations
  useEffect(() => {
    const handleCrossTrayRequest = (event: any) => {
      const { sourceTrayId, targetTrayId, sourceIndex, targetIndex } =
        event.detail;
      moveProductBetweenTrays(
        sourceTrayId,
        targetTrayId,
        sourceIndex,
        targetIndex
      );
    };

    window.addEventListener(
      "requestCrossTrayProductMove",
      handleCrossTrayRequest
    );
    return () =>
      window.removeEventListener(
        "requestCrossTrayProductMove",
        handleCrossTrayRequest
      );
  }, [moveProductBetweenTrays]);

  const handleAddTray = async () => {
    const companyId = selectedCompany?.id;
    if (!companyId) {
      console.error("No company selected");
      return;
    }
    const configurationId = selectedConfiguration?.id;
    if (!configurationId) {
      console.error("No configuration selected");
      return;
    }

    //console.log("Adding tray to configuration", { companyId, configurationId, dotPosition: getDotPositionForNewTray() });
    await configurationService.AddTrayToConfigurationAPI(
      Number(companyId),
      Number(configurationId),
      getDotPositionForNewTray()
    );
    // Reload configuration from API after adding tray
    const config = await configurationService.LoadConfigurationAPI(
      Number(companyId),
      Number(configurationId)
    );
    if (config) {
      setSelectedConfiguration(config);
      setTrays(config.trays || []);
      localStorage.setItem("selectedConfiguration", JSON.stringify(config));
    }
  };

  const getDotPositionForNewTray = () => {
    let validDot = 1;
    const existingDots = trays.map((tray) => tray.dotPosition);
    //Find the first available dot position
    const trayModel: Tray = {
      id: -1,
      dotPosition: validDot,
      trayHeight: TrayConstants.MINIMAL_TRAY_HEIGHT,
      trayWidth: TrayConstants.DEFAULT_TRAY_WIDTH,
      products: [],
    };

    for (let dot = 1; dot <= ConfigurationConstants.DOTS; dot++) {
      trayModel.dotPosition = dot;
      const validation = TrayPositionService.canPlaceTrayAtDot(
        trayModel,
        dot,
        trays
      );
      if (validation.canPlace) {
        validDot = dot;
        break;
      }
    }
    return validDot;
  };

  const handleRemoveTray = async (trayId: number) => {
    if (!selectedCompany?.id || !selectedConfiguration?.id) return;
    await configurationService.RemoveTrayFromConfigurationAPI(
      Number(selectedCompany.id),
      Number(selectedConfiguration.id),
      trayId
    );
    // Reload configuration after removal
    const config = await configurationService.LoadConfigurationAPI(
      Number(selectedCompany.id),
      Number(selectedConfiguration.id)
    );
    if (config) {
      setSelectedConfiguration(config);
      setTrays(config.trays || []);
      localStorage.setItem("selectedConfiguration", JSON.stringify(config));
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg border-2 border-gray-300">
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b border-gray-300">
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Configuratie</h3>
          <button
            onClick={handleAddTray}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-2 transition-colors text-sm"
          >
            <Plus size={16} />
            <span>Lade Toevoegen</span>
          </button>
        </div>
      </div>

      {/* Configuration Area */}
      <div className="p-4">
        <MachineConfigurationZone
          trays={trays}
          onTrayPositionChange={(_companyId, _configurationId, trayId, newY) =>
            updateTrayPosition(trayId, newY)
          }
        >
          {/* Render each tray */}
          {trays.map((tray) => (
            <DraggableTrayWrapper
              key={tray.id}
              tray={tray}
              onUpdate={(updatedTray) => {
                setTrays((prevTrays) =>
                  prevTrays.map((t) =>
                    t.id === updatedTray.id ? updatedTray : t
                  )
                );
              }}
              onRemove={() => {handleRemoveTray(tray.id)}}
              onDragStart={startTrayDrag}
              onDragEnd={endTrayDrag}
              onDragUpdate={updateTrayPosition}
              onProductMoveBetweenTrays={handleProductMoveBetweenTrays} // ADD THIS LINE
              style={{
                position: "absolute",
                bottom: `${scaledValue(
                  getDotYPosition(tray.dotPosition || 1)
                )}px`,
                left: `${scaledValue(10)}px`,
                width: `${scaledValue(scaledValue(tray.trayWidth))}px`,
                height: `${scaledValue(tray.trayHeight)}px`,
                zIndex: tray.isDragging ? 1000 : 1,
              }}
            />
          ))}
        </MachineConfigurationZone>
      </div>
    </div>
  );
};
