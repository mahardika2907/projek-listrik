import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: 'admin' | 'customer') => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users
const defaultUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrator'
  },
  {
    id: '2',
    username: 'customer1',
    password: 'customer123',
    role: 'customer',
    name: 'John Doe',
    customerNumber: 'C001'
  },
  {
    id: '3',
    username: 'customer2',
    password: 'customer123',
    role: 'customer',
    name: 'Jane Smith',
    customerNumber: 'C002'
  },
  {
    id: '4',
    username: 'customer3',
    password: 'customer123',
    role: 'customer',
    name: 'Bob Wilson',
    customerNumber: 'C003'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize users in localStorage if not exists
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Check for saved session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string, role: 'admin' | 'customer'): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => 
      u.username === username && 
      u.password === password && 
      u.role === role
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};