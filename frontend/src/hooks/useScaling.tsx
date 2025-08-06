import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ScalingContextType {
  scale: number;
  scaledValue: (value: number) => number;
  recalculateScale: () => void;
}

const ScalingContext = createContext<ScalingContextType | undefined>(undefined);

interface ScalingProviderProps {
  children: React.ReactNode;
}

export const ScalingProvider: React.FC<ScalingProviderProps> = ({ children }) => {
  const [scale, setScale] = useState(1);

  const calculateOptimalScale = useCallback(() => {
    // Get viewport dimensions
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Account for fixed elements
    const topBarHeight = 128; // TopBar height (pt-32 = 128px)
    const mainPadding = 32; // Main padding (p-4 = 16px * 2)
    const gap = 24; // Gap between components (gap-6 = 24px)
    const headerHeight = 80; // ConfigurationArea header height
    
    // Calculate available space
    const availableHeight = viewportHeight - topBarHeight - mainPadding - headerHeight;
    const availableWidth = viewportWidth - mainPadding;
    
    // Configuration area natural dimensions (from ConfigurationConstants)
    const configNaturalHeight = 972 + 272; // DOT_DELTA * DOTS + TOP_SPACE = 13.5*72+272 = 1244mm
    const configNaturalWidth = 800; // Current fixed width
    
    // Sidebar minimum widths
    const sidebarMinWidth = 250;
    const totalSidebarWidth = sidebarMinWidth * 2;
    const totalGaps = gap * 2;
    
    // Calculate available space for configuration area
    const availableConfigWidth = availableWidth - totalSidebarWidth - totalGaps;
    
    // Calculate scale factors
    const heightScale = availableHeight / configNaturalHeight;
    const widthScale = availableConfigWidth / configNaturalWidth;
    
    // Use the more restrictive scale factor
    const optimalScale = Math.min(heightScale, widthScale, 1.0); // Cap at 100%
    
    // Ensure minimum scale for usability
    const finalScale = Math.max(0.3, optimalScale); // Minimum 30%
    
    console.log('Scale calculation:', {
      viewportHeight,
      viewportWidth,
      availableHeight,
      availableConfigWidth,
      configNaturalHeight,
      heightScale: heightScale.toFixed(3),
      widthScale: widthScale.toFixed(3),
      finalScale: finalScale.toFixed(3)
    });
    
    return finalScale;
  }, []);

  const recalculateScale = useCallback(() => {
    const newScale = calculateOptimalScale();
    setScale(newScale);
  }, [calculateOptimalScale]);

  useEffect(() => {
    // Initial calculation
    recalculateScale();

    // Recalculate on window resize
    const handleResize = () => {
      recalculateScale();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [recalculateScale]);

  const scaledValue = useCallback((value: number) => {
    return Math.round(value * scale);
  }, [scale]);

  const value: ScalingContextType = {
    scale,
    scaledValue,
    recalculateScale
  };

  return (
    <ScalingContext.Provider value={value}>
      {children}
    </ScalingContext.Provider>
  );
};

export const useScaling = () => {
  const context = useContext(ScalingContext);
  if (context === undefined) {
    throw new Error('useScaling must be used within a ScalingProvider');
  }
  return context;
};
