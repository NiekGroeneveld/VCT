import { useCallback } from 'react';
import { Tray } from '../../tray-management/types/tray.types';
import { PlacedProduct } from '../../product-management/types/product.types';
import { TrayProductManager } from '../services/TrayProductManager';
import { CrossTrayDragDropService } from '../services/CrossTrayDragDropService';
import { configurationService } from '@/domains/machine-configuration/services/ConfigurationService';

/**
 * Hook for managing cross-tray drag and drop operations
 * Provides coordinated tray updates and validation
 */
export const useCrossTrayOperations = (
  trays: Tray[],
  setTrays: (trays: Tray[] | ((prev: Tray[]) => Tray[])) => void
) => {

  /**
   * Executes a cross-tray product move
   */
  const moveProductBetweenTrays = useCallback((
    sourceTrayId: number,
    targetTrayId: number,
    sourceIndex: number,
    targetIndex?: number
  ): boolean => {
    
    const sourceTray = trays.find(t => t.id === sourceTrayId);
    const targetTray = trays.find(t => t.id === targetTrayId);

    if (!sourceTray || !targetTray) {
      console.error('Source or target tray not found');
      return false;
    }

    if (sourceIndex < 0 || sourceIndex >= sourceTray.products.length) {
      console.error('Invalid source index');
      return false;
    }

    const productToMove = sourceTray.products[sourceIndex];
    
    // Create drag item for validation
    const dragItem = CrossTrayDragDropService.createTrayProductDragItem(
      productToMove,
      sourceIndex,
      sourceTrayId
    );

    // Validate the move
    const validation = CrossTrayDragDropService.validateCrossTrayMove(
      dragItem,
      sourceTray,
      targetTray,
      targetIndex
    );

    if (!validation.isValid) {
      console.error('Cross-tray move validation failed:', validation.errors);
      return false;
    }

    // Execute the move
    const result = TrayProductManager.moveProductBetweenTrays(
      sourceTray,
      targetTray,
      sourceIndex,
      targetIndex
    );

    if (result) {
      // Update both trays atomically
      setTrays(prev => prev.map(tray => {
        if (tray.id === sourceTrayId) {
          return result.sourceTray;
        } else if (tray.id === targetTrayId) {
          return result.targetTray;
        }
        return tray;
      }));

      console.log(`Successfully moved ${productToMove.name} from tray ${sourceTrayId} to tray ${targetTrayId}`);

      return true;
    }

    return false;
  }, [trays, setTrays]);

  /**
   * Handler for product movement between trays (compatible with existing interface)
   */
  const handleProductMoveBetweenTrays = useCallback((
    product: PlacedProduct,
    fromIndex: number,
    fromTrayId: number,
    toTrayId: number
  ) => {
    return moveProductBetweenTrays(fromTrayId, toTrayId, fromIndex);
  }, [moveProductBetweenTrays]);

  /**
   * Validates if a cross-tray move is possible
   */
  const canMoveProductBetweenTrays = useCallback((
    sourceTrayId: number,
    targetTrayId: number,
    sourceIndex: number
  ): { canMove: boolean; reason?: string } => {
    
    const sourceTray = trays.find(t => t.id === sourceTrayId);
    const targetTray = trays.find(t => t.id === targetTrayId);

    if (!sourceTray || !targetTray) {
      return { canMove: false, reason: 'Source or target tray not found' };
    }

    return TrayProductManager.canMoveProductBetweenTrays(sourceTray, targetTray, sourceIndex);
  }, [trays]);

  /**
   * Gets all available target trays for a product
   */
  const getAvailableTargetTrays = useCallback((
    sourceTrayId: number,
    sourceIndex: number
  ): Tray[] => {
    
    const sourceTray = trays.find(t => t.id === sourceTrayId);
    if (!sourceTray || sourceIndex >= sourceTray.products.length) {
      return [];
    }

    const productToMove = sourceTray.products[sourceIndex];
    
    return trays.filter(tray => {
      if (tray.id === sourceTrayId) return false; // Can't move to same tray
      return TrayProductManager.canPlaceProduct(tray, productToMove);
    });
  }, [trays]);

  /**
   * Gets comprehensive statistics about a potential cross-tray move
   */
  const getMovePrediction = useCallback((
    sourceTrayId: number,
    targetTrayId: number,
    sourceIndex: number
  ) => {
    
    const sourceTray = trays.find(t => t.id === sourceTrayId);
    const targetTray = trays.find(t => t.id === targetTrayId);

    if (!sourceTray || !targetTray || sourceIndex >= sourceTray.products.length) {
      return null;
    }

    const productToMove = sourceTray.products[sourceIndex];
    
    // Calculate hypothetical results
    const moveResult = TrayProductManager.moveProductBetweenTrays(
      sourceTray,
      targetTray,
      sourceIndex
    );

    if (!moveResult) return null;

    const sourceStatsBefore = TrayProductManager.getTrayStats(sourceTray);
    const targetStatsBefore = TrayProductManager.getTrayStats(targetTray);
    const sourceStatsAfter = TrayProductManager.getTrayStats(moveResult.sourceTray);
    const targetStatsAfter = TrayProductManager.getTrayStats(moveResult.targetTray);

    return {
      productToMove,
      sourceStats: {
        before: sourceStatsBefore,
        after: sourceStatsAfter,
        utilizationChange: sourceStatsAfter.utilization - sourceStatsBefore.utilization
      },
      targetStats: {
        before: targetStatsBefore,
        after: targetStatsAfter,
        utilizationChange: targetStatsAfter.utilization - targetStatsBefore.utilization
      },
      recommendations: {
        improvesSourseUtilization: sourceStatsAfter.utilization > sourceStatsBefore.utilization,
        improvesTargetUtilization: targetStatsAfter.utilization < 90, // Not over-utilizing
        balancesTrays: Math.abs(sourceStatsAfter.utilization - targetStatsAfter.utilization) < 
                      Math.abs(sourceStatsBefore.utilization - targetStatsBefore.utilization)
      }
    };
  }, [trays]);

  return {
    moveProductBetweenTrays,
    handleProductMoveBetweenTrays,
    canMoveProductBetweenTrays,
    getAvailableTargetTrays,
    getMovePrediction
  };
};
