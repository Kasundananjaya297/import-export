/** @format */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  USER: {
    CREATE: "/api/user/create",
    LOGIN: "/api/user/login",
    GET_CURRENT: "/api/user/me",
  },
  PRODUCT: {
    CREATE: "/api/products/create",
    GET_ALL: "/api/products/all",
    GET_BY_ID: (id: string) => `/api/products/${id}`,
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
    GET_SELLER_PRODUCTS: (sellerId: string) =>
      `/api/products/seller/${sellerId}`,
  },
  ORDER: {
    CREATE: "/api/order/create",
    GET_ALL: "/api/order/all",
    GET_BY_ID: (id: number) => `/api/order/${id}`,
    GET_BUYER_ORDERS: "/api/order/buyer/orders",
    GET_SELLER_ORDERS: "/api/order/seller/orders",
    UPDATE_STATUS: (id: number) => `/api/order/${id}/status`,
    UPDATE_PAYMENT: (id: number) => `/api/order/${id}/payment`,
    DELETE: (id: number) => `/api/order/${id}`,
    CANCEL: (id: number) => `/api/order/${id}/cancel`,
    SEARCH: "/api/order/search",
    STATS: "/api/order/stats",
  },
  PAYMENT: {
    CREATE: "/api/payment/create",
    PROCESS: (id: number) => `/api/payment/${id}/process`,
    GET_ALL: "/api/payment/all",
    GET_BY_ID: (id: number) => `/api/payment/${id}`,
    GET_BY_ORDER_ID: (orderId: number) => `/api/payment/order/${orderId}`,
    UPDATE_STATUS: (id: number) => `/api/payment/${id}/status`,
    REFUND: (id: number) => `/api/payment/${id}/refund`,
  },
};
