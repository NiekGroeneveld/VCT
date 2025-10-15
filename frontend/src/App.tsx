
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './Context/useAuth';
import AppRoutes from './Routes';
import { CompanyProvider } from './Context/useCompany';
import { ConfigurationProvider } from './Context/useConfig';
import { setupAxiosInterceptors } from './shared/utils/axiosConfig';

function App() {
  // Setup axios interceptors once when app loads
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <BrowserRouter>
      <UserProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Routes handle all page navigation */}
          
          <CompanyProvider>
          <ConfigurationProvider>
          <AppRoutes />
          </ConfigurationProvider>
          </CompanyProvider>
          
          {/* Toast Container for notifications */}
          <ToastContainer
            position="top-right"
            autoClose={10000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;