/**
 * Checks if user is authenticated by verifying token exists
 * Redirects to login if no token found
 * @returns {string | null} token if exists, null if redirecting
 */
export const requireAuth = (): string | null => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Clear any stale data
    localStorage.removeItem('user');
    localStorage.removeItem('selectedCompany');
    localStorage.removeItem('selectedConfiguration');
    
    // Redirect to login - don't throw error
    window.location.href = '/login';
    return null;
  }
  
  return token;
};

/**
 * Checks if user is authenticated without redirecting
 * @returns {boolean} true if authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};
