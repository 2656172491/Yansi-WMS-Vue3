/**
 * api.js — API 端点常量配置
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh-token',
    ME: '/api/auth/me',
    PERMISSIONS: '/api/auth/permissions',
  },
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id) => `/api/products/${id}`,
    CREATE: '/api/products',
    UPDATE: (id) => `/api/products/${id}`,
    DELETE: (id) => `/api/products/${id}`,
    CATEGORIES: '/api/products/categories',
  },
  INVENTORY: {
    LIST: '/api/inventory',
    DETAIL: (id) => `/api/inventory/${id}`,
    IN: '/api/inventory/in',
    OUT: '/api/inventory/out',
    CHECK: '/api/inventory/check',
    ALERTS: '/api/inventory/alerts',
  },
  ORDERS: {
    LIST: '/api/orders',
    DETAIL: (id) => `/api/orders/${id}`,
    CREATE: '/api/orders',
    UPDATE: (id) => `/api/orders/${id}`,
    DELETE: (id) => `/api/orders/${id}`,
    SHIP: (id) => `/api/orders/${id}/ship`,
  },
  COMMON: {
    UPLOAD: '/api/upload',
    DOWNLOAD: (id) => `/api/download/${id}`,
    DASHBOARD_STATS: '/api/dashboard/stats',
    REPORT_SALES: '/api/reports/sales',
    REPORT_INVENTORY: '/api/reports/inventory',
  },
}
