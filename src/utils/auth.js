// src/utils/auth.js — 认证工具函数（Token 存取）

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

/** 获取 Token */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/** 保存 Token */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

/** 移除 Token */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/** 是否已登录 */
export function isLoggedIn() {
  return !!getToken()
}

/** 保存用户信息 */
export function setUserInfo(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/** 获取用户信息 */
export function getUserInfo() {
  const str = localStorage.getItem(USER_KEY)
  try {
    return str ? JSON.parse(str) : null
  } catch {
    return null
  }
}

/** 清除所有认证信息 */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
