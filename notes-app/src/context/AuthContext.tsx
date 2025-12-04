import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { userAPI } from '../services/api';
import socketService from '../services/socket';

interface AuthContextType {
  user: User | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: false,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Restored user from localStorage:', parsedUser);
        setUser(parsedUser);
        
        // Delay socket connection to ensure it happens after component mount
        setTimeout(() => {
          socketService.connect(parsedUser._id);
        }, 500);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username: string) => {
    setLoading(true);
    try {
      console.log('AuthContext: Starting login for:', username);
      const data = await userAPI.login(username);
      console.log('AuthContext: Login response:', data);
      
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Delay socket connection
      setTimeout(() => {
        console.log('AuthContext: Connecting socket for user:', data.user._id);
        socketService.connect(data.user._id);
      }, 500);
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out');
    socketService.disconnect();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
