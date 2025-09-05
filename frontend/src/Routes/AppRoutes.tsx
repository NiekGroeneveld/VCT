import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../Context/useAuth';
import LoginPage from '../pages/LoginPage';
import MainPage from '../pages/MainPage';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  
  return isLoggedIn() ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route component (redirects to main if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  
  return !isLoggedIn() ? <>{children}</> : <Navigate to="/main" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/main" 
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Default redirect */}
      <Route 
        path="/" 
        element={<Navigate to="/main" replace />} 
      />
      
      {/* Catch all other routes */}
      <Route 
        path="*" 
        element={<Navigate to="/main" replace />} 
      />
    </Routes>
  );
};

export default AppRoutes;
