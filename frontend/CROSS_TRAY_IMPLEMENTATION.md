# Cross-Tray Drag and Drop Implementation

This document explains the comprehensive cross-tray product movement system implemented for the VCT (Vendolution Configuration Tool) frontend.

## Overview

The cross-tray drag and drop functionality allows users to move products between different trays using intuitive drag and drop operations. The implementation is modularized for future extensibility and includes proper validation, visual feedback, and state management.

## Architecture

### Core Services

#### 1. `TrayProductManager` (Enhanced)
- **Location**: `src/services/TrayProductManager.ts`
- **Purpose**: Core business logic for tray and product operations
- **New Methods**:
  - `moveProductBetweenTrays()` - Handles the actual product movement
  - `canMoveProductBetweenTrays()` - Validates if a move is possible
  - **Enhancements**: All methods now properly handle cross-tray operations with advanced spacing

#### 2. `CrossTrayDragDropService` (New)
- **Location**: `src/services/CrossTrayDragDropService.ts`
- **Purpose**: Specialized service for cross-tray drag and drop operations
- **Key Features**:
  - Comprehensive validation logic
  - Drop position calculation
  - Visual feedback coordination
  - Move prediction and statistics

#### 3. `TrayDropHandler` (Enhanced)
- **Location**: `src/services/TrayDropHandler.ts`
- **Purpose**: Handles all drop operations on trays
- **Enhancements**: 
  - Now supports both new product placement and cross-tray moves
  - Accepts both `'PRODUCT'` and `'TRAY_PRODUCT'` drag types
  - Proper delegation to parent components for cross-tray coordination

### Components

#### 1. `DraggableTrayProduct` (Enhanced)
- **Location**: `src/components/configuration/Tray/DraggableTrayProduct.tsx`
- **Purpose**: Individual product component with drag/drop capabilities
- **Enhancements**:
  - Proper `DragItem` structure creation
  - Cross-tray move detection
  - Improved type safety

#### 2. `TrayComponent` (Enhanced)
- **Location**: `src/components/configuration/Tray/TrayComponent.tsx`
- **Purpose**: Complete tray component with product management
- **Enhancements**:
  - Cross-tray move coordination
  - Enhanced drop handler integration
  - Support for managed vs standalone variants

#### 3. `CrossTrayDropFeedback` (New)
- **Location**: `src/components/CrossTrayDropFeedback.tsx`
- **Purpose**: Visual feedback during drag operations
- **Features**:
  - Real-time validation feedback
  - Utilization preview
  - Drop zone indicators
  - Source tray highlighting

### Hooks

#### 1. `useCrossTrayOperations` (New)
- **Location**: `src/hooks/useCrossTrayOperations.ts`
- **Purpose**: Centralized hook for managing cross-tray operations
- **Features**:
  - Coordinated state updates
  - Move validation
  - Target tray discovery
  - Move prediction and analytics

### Types

#### Enhanced `DragItem` Interface
```typescript
export interface DragItem {
    type: 'PRODUCT' | 'TRAY' | 'TRAY_PRODUCT';
    product?: Product;
    tray?: Tray;
    fromTray?: number;
    sourceIndex?: number;
    sourceTrayId?: number;
    // Legacy compatibility
    index?: number;
    trayId?: number;
}
```

#### Enhanced `DropResult` Interface
```typescript
export interface DropResult {
    trayId: number;
    position: { x: number; y: number };
    isValid: boolean;
    targetIndex?: number;
    operation?: 'add-product' | 'cross-tray-move' | 'reorder';
}
```

## Usage Examples

### Basic Implementation (ConfigurationArea)

```tsx
export const ConfigurationArea: React.FC = () => {
    const [trays, setTrays] = useState<Tray[]>([]);
    
    // Initialize cross-tray operations
    const { handleProductMoveBetweenTrays } = useCrossTrayOperations(trays, setTrays);
    
    return (
        <div>
            {trays.map((tray) => (
                <TrayComponent
                    key={tray.id}
                    tray={tray}
                    onUpdate={updateTray}
                    onRemove={() => removeTray(tray.id)}
                    onProductMoveBetweenTrays={handleProductMoveBetweenTrays}
                    variant="managed"
                />
            ))}
        </div>
    );
};
```

