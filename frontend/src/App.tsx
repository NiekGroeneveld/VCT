
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ScalingProvider, useScaling } from './hooks/useScaling';
import  TopBar  from './app/layout/TopBar';
import { ProductList } from './domains/product-management/components/ProductList';
import { ConfigurationArea } from './domains/machine-configuration/components/ConfigurationArea';
import { UserProvider } from './Context/useAuth';

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
        
        {/* Right sidebar - TrayManagement (flexible) */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg border-2 border-gray-300 p-4 h-full">
            <h3 className="font-semibold text-gray-800 mb-3">Tray Management</h3>
            <div className="text-gray-500 text-sm mb-4">
              Manage your trays and view configuration details here.
            </div>
            
            {/* Placeholder for tray management - this will be enhanced later */}
            <div className="space-y-2 mb-4">
              <div className="text-sm p-2 bg-gray-50 rounded">
                <div className="font-medium">No trays configured</div>
                <div className="text-gray-500 text-xs">
                  Add trays to see them here
                </div>
              </div>
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

function App() {
  return (
    <UserProvider>
    <DndProvider backend={HTML5Backend}>
      <ScalingProvider>
        <div className="min-h-screen bg-gray-50">
          {/* TopBar is fixed, so it doesn't affect the layout flow */}
          <TopBar />
          
          {/* Main content with dynamic scaling */}
          <MainContent />
          
          {/* Toast Container for notifications */}
          <ToastContainer />
        </div>
      </ScalingProvider>
    </DndProvider>
    </UserProvider>
  );
}

export default App;