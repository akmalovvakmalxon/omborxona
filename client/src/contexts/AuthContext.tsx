import React, { useState, createContext, useContext } from 'react';
import { User, Role } from '../types';
interface AuthContextType {
  user: User | null;
  login: (email: string, role: Role) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: {children: ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const login = (email: string, role: Role) => {
    // Mock login
    setUser({
      id: `user-${Date.now()}`,
      email,
      name:
      email.split('@')[0].charAt(0).toUpperCase() +
      email.split('@')[0].slice(1),
      role
    });
  };
  const logout = () => {
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}>
      
      {children}
    </AuthContext.Provider>);

}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}