
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
            {/* Left sidebar - ProductList */}
            <div className="w-[30%] flex-shrink-0">
              <ProductList />
            </div>
            
            <div className = "flex-1">
                <ConfigurationArea />
            </div>
            
            {/* Right sidebar - Stats/Controls (placeholder for now) */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Configuration Info</h3>
                <div className="text-gray-500 text-sm">
                  Stats and controls will go here
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