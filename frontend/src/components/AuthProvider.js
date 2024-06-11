import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';

// Create context for managing authentication state
const AuthContext = createContext();

// Custom hook to access authentication context
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Example: { id: 1, username: 'user', token: 'abc123' }

  const login = (userData) => {
    // Example login logic to set user data
    setUser(userData.data.user.role);
    // console.log(userData.data.user.role);
    setToken(userData.token);
    console.log(userData.token);
    // Example: Save token to local storage or cookie
    Cookies.set('jwt', userData.token);
    Cookies.set('user', userData.data.user.role);
  };
  const logout = () => {
    // Example logout logic to clear user data
    setUser(null);
    // Example: Clear token from local storage or cookie
    Cookies.remove('user');
    Cookies.remove('jwt');
  };

  const isAuthenticated = () => !!user; // Check if user is authenticated

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
