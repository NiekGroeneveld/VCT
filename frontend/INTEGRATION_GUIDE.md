# Cross-Tray Drag and Drop Integration Guide

## Quick Start

The cross-tray drag and drop functionality has been successfully implemented and is ready for use. Here's how to integrate it into your existing application:

## Files Created/Modified

### New Files
- `src/services/CrossTrayDragDropService.ts` - Core cross-tray logic
- `src/hooks/useCrossTrayOperations.ts` - React hook for state management
- `src/components/CrossTrayDropFeedback.tsx` - Visual feedback components
- `src/examples/CrossTrayExample.tsx` - Working example implementation

### Enhanced Files
- `src/services/TrayProductManager.ts` - Added cross-tray methods
- `src/services/TrayDropHandler.ts` - Enhanced to support cross-tray drops
- `src/components/configuration/Tray/DraggableTrayProduct.tsx` - Improved drag item structure
- `src/components/configuration/Tray/TrayComponent.tsx` - Cross-tray coordination
- `src/components/configuration/ConfigurationArea.tsx` - Integration example
- `src/types/configuration.types.ts` - Enhanced interfaces

## Integration Steps

### 1. Update Your Main Component (e.g., ConfigurationArea)

```tsx
import { useCrossTrayOperations } from '../hooks/useCrossTrayOperations';

export const YourMainComponent: React.FC = () => {
    const [trays, setTrays] = useState<Tray[]>([]);
    
    // Add this hook
    const { handleProductMoveBetweenTrays } = useCrossTrayOperations(trays, setTrays);
    
    return (
        <div>
            {trays.map((tray) => (
                <TrayComponent
                    key={tray.id}
                    tray={tray}
                    onUpdate={updateTray}
                    onRemove={() => removeTray(tray.id)}
                    onProductMoveBetweenTrays={handleProductMoveBetweenTrays} // Add this line
                    variant="managed" // Add this line
                />
            ))}
        </div>
    );
};
```

### 2. Ensure DndProvider is Set Up

Make sure your app is wrapped with the DndProvider:

```tsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <YourMainComponent />
        </DndProvider>
    );
}
```

### 3. Optional: Add Visual Feedback

For enhanced user experience, add the feedback components:

```tsx
import { CrossTrayDropFeedback, CrossTrayDropZone } from '../components/CrossTrayDropFeedback';

// In your tray rendering
<div className="relative">
    <TrayComponent ... />
    <CrossTrayDropFeedback
        dragItem={currentDragItem}
        targetTray={tray}
        isOverTarget={isOver}
        canDrop={canDrop}
    />
</div>
```

## Testing the Implementation

### Using the Example Component

1. Navigate to your examples directory
2. The `CrossTrayExample.tsx` component demonstrates all features
3. Import and use it to test the functionality:

```tsx
import CrossTrayExample from './examples/CrossTrayExample';

// In your routing or component
<CrossTrayExample />
```

### Manual Testing Checklist

- [ ] Drag products between trays
- [ ] Verify products are repositioned with optimal spacing
- [ ] Check that tray heights adjust automatically
- [ ] Test validation (try moving products that don't fit)
- [ ] Verify products can't be moved to the same tray
- [ ] Test with empty trays
- [ ] Test with multiple products in trays

## Key Features Working

✅ **Cross-Tray Movement**: Products can be dragged between different trays
✅ **Automatic Positioning**: Products are automatically repositioned with optimal spacing
✅ **Height Adjustment**: Tray heights adjust based on the tallest product
✅ **Validation**: Invalid moves are prevented with user feedback
✅ **Visual Feedback**: Real-time feedback during drag operations
✅ **State Management**: Coordinated updates across multiple trays
✅ **Backward Compatibility**: Existing functionality remains unchanged

## Advanced Usage

### Move Prediction and Analytics

```tsx
const { getMovePrediction, getAvailableTargetTrays } = useCrossTrayOperations(trays, setTrays);

// Get detailed move analysis
const prediction = getMovePrediction(sourceTrayId, targetTrayId, sourceIndex);
if (prediction) {
    console.log('Utilization impact:', prediction.targetStats.utilizationChange);
    console.log('Recommendations:', prediction.recommendations);
}

// Find all valid target trays
const availableTrays = getAvailableTargetTrays(sourceTrayId, sourceIndex);
```

### Custom Validation

```tsx
import { CrossTrayDragDropService } from '../services/CrossTrayDragDropService';

// Custom validation logic
const customValidation = CrossTrayDragDropService.validateCrossTrayMove(
    dragItem, 
    sourceTray, 
    targetTray
);

if (!customValidation.isValid) {
    console.log('Validation errors:', customValidation.errors);
}
```

## Troubleshooting

### Common Issues

1. **Products not moving**: Ensure `onProductMoveBetweenTrays` prop is passed to `TrayComponent`
2. **No visual feedback**: Check that `DndProvider` wraps your components
3. **TypeScript errors**: Ensure all new interfaces are imported properly
4. **State not updating**: Verify the hook is used correctly with proper state setters

### Debug Mode

Enable debug logging by setting:
```tsx
// In development, detailed logs are available
if (process.env.NODE_ENV === 'development') {
    console.log('Cross-tray operations enabled');
}
```

## Performance Notes

- The implementation is optimized for minimal re-renders
- Advanced spacing calculations are efficient for typical tray sizes
- Validation only runs during active drag operations
- State updates are batched for better performance

## Future Enhancements

The modular design supports future additions like:
- Undo/redo functionality
- Batch product movement
- Animation during moves
- Constraint-based movement rules
- Advanced tray optimization algorithms

## Support

- Review the comprehensive documentation in `CROSS_TRAY_IMPLEMENTATION.md`
- Check the working example in `src/examples/CrossTrayExample.tsx`
- All services include detailed JSDoc comments
- TypeScript interfaces provide full type safety

The implementation is production-ready and fully integrated with your existing codebase while maintaining backward compatibility.
