import React, { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ScalingProvider, useScaling } from '../../hooks/useScaling';
import TopBar from '../../app/layout/NavBar';
import { ProductList } from '../../domains/product-management/components/ProductList';
import { ConfigurationArea } from '../../domains/machine-configuration/components/ConfigurationArea';
import { openA4PrintWindowForMachineConfiguration } from '../../shared/services/PdfExportService';
import { useCompany } from '../../Context/useCompany';
import { useConfig } from '../../Context/useConfig';

const MainContent = () => {
  const { scaledValue } = useScaling();
  const { selectedCompany } = useCompany();
  const { selectedConfiguration } = useConfig();

  const handlePrintToPdf = useCallback(async () => {
    const el = document.getElementById('machine-configuration-zone');
    if (!el) {
      console.error('MachineConfigurationZone element not found');
      return;
    }
    await openA4PrintWindowForMachineConfiguration({
      element: el,
      companyName: selectedCompany?.name,
      configurationName: selectedConfiguration?.name,
      configurationTypeDataName: (selectedConfiguration as any)?.configurationType || (selectedConfiguration as any)?.configurationTypeDataName,
      orientation: 'portrait'
    });
  }, [selectedCompany?.name, selectedConfiguration?.name, selectedConfiguration]);
  
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
        
        {/* Right sidebar - TrayManagement (flexible) */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg border-2 border-gray-300 p-4 h-full">
            <h3 className="font-semibold text-gray-800 mb-3">Tray Management</h3>
            <div className="text-gray-500 text-sm mb-4">
              Manage your trays and view configuration details here.
            </div>
            
            {/* ButtonSpace */}
            <div className="space-y-2 mb-4">
              <button
                onClick={handlePrintToPdf}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded shadow"
                title="Export Configuration to PDF"
              >
                Print to PDF
              </button>
            </div>
            
            <div className="text-xs text-gray-400">
              Configuration area dynamically scales to fit screen.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const MainPage = () => {
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
