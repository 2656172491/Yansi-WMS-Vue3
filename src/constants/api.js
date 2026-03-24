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
    USER_INFO: '/api/auth/userInfo',
    PERMISSIONS: '/api/auth/permissions',
  },
  GOODS: {
    LIST: '/api/goods/list',
    DETAIL: (id) => `/api/goods/${id}`,
    CREATE: '/api/goods',
    UPDATE: (id) => `/api/goods/${id}`,
    DELETE: (id) => `/api/goods/${id}`,
  },
  CATEGORY: {
    LIST: '/api/category/list',
    CREATE: '/api/category',
    UPDATE: (id) => `/api/category/${id}`,
    DELETE: (id) => `/api/category/${id}`,
  },
  INVENTORY: {
    LIST: '/api/inventory/list',
    DETAIL: (id) => `/api/inventory/${id}`,
    INBOUND: '/api/inventory/inbound',
    OUTBOUND: '/api/inventory/outbound',
    CHECK: '/api/inventory/check',
    ALERTS: '/api/inventory/alerts',
    // legacy aliases kept for backward compatibility
    IN: '/api/inventory/inbound',
    OUT: '/api/inventory/outbound',
  },
  RECORD: {
    LIST: '/api/record/list',
  },
  STATISTICS: {
    OVERVIEW: '/api/statistics/overview',
    TREND: '/api/statistics/trend',
    CATEGORY: '/api/statistics/category',
    INVENTORY_REPORT: '/api/statistics/inventory',
  },
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id) => `/api/products/${id}`,
    CREATE: '/api/products',
    UPDATE: (id) => `/api/products/${id}`,
    DELETE: (id) => `/api/products/${id}`,
    CATEGORIES: '/api/products/categories',
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
