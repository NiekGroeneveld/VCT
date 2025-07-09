import React from 'react';
import { DragItem } from '../types/configuration.types';
import { Tray } from '../types/tray.types';
import { CrossTrayDragDropService } from '../services/CrossTrayDragDropService';
import { TrayProductManager } from '../services/TrayProductManager';

interface CrossTrayDropFeedbackProps {
  dragItem: DragItem | null;
  targetTray: Tray;
  isOverTarget: boolean;
  canDrop: boolean;
  className?: string;
}

/**
 * Visual feedback component for cross-tray drag and drop operations
 * Shows real-time validation and helpful information during drag operations
 */
export const CrossTrayDropFeedback: React.FC<CrossTrayDropFeedbackProps> = ({
  dragItem,
  targetTray,
  isOverTarget,
  canDrop,
  className = ""
}) => {
  
  if (!isOverTarget || !dragItem) {
    return null;
  }

  const feedback = CrossTrayDragDropService.getDragFeedback(dragItem, targetTray, isOverTarget);
  
  if (!feedback.feedbackMessage) {
    return null;
  }

  // Calculate utilization impact if it's a valid drop
  let utilizationPreview = null;
  if (canDrop && dragItem.product) {
    const currentStats = TrayProductManager.getTrayStats(targetTray);
    const productArea = dragItem.product.width * dragItem.product.height;
    const trayArea = targetTray.width * targetTray.height;
    const utilizationIncrease = (productArea / trayArea) * 100;
    const newUtilization = currentStats.utilization + utilizationIncrease;
    
    utilizationPreview = {
      current: currentStats.utilization,
      new: newUtilization,
      increase: utilizationIncrease
    };
  }

  const getBackgroundColor = () => {
    switch (feedback.feedbackType) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-800';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-800';
    }
  };

  return (
    <div 
      className={`absolute top-2 left-2 right-2 z-50 p-3 rounded-lg border-2 ${getBackgroundColor()} ${className}`}
    >
      <div className="flex items-start space-x-2">
        {/* Status Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {feedback.feedbackType === 'success' && '✓'}
          {feedback.feedbackType === 'warning' && '⚠'}
          {feedback.feedbackType === 'error' && '✗'}
          {feedback.feedbackType === 'info' && 'ℹ'}
        </div>
        
        {/* Main Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{feedback.feedbackMessage}</p>
          
          {/* Product Details */}
          {dragItem.product && (
            <p className="text-xs mt-1 opacity-75">
              {dragItem.product.name} ({dragItem.product.width}×{dragItem.product.height}mm)
            </p>
          )}
          
          {/* Utilization Preview */}
          {utilizationPreview && canDrop && (
            <div className="mt-2 text-xs">
              <div className="flex justify-between items-center">
                <span>Utilization:</span>
                <span className="font-medium">
                  {utilizationPreview.current.toFixed(1)}% → {utilizationPreview.new.toFixed(1)}%
                  <span className={utilizationPreview.increase > 0 ? 'text-green-600' : 'text-red-600'}>
                    {utilizationPreview.increase > 0 ? ' (+' : ' ('}
                    {utilizationPreview.increase.toFixed(1)}%)
                  </span>
                </span>
              </div>
              
              {/* Visual utilization bar */}
              <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    utilizationPreview.new > 90 ? 'bg-red-500' : 
                    utilizationPreview.new > 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(utilizationPreview.new, 100)}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Tray Statistics */}
          {canDrop && (
            <div className="mt-2 text-xs opacity-75">
              <div className="flex justify-between">
                <span>Current products:</span>
                <span>{targetTray.products.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Tray size:</span>
                <span>{targetTray.width}×{targetTray.height}mm</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Drop zone indicator for trays that can accept cross-tray drops
 */
export const CrossTrayDropZone: React.FC<{
  isActive: boolean;
  canDrop: boolean;
  tray: Tray;
}> = ({ isActive, canDrop, tray }) => {
  
  if (!isActive) return null;
  
  const overlayColor = canDrop 
    ? 'bg-green-500 bg-opacity-20 border-green-500' 
    : 'bg-red-500 bg-opacity-20 border-red-500';
    
  return (
    <div 
      className={`absolute inset-0 border-2 border-dashed rounded-lg ${overlayColor} z-40 pointer-events-none`}
    >
      <div className="flex items-center justify-center h-full">
        <div className={`px-3 py-1 rounded-md text-sm font-medium ${
          canDrop ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {canDrop ? 'Drop here' : 'Cannot drop'}
        </div>
      </div>
    </div>
  );
};

/**
 * Visual indicator for the source tray during cross-tray moves
 */
export const CrossTraySourceIndicator: React.FC<{
  isSource: boolean;
  productIndex: number;
}> = ({ isSource, productIndex }) => {
  
  if (!isSource) return null;
  
  return (
    <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg z-30 pointer-events-none">
      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
        Moving product #{productIndex + 1}
      </div>
    </div>
  );
};
