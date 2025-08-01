/** @format */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export const API_ENDPOINTS = {
  USER: {
    CREATE: "/user/create",
    LOGIN: "/user/login",
    GET_CURRENT: "/user/me",
  },
  PRODUCT: {
    CREATE: "/product/create",
    GET_ALL: "/product/all",
    GET_BY_ID: (id: string) => `/product/${id}`,
    UPDATE: (id: string) => `/product/${id}`,
    DELETE: (id: string) => `/product/${id}`,
    GET_SELLER_PRODUCTS: (sellerId: string) => `/product/seller/${sellerId}`,
  },
  ORDER: {
    CREATE: "/order/create",
    GET_ALL: "/order/all",
    GET_BY_ID: (id: number) => `/order/${id}`,
    GET_BUYER_ORDERS: "/order/buyer/orders",
    GET_SELLER_ORDERS: "/order/seller/orders",
    UPDATE_STATUS: (id: number) => `/order/${id}/status`,
    UPDATE_PAYMENT: (id: number) => `/order/${id}/payment`,
    DELETE: (id: number) => `/order/${id}`,
  },
};
