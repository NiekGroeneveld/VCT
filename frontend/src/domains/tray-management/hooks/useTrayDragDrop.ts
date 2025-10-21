import { useCallback, useState, useRef, useEffect } from "react";
import { Tray } from "../types/tray.types";
import { TrayPositionService } from "../../machine-configuration/services/TrayPositionService";
import {
  getYPositionDot,
  ConfigurationConstants,
  ConfigurationConstantsService,
} from "../../machine-configuration/types/configuration.types";
import { configurationService } from "../../machine-configuration/services/ConfigurationService";
import { useCompany } from "../../../Context/useCompany";
import { useConfig } from "../../../Context/useConfig";
import { TrayProductManager } from "../services/TrayProductManager";

export const useTrayDragDrop = (
  trays: Tray[],
  setTrays: (trays: Tray[] | ((prev: Tray[]) => Tray[])) => void
) => {
  const [draggedTray, setDraggedTray] = useState<Tray | null>(null);
  const company = useCompany().selectedCompany;
  const { selectedConfiguration, setSelectedConfiguration } = useConfig();
  
  // Use refs to avoid stale closures
  const companyIdRef = useRef(company ? Number(company.id) : null);
  const configurationIdRef = useRef(selectedConfiguration ? Number(selectedConfiguration.id) : null);
  const traysRef = useRef(trays);
  
  // Update refs when values change, but don't reset drag state unnecessarily
  useEffect(() => {
    companyIdRef.current = company ? Number(company.id) : null;
    configurationIdRef.current = selectedConfiguration ? Number(selectedConfiguration.id) : null;
    traysRef.current = trays;
  }, [company, selectedConfiguration, trays]);
  
  // Only reset dragged tray when company or configuration changes (not when trays update)
  useEffect(() => {
    setDraggedTray(null);
  }, [company?.id, selectedConfiguration?.id]);

  /**
   * starts dragging a tray
   * */
  const startTrayDrag = useCallback(
    (tray: Tray) => {
      setDraggedTray(tray);
      setTrays((prev) =>
        prev.map((t) =>
          t.id === tray.id
            ? { ...t, isDragging: true, dragStartDot: t.dotPosition }
            : t
        )
      );
    },
    [setTrays]
  );

/**
     * Updates tray position while dragging
     * Now includes collision detection for visual feedback
     */
    const updateTrayPosition = useCallback((trayId: number, newYposition: number) => {
        // If no configuration is loaded, skip validation
        if (!selectedConfiguration) {
            console.warn('[useTrayDragDrop] No configuration available, skipping position validation');
            return;
        }

        // Convert screen Y to dot position using the same logic as getDotYPosition
        // Since dot 1 is at Y=0, dot 2 at Y=135, etc., we can directly convert
        const newDot = getYPositionDot(newYposition);
        const amountDots = ConfigurationConstantsService.getAmountDots(selectedConfiguration);
        const clampedDot = Math.max(1, Math.min(newDot, amountDots));
        console.log(`[useTrayDragDrop] updateTrayPosition: trayId=${trayId}, Y=${newYposition}, newDot=${newDot}, clampedDot=${clampedDot}`);


    setTrays(prev => prev.map(tray => {
      if (tray.id !== trayId) return tray;

      // Check if this position is valid (for visual feedback)
      const otherTrays = prev.filter(t => t.id !== trayId);
      const validation = TrayPositionService.canPlaceTrayAtDot(tray, clampedDot, otherTrays, selectedConfiguration);

      return {
        ...tray,
        dotPosition: clampedDot,
        // Add a flag to indicate if current position is valid (for visual feedback)
        isValidPosition: validation.canPlace
      };
    }));
    }, [setTrays, selectedConfiguration]);
  /**
   * Ends dragging a tray and validates the new position
   */
  const endTrayDrag = useCallback(
    (trayId: number, _finalYPosition: number) => {
      if (Number.isNaN(_finalYPosition)) {
        console.log(`[DND] Cancel drag for tray ${trayId}`);
      } else {
        console.log(`[DND] Approve drop for tray ${trayId}`);
      }
      
      // Check if configuration is available
      if (!selectedConfiguration) {
        console.warn('[useTrayDragDrop] No configuration available in endTrayDrag');
        setTrays(prev => prev.map(t => t.id === trayId ? { ...t, isDragging: false, dragStartDot: undefined } : t));
        setDraggedTray(null);
        return false;
      }
      
      // If drag ended without a valid drop target, just reset flags and skip API
      if (Number.isNaN(_finalYPosition)) {
        setTrays(prev => prev.map(t => t.id === trayId ? { ...t, isDragging: false, dragStartDot: undefined } : t));
        setDraggedTray(null);
        return false;
      }
      // Use the current trays from ref to avoid stale closure
      const currentTrays = traysRef.current;
      const tray = currentTrays.find((t) => t.id === trayId);

      if (!tray) {
        console.warn(`Tray with ID ${trayId} not found`);
        return false;
      }

      const amountDots = ConfigurationConstantsService.getAmountDots(selectedConfiguration);
      const clampedDot = Math.max(1, Math.min(tray.dotPosition, amountDots));
      const originalDot = tray.dragStartDot || tray.dotPosition;
      const otherTrays = currentTrays.filter((t) => t.id !== trayId);
      const validation = TrayPositionService.canPlaceTrayAtDot(tray, clampedDot, otherTrays, selectedConfiguration);

      console.log(
        `Attempting to place tray ${trayId} at dot ${clampedDot}, validation:`,
        validation
      );

      if (validation.canPlace) {
        setTrays((prev) =>
          prev.map((t) =>
            t.id === trayId
              ? { ...t, dotPosition: clampedDot, isDragging: false, dragStartDot: undefined, isValidPosition: true }
              : t
          )
        );
        setDraggedTray(null);
        const currentCompanyId = companyIdRef.current;
        const currentConfigId = configurationIdRef.current;
        if (currentCompanyId && currentConfigId) {
          configurationService
            .UpdateTrayPositionInConfigurationAPI(
              currentCompanyId,
              currentConfigId,
              trayId,
              clampedDot
            )
            .then(async () => {
              const config = await configurationService.LoadConfigurationAPI(currentCompanyId, currentConfigId);
              if (config) {
                setSelectedConfiguration(config);
                setTrays(config.trays || []);
                localStorage.setItem('selectedConfiguration', JSON.stringify(config));
              }
            })
            .catch(err => console.error('[DND] API error updating tray position', err));
        } else {
          console.warn('Missing companyId/configurationId; skipping API update.');
        }
        console.log(`Tray ${trayId} placed at dot ${clampedDot}`);

        return true;
      } else {
        // Invalid position - allow placement AND save to API, collision detection will mark it as colliding
        console.log(
          `Allowing placement of tray ${trayId} at dot ${clampedDot} - collision will be detected`
        );

        setTrays((prev) =>
          prev.map((t) =>
            t.id === trayId
              ? { ...t, dotPosition: clampedDot, isDragging: false, dragStartDot: undefined, isValidPosition: true }
              : t
          )
        );
        setDraggedTray(null);
        
        // Save invalid position to API as well
        const currentCompanyId = companyIdRef.current;
        const currentConfigId = configurationIdRef.current;
        if (currentCompanyId && currentConfigId) {
          configurationService
            .UpdateTrayPositionInConfigurationAPI(
              currentCompanyId,
              currentConfigId,
              trayId,
              clampedDot
            )
            .then(async () => {
              const config = await configurationService.LoadConfigurationAPI(currentCompanyId, currentConfigId);
              if (config) {
                setSelectedConfiguration(config);
                setTrays(config.trays || []);
                localStorage.setItem('selectedConfiguration', JSON.stringify(config));
              }
            })
            .catch(err => console.error('[DND] API error updating tray position (invalid placement)', err));
        } else {
          console.warn('Missing companyId/configurationId; skipping API update for invalid placement.');
        }
        
        return true;
      }
    },
    [setTrays, setSelectedConfiguration, selectedConfiguration]
  );

  return {
    startTrayDrag,
    updateTrayPosition,
    endTrayDrag,
    getDragFeedback: () => draggedTray,
  };
};