### Advanced Usage with Feedback

```tsx
// Custom implementation with enhanced feedback
const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

return (
    <div>
        {trays.map((tray) => (
            <div key={tray.id} className="relative">
                <TrayComponent
                    tray={tray}
                    onUpdate={updateTray}
                    onRemove={() => removeTray(tray.id)}
                    onProductMoveBetweenTrays={handleProductMoveBetweenTrays}
                />
                
                {/* Enhanced feedback */}
                <CrossTrayDropFeedback
                    dragItem={draggedItem}
                    targetTray={tray}
                    isOverTarget={isOver}
                    canDrop={canDrop}
                />
            </div>
        ))}
    </div>
);
```

### Validation and Prediction

```tsx
const { 
    canMoveProductBetweenTrays, 
    getMovePrediction,
    getAvailableTargetTrays 
} = useCrossTrayOperations(trays, setTrays);

// Check if move is valid
const { canMove, reason } = canMoveProductBetweenTrays(sourceTrayId, targetTrayId, sourceIndex);

// Get move prediction
const prediction = getMovePrediction(sourceTrayId, targetTrayId, sourceIndex);
if (prediction) {
    console.log('Utilization change:', prediction.targetStats.utilizationChange);
    console.log('Recommendations:', prediction.recommendations);
}

// Get available targets
const availableTrays = getAvailableTargetTrays(sourceTrayId, sourceIndex);
```

## Key Features

### 1. **Comprehensive Validation**
- Product fit validation
- Tray capacity checks
- Cross-tray move restrictions
- Utilization warnings

### 2. **Advanced Positioning**
- Optimal drop position calculation
- Advanced spacing algorithms
- Automatic repositioning
- Index-based insertion

### 3. **Visual Feedback**
- Real-time drag feedback
- Drop zone highlighting
- Utilization previews
- Error/warning messages

### 4. **State Management**
- Atomic updates across multiple trays
- Proper state synchronization
- Optimistic updates with rollback
- Legacy compatibility

### 5. **Analytics and Prediction**
- Move impact analysis
- Utilization optimization
- Tray balancing recommendations
- Performance metrics

## Future Extensibility

The implementation is designed for future enhancements:

### 1. **Undo/Redo Support**
```typescript
// The move operations return full state changes
const moveResult = TrayProductManager.moveProductBetweenTrays(...);
// This can be easily integrated with undo/redo systems
```

### 2. **Batch Operations**
```typescript
// Multiple products can be moved by extending the DragItem interface
interface BatchDragItem extends DragItem {
    products: PlacedProduct[];
    sourceIndices: number[];
}
```

### 3. **Animation Support**
```typescript
// Animation can be added by enhancing the DropResult
interface AnimatedDropResult extends DropResult {
    animationPath: { x: number; y: number }[];
    duration: number;
}
```

### 4. **Constraint-Based Movement**
```typescript
// Additional constraints can be added via the validation system
interface MoveConstraint {
    validate: (dragItem: DragItem, sourceTray: Tray, targetTray: Tray) => boolean;
    message: string;
}
```

## Performance Considerations

1. **Optimized Re-renders**: Components only re-render when their specific tray changes
2. **Efficient Calculations**: Advanced spacing calculations are cached
3. **Lazy Validation**: Validation only runs during actual drag operations
4. **Memory Management**: Drag operations clean up properly

## Testing Strategy

The modular design makes testing straightforward:

1. **Unit Tests**: Each service can be tested independently
2. **Integration Tests**: Hook and component integration
3. **E2E Tests**: Full drag and drop scenarios
4. **Performance Tests**: Large tray configurations

## Migration Path

For existing code:

1. **Immediate**: Current functionality continues to work unchanged
2. **Gradual**: Enhanced features can be adopted incrementally
3. **Legacy Support**: Old drag item formats are still supported
4. **Documentation**: Clear migration examples provided

This implementation provides a solid foundation for cross-tray operations while maintaining flexibility for future enhancements.
