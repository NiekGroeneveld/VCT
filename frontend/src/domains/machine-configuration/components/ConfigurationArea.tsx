import React, { useState, useEffect, useCallback } from "react";
import { Tray, TrayConstants } from "../../tray-management/types/tray.types";
import {
  getDotYPosition,
  ConfigurationConstants,
  ConfigurationConstantsService,
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
import { ProductSpacingService } from "../../tray-management/services/ProductSpacingService";
import { Plus, AlignJustify } from "lucide-react";
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

  // Apply spacing to all trays after they are loaded
  const applySpacingToAllTrays = useCallback(() => {
    setTrays(currentTrays => {
      const spacedTrays = ProductSpacingService.spaceOutAllTrays(currentTrays);
      return spacedTrays;
    });
  }, []);

  // Auto-apply spacing whenever trays change (e.g., after API refresh)
  useEffect(() => {
    if (trays.length > 0) {
      // Small delay to ensure trays are fully loaded before spacing
      const timeoutId = setTimeout(() => {
        applySpacingToAllTrays();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedConfiguration, applySpacingToAllTrays]);

  //Hook for collision detection
  const checkCollision = useCollisionDetection(trays, setTrays, selectedConfiguration);

  // Add THIS:: Hook for cross-tray product movement
  const { handleProductMoveBetweenTrays, moveProductBetweenTrays } =
    useCrossTrayOperations(trays, setTrays);

  // Event listener for cross-tray product operations
  useEffect(() => {
    const handleCrossTrayRequest = (event: any) => {
      const { sourceTrayId, targetTrayId, sourceIndex, targetIndex } =
        event.detail;
      // Optimistic local update first
      const didMoveLocally = moveProductBetweenTrays(
        sourceTrayId,
        targetTrayId,
        sourceIndex,
        targetIndex
      );

      // Persist to backend
      const companyId = selectedCompany?.id;
      const configurationId = selectedConfiguration?.id;
      if (!companyId || !configurationId) {
        console.error('Missing company or configuration ID for cross-tray move');
        return;
      }

      // Keep a snapshot to rollback if API fails
      const prevTrays = [...trays];
      configurationService
        .MoveProductBetweenTraysAPI(
          Number(companyId),
          Number(configurationId),
          Number(sourceTrayId),
          Number(targetTrayId),
          Number(sourceIndex)
        )
        .then((res) => {
          // Response contains FromTray and ToTray DTOs; merge them into UI state
          if (res && res.FromTray && res.ToTray) {
            setTrays((prev) => {
              const updated = prev.map((t) => {
                if (t.id === res.FromTray.id) return res.FromTray;
                if (t.id === res.ToTray.id) return res.ToTray;
                return t;
              });
              // Optionally space out after server-confirmed update
              const spaced = ProductSpacingService.spaceOutAllTrays(updated);
              return spaced;
            });
          }
        })
        .catch((err) => {
          console.error('Cross-tray move API failed, rolling back UI change', err);
          setTrays(prevTrays);
        });
    };

    // Listen for product refresh events to automatically apply spacing
    const handleProductRefresh = () => {
      console.log("Product refresh detected, applying spacing to all trays");
      setTimeout(() => {
        applySpacingToAllTrays();
      }, 200);
    };

    // Listen to the event dispatched by TrayComponent/TrayDropHandler
    window.addEventListener("requestCrossTrayMove", handleCrossTrayRequest);
    window.addEventListener("productRefresh", handleProductRefresh);
    
    return () => {
      window.removeEventListener("requestCrossTrayMove", handleCrossTrayRequest);
      window.removeEventListener("productRefresh", handleProductRefresh);
    };
  }, [moveProductBetweenTrays, applySpacingToAllTrays, selectedCompany?.id, selectedConfiguration?.id, trays]);

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
      
      // Apply spacing after loading configuration
      setTimeout(() => {
        if (config.trays && config.trays.length > 0) {
          const spacedTrays = ProductSpacingService.spaceOutAllTrays(config.trays);
          setTrays(spacedTrays);
        }
      }, 150);
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

    const amountDots = selectedConfiguration ? ConfigurationConstantsService.getAmountDots(selectedConfiguration) : ConfigurationConstants.DOTS;
    for (let dot = 1; dot <= amountDots; dot++) {
      trayModel.dotPosition = dot;
      const validation = TrayPositionService.canPlaceTrayAtDot(
        trayModel,
        dot,
        trays,
        selectedConfiguration!
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
      
      // Apply spacing after reloading configuration
      setTimeout(() => {
        if (config.trays && config.trays.length > 0) {
          const spacedTrays = ProductSpacingService.spaceOutAllTrays(config.trays);
          setTrays(spacedTrays);
        }
      }, 150);
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg border-2 border-gray-300">
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b border-gray-300">
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Configuratie</h3>
          <div className="flex gap-2">
            <button
              onClick={handleAddTray}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-2 transition-colors text-sm"
            >
              <Plus size={16} />
              <span>Lade Toevoegen</span>
            </button>
          </div>
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
              companyId={selectedCompany?.id ? Number(selectedCompany.id) : undefined}
              configurationId={selectedConfiguration?.id ? Number(selectedConfiguration.id) : undefined}
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
