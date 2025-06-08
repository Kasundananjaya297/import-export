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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for saved user data in localStorage
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<any> => {
    try {
      const response = await authService.login(email, password);
      if (response) {
        // Store the user data and token
        const userData = {
          ...response.data,
          token: response.data.jwt,
        };
        setCurrentUser(userData);
        setIsAuthenticated(true);
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
      let response: AxiosResponse;
      response = await authService.register(userData);
      // if (response.status === 200) {
      //   response = await login(userData.email, userData.password);
      // }
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      return error as AxiosResponse;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    register,
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
