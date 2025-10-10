import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ScalingProvider, useScaling } from "../../hooks/useScaling";
import TopBar from "../../app/layout/NavBar";
import { ProductList } from "../../domains/product-management/components/ProductList";
import { ConfigurationArea } from "../../domains/machine-configuration/components/ConfigurationArea";
import ConfigurationManagementPanel from "../../shared/components/ConfigurationManagementPanel";
import { useCompany } from "../../Context/useCompany";
import { useConfig } from "../../Context/useConfig";

const MainContent = () => {
  const { scaledValue } = useScaling();
  

  return (
    <main className="pt-32 p-4 h-screen overflow-hidden">
      <div className="flex gap-6 h-full">
        {/* Left sidebar - ProductList (flexible) */}
        <div className="flex-1 min-w-0">
          <ProductList />
        </div>

        {/* Configuration Area - Scaled and centered */}
        <div
          className="flex-shrink-0 flex justify-center"
          style={{ width: `${scaledValue(800)}px` }}
        >
          <ConfigurationArea />
        </div>

        {/* Right sidebar - ConfigurationManagement (flexible) */}
        <div className="flex-1 min-w-0">
          <ConfigurationManagementPanel />
        </div>
      </div>
    </main>
  );
};

const MainPage = () => {
  // Don't remount DndProvider - let it stay stable
  // The refs in MachineConfigurationZone will handle company/config changes
  
  return (
    <DndProvider backend={HTML5Backend}>
      <ScalingProvider>
        <div className="min-h-screen bg-gray-50">
          {/* TopBar is fixed, so it doesn't affect the layout flow */}
          <TopBar />

          {/* Main content with dynamic scaling */}
          <MainContent />
        </div>
      </ScalingProvider>
    </DndProvider>
  );
};

export default MainPage;
