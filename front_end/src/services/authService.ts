/** @format */

import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

export interface RegisterData {
  fname: string;
  lname: string;
  gender: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  contact: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData) {
    try {
      console.log("==========", data);
      const response = await axios.post(`${API_URL}/user/create`, data);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/user/login`, {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  logout() {
    localStorage.removeItem("token");
  },

  getCurrentUser() {
    const token = localStorage.getItem("token");
    if (token) {
      return axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    return null;
  },
};
