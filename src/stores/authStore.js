/**
 * authStore.js — 认证状态管理
 * 管理用户信息、token、权限列表、登录/登出/刷新
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout, getMe, getPermissions, refreshToken as refreshTokenApi } from '../api/auth'
import { setToken, getToken, removeToken, setRefreshToken, getRefreshToken, removeRefreshToken, setUserInfo, getUserInfo, clearAuth } from '../utils/storage'

// ── 过期时长常量 ───────────────────────────────────────────────────
const TOKEN_EXPIRE_REMEMBER = 7 * 24 * 60 * 60 * 1000   // 7 天
const REFRESH_TOKEN_EXPIRE = 30 * 24 * 60 * 60 * 1000   // 30 天

export const useAuthStore = defineStore('auth', () => {
  // ── 状态 ───────────────────────────────────────────────────────
  const token = ref(getToken() || '')
  const refreshToken = ref(getRefreshToken() || '')
  const userInfo = ref(getUserInfo() || null)
  const permissions = ref([])

  // ── 计算属性 ───────────────────────────────────────────────────
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  const roles = computed(() => userInfo.value?.roles || [])

  /** 检查是否拥有某个权限 */
  const hasPermission = (perm) => permissions.value.includes(perm)

  // ── 方法 ───────────────────────────────────────────────────────

  /**
   * 登录
   * @param {{ username: string, password: string, remember?: boolean }} credentials
   */
  const doLogin = async (credentials) => {
    const data = await login(credentials)
    // 期望后端返回 { token, refreshToken, user }
    token.value = data.token
    refreshToken.value = data.refreshToken || ''
    userInfo.value = data.user || null

    const expire = credentials.remember ? TOKEN_EXPIRE_REMEMBER : undefined
    setToken(data.token, expire)
    if (data.refreshToken) setRefreshToken(data.refreshToken, REFRESH_TOKEN_EXPIRE)
    if (data.user) setUserInfo(data.user)

    return data
  }

  /** 登出 */
  const doLogout = async () => {
    try {
      await logout()
    } finally {
      token.value = ''
      refreshToken.value = ''
      userInfo.value = null
      permissions.value = []
      clearAuth()
    }
  }

  /** 获取当前用户信息 */
  const fetchUserInfo = async () => {
    const data = await getMe()
    userInfo.value = data
    setUserInfo(data)
    return data
  }

  /** 获取权限列表 */
  const fetchPermissions = async () => {
    const data = await getPermissions()
    permissions.value = Array.isArray(data) ? data : []
    return permissions.value
  }

  /** 刷新 token */
  const doRefreshToken = async () => {
    const data = await refreshTokenApi(refreshToken.value)
    token.value = data.token
    refreshToken.value = data.refreshToken || refreshToken.value
    setToken(data.token)
    if (data.refreshToken) setRefreshToken(data.refreshToken)
    return data.token
  }

  /** 直接设置 token（供路由守卫等使用） */
  const setAuthToken = (t) => {
    token.value = t
    setToken(t)
  }

  return {
    token,
    userInfo,
    permissions,
    isLoggedIn,
    username,
    roles,
    hasPermission,
    doLogin,
    doLogout,
    fetchUserInfo,
    fetchPermissions,
    doRefreshToken,
    setAuthToken,
  }
})
