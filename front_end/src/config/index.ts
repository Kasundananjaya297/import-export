/** @format */

// API Configuration
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api";

console.log("Frontend Config Loaded:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL,
});

export const API_ENDPOINTS = {
  STALL: {
    CREATE: "/stall/create",
    GET_BY_USER: "/stall/me",
    UPDATE: "/stall/update",
    GET_PUBLIC: (id: string) => `/stall/public/${id}`,
    GET_ALL: "/stall/all",
  },
  USER: {
    CREATE: "/user/create",
    LOGIN: "/user/login",
    GET_CURRENT: "/user/me",
    UPDATE_PROFILE: "/user/update",
    GET_ALL: "/user/all",
    GET_PENDING: "/user/pending",
    APPROVE: (id: number) => `/user/${id}/approve`,
    REJECT: (id: number) => `/user/${id}/reject`,
  },
  PRODUCT: {
    CREATE: "/products/create",
    GET_ALL: "/products/all",
    GET_BY_ID: (id: string) => `/products/${id}`,
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    GET_SELLER_PRODUCTS: (sellerId: string) =>
      `/products/seller/${sellerId}`,
    GET_PUBLIC_BY_STALL: (stallId: string) =>
      `/products/public/stall/${stallId}`,
    GET_BY_USER_ID: "/products/me",
    GET_PENDING_ADMIN: "/products/admin/pending",
    APPROVE: (id: number) => `/products/${id}/approve`,
    REJECT: (id: number) => `/products/${id}/reject`,
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
    CANCEL: (id: number) => `/order/${id}/cancel`,
    SEARCH: "/order/search",
    STATS: "/order/stats",
  },
  PAYMENT: {
    CREATE: "/payment/create",
    PROCESS: (id: number) => `/payment/${id}/process`,
    GET_ALL: "/payment/all",
    GET_BY_ID: (id: number) => `/payment/${id}`,
    GET_BY_ORDER_ID: (orderId: number) => `/payment/order/${orderId}`,
    UPDATE_STATUS: (id: number) => `/payment/${id}/status`,
    REFUND: (id: number) => `/payment/${id}/refund`,
  },
  COMPLAINT: {
    CREATE: "/complaint/create",
    GET_ALL: "/complaint/all",
    GET_BY_ID: (id: number) => `/complaint/${id}`,
    GET_BUYER_COMPLAINTS: "/complaint/buyer/complaints",
    GET_SELLER_COMPLAINTS: "/complaint/seller/complaints",
    UPDATE_STATUS: (id: number) => `/complaint/${id}/status`,
    DELETE: (id: number) => `/complaint/${id}`,
  },
  TRANSACTION: {
    GET_ALL: "/transactions",
    GET_BY_ID: (id: string) => `/transactions/${id}`,
    GET_USER_TRANSACTIONS: (userId: string) => `/transactions/user/${userId}`,
  },
  FISH_METADATA: {
    SPECIES: {
      GET_ALL: "/fish-metadata/species",
      CREATE: "/fish-metadata/species",
      UPDATE: (id: number) => `/fish-metadata/species/${id}`,
      DELETE: (id: number) => `/fish-metadata/species/${id}`,
    },
    VARIETY: {
      GET_ALL: "/fish-metadata/varieties",
      CREATE: "/fish-metadata/varieties",
      UPDATE: (id: number) => `/fish-metadata/varieties/${id}`,
      DELETE: (id: number) => `/fish-metadata/varieties/${id}`,
    },
  },
  REVIEWS: {
    CREATE: "/reviews",
    UPDATE: (id: number) => `/reviews/${id}`,
    DELETE: (id: number) => `/reviews/${id}`,
    GET_BY_STALL: (stallId: number) => `/reviews/stall/${stallId}`,
  },
};

// App Configuration
export const APP_NAME = "Ceylon Trade";
export const APP_VERSION = "1.0.0";
