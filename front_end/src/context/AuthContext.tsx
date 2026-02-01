/** @format */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../data/users";
import { authService, RegisterData } from "../services/authService";
import { AxiosResponse } from "axios";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<AxiosResponse>;
  switchRole: (newRole: string) => void;
  updateUser: (userData: Partial<User>) => void;
  hasStall: boolean;
  setHasStall: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasStall, setHasStall] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setIsAuthenticated(true);
      setHasStall(!!parsedUser.stall);
    }
  }, []);

  const login = async (email: string, password: string): Promise<any> => {
    try {
      const response = await authService.login(email, password);
      if (response) {
        // Store the user data and token
        const userData = {
          ...response.data.data,
          token: response.data.data.jwt,
          role: response.data.data.role,
        };
        console.log("Login successful, storing user data:", userData);
        setCurrentUser(userData);
        setIsAuthenticated(true);
        setHasStall(!!userData.stall);
        localStorage.setItem("currentUser", JSON.stringify(userData));
        return response;
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  const register = async (userData: RegisterData): Promise<AxiosResponse> => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const switchRole = (newRole: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      if (userData.stall !== undefined) {
        setHasStall(!!userData.stall);
      }
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    register,
    switchRole,
    updateUser,
    hasStall,
    setHasStall,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
