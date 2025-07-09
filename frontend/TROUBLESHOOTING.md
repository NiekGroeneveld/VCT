# Cross-Tray Drag and Drop Troubleshooting Guide

## Integration Checklist

Follow these steps to ensure cross-tray functionality is working:

### ✅ Step 1: Verify ConfigurationArea Setup

Check that your `ConfigurationArea.tsx` has these key elements:

```tsx
// 1. Import the hook
import { useCrossTrayOperations } from '../../hooks/useCrossTrayOperations';

// 2. Initialize the hook
const { handleProductMoveBetweenTrays, moveProductBetweenTrays } = useCrossTrayOperations(trays, setTrays);

// 3. Add event listener for cross-tray moves
useEffect(() => {
    const handleCrossTrayRequest = (event: any) => {
        const { sourceTrayId, targetTrayId, sourceIndex, targetIndex } = event.detail;
        moveProductBetweenTrays(sourceTrayId, targetTrayId, sourceIndex, targetIndex);
    };
    
    window.addEventListener('requestCrossTrayMove', handleCrossTrayRequest);
    return () => window.removeEventListener('requestCrossTrayMove', handleCrossTrayRequest);
}, [moveProductBetweenTrays]);

// 4. Pass the handler to TrayComponent
<TrayComponent
    key={tray.id}
    tray={tray}
    onUpdate={updateTray}
    onRemove={() => removeTray(tray.id)}
    onProductMoveBetweenTrays={handleProductMoveBetweenTrays}
    variant="managed"
/>
```

### ✅ Step 2: Verify DndProvider Setup

Ensure your app is wrapped with the DndProvider:

```tsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <ConfigurationArea />
        </DndProvider>
    );
}
```

### ✅ Step 3: Test Basic Functionality

1. **Create two trays** with products in them
2. **Open browser console** to see debug messages
3. **Drag a product** from one tray and hover over another tray
4. **Look for console messages**:
   - "Cross-tray move detected: [product name] from tray [id] to tray [id]"
   - "Processing cross-tray move request: ..."
   - "Cross-tray move completed successfully"

### ✅ Step 4: Verify Visual Feedback

When dragging a product over a different tray:
- The target tray should highlight (green border for valid drops)
- Products that don't fit should show red highlighting
- Console should show validation messages

## Common Issues & Solutions

### Issue 1: "No cross-tray movement happening"

**Symptoms**: Products don't move when dragged between trays

**Check**:
```tsx
// Ensure TrayComponent has the onProductMoveBetweenTrays prop
<TrayComponent
    onProductMoveBetweenTrays={handleProductMoveBetweenTrays} // ← This line is required
    variant="managed" // ← This tells the component it's managed by a parent
/>
```

### Issue 2: "Products disappear when dragged"

**Symptoms**: Products vanish during cross-tray moves

**Solution**: Check console for error messages. Usually means:
- Event listener not properly attached
- Hook not initialized correctly
- State update failing

### Issue 3: "TypeScript errors"

**Check these imports**:
```tsx
import { useCrossTrayOperations } from '../../hooks/useCrossTrayOperations';
import { PlacedProduct } from '../../types/product.types';
```

### Issue 4: "Drag and drop not working at all"

**Verify DndProvider**:
```tsx
// This should wrap your entire app or at least the configuration area
<DndProvider backend={HTML5Backend}>
    <YourComponents />
</DndProvider>
```

## Debug Console Commands

Open browser console and run these to check state:

```javascript
// Check if event listeners are attached
console.log('Event listeners:', window.getEventListeners?.(window));

// Manually trigger a cross-tray move (for testing)
window.dispatchEvent(new CustomEvent('requestCrossTrayMove', {
    detail: { sourceTrayId: 1, targetTrayId: 2, sourceIndex: 0 }
}));
```

## Quick Test Implementation

If you want to test quickly, you can add this temporary button to your ConfigurationArea:

```tsx
// Add this inside your ConfigurationArea component for testing
const testCrossTrayMove = () => {
    if (trays.length >= 2 && trays[0].products.length > 0) {
        console.log('Testing cross-tray move...');
        moveProductBetweenTrays(trays[0].id, trays[1].id, 0);
    } else {
        console.log('Need at least 2 trays with products to test');
    }
};

// Add this button somewhere in your render
<button onClick={testCrossTrayMove} className="bg-red-500 text-white px-4 py-2 rounded">
    Test Cross-Tray Move
</button>
```

## Expected Console Output

When everything is working correctly, you should see:

```
Cross-tray move detected: Product A from tray 1 to tray 2
Processing cross-tray move request: {sourceTrayId: 1, targetTrayId: 2, sourceIndex: 0}
Successfully moved Product A from tray 1 to tray 2
Cross-tray move completed successfully
```

## Still Not Working?

If you've verified all the above and it's still not working:

1. **Check the browser console** for any error messages
2. **Verify that products exist** in the source tray
3. **Check that the target tray can accept** the product (size constraints)
4. **Try the example component** at `src/examples/CrossTrayExample.tsx`

The implementation is designed to be robust and should work with minimal integration steps. Most issues are related to missing props or incorrect hook usage.
