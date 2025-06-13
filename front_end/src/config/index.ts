/** @format */

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001";

export const API_ENDPOINTS = {
  USER: {
    CREATE: "/user/create",
    LOGIN: "/user/login",
    GET_CURRENT: "/user/me",
  },
};
