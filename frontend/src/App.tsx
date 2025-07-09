
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import  TopBar  from './components/TopBar';
import { ProductList } from './components/configuration/ProductList/ProductList';
import { ConfigurationArea } from './components/configuration/ConfigurationArea';
//import {ConfigurationArea} from './components/configuration/ConfigurationArea/ConfigurationArea';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      
      <div className="min-h-screen bg-gray-50">
        {/* TopBar is fixed, so it doesn't affect the layout flow */}
        <TopBar />
        
        {/* Main content area with top margin to account for fixed TopBar */}
        <main className="pt-32 p-4">
          <div className="flex gap-6 max-w-full mx-auto">
            {/* Left sidebar - ProductList (flexible) */}
            <div className="flex-1 min-w-0">
              <ProductList />
            </div>
            
            {/* Configuration Area - Fixed width to accommodate default tray width + padding */}
            <div className="w-[800px] flex-shrink-0">
                <ConfigurationArea />
            </div>
            
            {/* Right sidebar - Stats/Controls (flexible) */}
            <div className="flex-1 min-w-0 max-w-sm">
              <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
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
                  Configuration area is now optimized for {640}px wide trays with proper padding.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  );
}

export default App;