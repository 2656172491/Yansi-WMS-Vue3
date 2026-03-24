// src/store/index.js — Pinia 状态管理（认证 store）
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, getUserInfo as getStoredUserInfo, setToken, setUserInfo, clearAuth } from '@/utils/auth.js'
import { login as apiLogin, logout as apiLogout, getUserInfo as apiFetchUserInfo } from '@/api/auth.js'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getToken())
  const userInfo = ref(getStoredUserInfo())

  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  const realName = computed(() => userInfo.value?.realName || userInfo.value?.username || '')
  const role = computed(() => userInfo.value?.role || '')

  /** 登录 */
  async function login(credentials) {
    const res = await apiLogin(credentials)
    token.value = res.data.token
    userInfo.value = res.data.userInfo
    setToken(res.data.token)
    setUserInfo(res.data.userInfo)
    return res
  }

  /** 登出 */
  async function logout() {
    await apiLogout()
    token.value = null
    userInfo.value = null
    clearAuth()
  }

  /** 获取/刷新用户信息 */
  async function fetchUserInfo() {
    const res = await apiFetchUserInfo()
    userInfo.value = res.data
    setUserInfo(res.data)
    return res.data
  }

  return { token, userInfo, isLoggedIn, username, realName, role, login, logout, fetchUserInfo }
})
