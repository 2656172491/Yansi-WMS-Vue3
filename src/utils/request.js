/**
 * request.js — Axios HTTP 请求封装
 * 功能：实例配置、请求/响应拦截器、统一错误处理、loading 状态
 */
import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { getToken, removeToken } from './storage'
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/errorCode'

// ── 全局 loading 引用 ─────────────────────────────────────────────
let loadingInstance = null
let loadingCount = 0

const showLoading = () => {
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({ fullscreen: true, text: '加载中...' })
  }
  loadingCount++
}

const hideLoading = () => {
  loadingCount = Math.max(0, loadingCount - 1)
  if (loadingCount === 0 && loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

// ── 延迟获取 router 实例（避免循环依赖） ──────────────────────────
let _router = null
export const setRouter = (router) => { _router = router }

// ── Axios 实例 ────────────────────────────────────────────────────
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
})

// ── 请求拦截器 ────────────────────────────────────────────────────
service.interceptors.request.use(
  (config) => {
    // 自动附加 token
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // 默认开启 loading（可通过 config.loading = false 关闭）
    if (config.loading !== false) {
      showLoading()
    }

    return config
  },
  (error) => {
    hideLoading()
    return Promise.reject(error)
  }
)

// ── 响应拦截器 ────────────────────────────────────────────────────
service.interceptors.response.use(
  (response) => {
    hideLoading()
    const { data } = response

    // 约定：后端返回 { code, data, message } 结构
    if (data.code !== undefined && data.code !== ERROR_CODES.SUCCESS) {
      const msg = data.message || ERROR_MESSAGES[data.code] || '请求失败'
      ElMessage.error(msg)
      return Promise.reject(new Error(msg))
    }

    // 返回 data 字段，或整体响应（兼容不同后端格式）
    return data.data !== undefined ? data.data : data
  },
  (error) => {
    hideLoading()

    const status = error.response?.status
    const serverMsg = error.response?.data?.message

    if (status === ERROR_CODES.UNAUTHORIZED) {
      // token 失效，清除本地缓存并跳转登录
      removeToken()
      ElMessage.error('登录已过期，请重新登录')
      setTimeout(() => {
        if (_router) {
          _router.push('/login')
        } else {
          window.location.href = '/login'
        }
      }, 1500)
    } else {
      const msg = serverMsg || ERROR_MESSAGES[status] || error.message || '网络请求失败'
      ElMessage.error(msg)
    }

    return Promise.reject(error)
  }
)

export default service
