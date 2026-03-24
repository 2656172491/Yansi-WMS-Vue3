/**
 * appStore.js — 应用全局状态
 * 管理全局加载状态、通知消息、应用配置
 */
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useAppStore = defineStore('app', () => {
  // ── 全局加载 ───────────────────────────────────────────────────
  const globalLoading = ref(false)

  const setLoading = (val) => { globalLoading.value = val }

  // ── 通知消息队列 ───────────────────────────────────────────────
  const notifications = ref([])

  /**
   * 推送一条通知
   * @param {{ type?: 'success'|'warning'|'info'|'error', title: string, message: string }} notice
   */
  const pushNotification = (notice) => {
    notifications.value.unshift({
      id: Date.now(),
      type: 'info',
      read: false,
      time: new Date().toLocaleString(),
      ...notice,
    })
  }

  const markNotificationRead = (id) => {
    const item = notifications.value.find((n) => n.id === id)
    if (item) item.read = true
  }

  const clearNotifications = () => { notifications.value = [] }

  const unreadCount = () => notifications.value.filter((n) => !n.read).length

  // ── 应用配置 ───────────────────────────────────────────────────
  const config = reactive({
    title: 'Yansi WMS',
    theme: 'light',
    language: 'zh-CN',
    pageSize: 20,
    sidebarCollapsed: false,
  })

  const updateConfig = (partial) => {
    Object.assign(config, partial)
  }

  return {
    globalLoading,
    setLoading,
    notifications,
    pushNotification,
    markNotificationRead,
    clearNotifications,
    unreadCount,
    config,
    updateConfig,
  }
})
