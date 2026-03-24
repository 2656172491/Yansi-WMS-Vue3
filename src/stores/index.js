/**
 * index.js — Pinia 配置与导出
 */
import { createPinia } from 'pinia'

export const pinia = createPinia()

export { useAuthStore } from './authStore'
export { useAppStore } from './appStore'
export { useGoodsStore } from './goodsStore'
export { useInventoryStore } from './inventoryStore'
