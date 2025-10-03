import { useCallback, useState } from "react";
import { Tray } from "../types/tray.types";
import { TrayPositionService } from "../../machine-configuration/services/TrayPositionService";
import {
  getYPositionDot,
  ConfigurationConstants,
} from "../../machine-configuration/types/configuration.types";
import { configurationService } from "../../machine-configuration/services/ConfigurationService";
import { useCompany } from "../../../Context/useCompany";
import { useConfig } from "../../../Context/useConfig";
import { TrayProductManager } from "../services/TrayProductManager";
import { config } from "process";

export const useTrayDragDrop = (
  trays: Tray[],
  setTrays: (trays: Tray[] | ((prev: Tray[]) => Tray[])) => void
) => {
  const [draggedTray, setDraggedTray] = useState<Tray | null>(null);
  const company = useCompany().selectedCompany;
  const companyId = company ? Number(company.id) : null;
  const { selectedConfiguration, setSelectedConfiguration } = useConfig();
  const configurationId = selectedConfiguration ? Number(selectedConfiguration.id) : null;

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
        // Convert screen Y to dot position using the same logic as getDotYPosition
        // Since dot 1 is at Y=0, dot 2 at Y=135, etc., we can directly convert
        const newDot = getYPositionDot(newYposition);
        const clampedDot = Math.max(1, Math.min(newDot, ConfigurationConstants.DOTS));
        //console.log(`Dragging tray ${trayId} to Y=${newYposition} (dot ${newDot}, clamped to ${clampedDot})`);


    setTrays(prev => prev.map(tray => {
      if (tray.id !== trayId) return tray;

      // Check if this position is valid (for visual feedback)
      const otherTrays = prev.filter(t => t.id !== trayId);
      const validation = TrayPositionService.canPlaceTrayAtDot(tray, clampedDot, otherTrays);

      if (tray.dotPosition === clampedDot && tray.isValidPosition === validation.canPlace) {
        return tray;
      }

      return {
        ...tray,
        dotPosition: clampedDot,
        // Add a flag to indicate if current position is valid (for visual feedback)
        isValidPosition: validation.canPlace
      };
    }));
    }, [setTrays]);
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
      // If drag ended without a valid drop target, just reset flags and skip API
      if (Number.isNaN(_finalYPosition)) {
        setTrays(prev => prev.map(t => t.id === trayId ? { ...t, isDragging: false, dragStartDot: undefined } : t));
        setDraggedTray(null);
        return false;
      }
      // Use the tray's current dotPosition from state (kept updated by hover)
      const tray = trays.find((t) => t.id === trayId);

      if (!tray) {
        console.warn(`Tray with ID ${trayId} not found`);
        return false;
      }

      const clampedDot = Math.max(1, Math.min(tray.dotPosition, ConfigurationConstants.DOTS));
      const originalDot = tray.dragStartDot || tray.dotPosition;
      const otherTrays = trays.filter((t) => t.id !== trayId);
      const validation = TrayPositionService.canPlaceTrayAtDot(tray, clampedDot, otherTrays);

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
        if (companyId && configurationId) {
          configurationService
            .UpdateTrayPositionInConfigurationAPI(
              companyId,
              configurationId,
              trayId,
              clampedDot
            )
            .then(async () => {
              const config = await configurationService.LoadConfigurationAPI(companyId, configurationId);
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
        // Invalid position - allow placement but collision detection will mark it as colliding
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
        return true;
      }
    },
    [setTrays, trays, companyId, configurationId, setSelectedConfiguration]
  );

  return {
    startTrayDrag,
    updateTrayPosition,
    endTrayDrag,
    getDragFeedback: () => draggedTray,
  };
};
