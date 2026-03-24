/**
 * storage.js — 本地存储工具
 * 支持 token / 用户信息的 get/set/remove，可选过期时间
 */

const TOKEN_KEY = 'wms_token'
const USER_KEY = 'wms_user'
const REFRESH_TOKEN_KEY = 'wms_refresh_token'

// ── 辅助：带过期时间的存储 ─────────────────────────────────────────
/**
 * setItem — 将值写入 storage（可附带过期时长）
 * @param {Storage} storage - localStorage 或 sessionStorage
 * @param {string} key
 * @param {*} value
 * @param {number} [expire] - 有效期（毫秒数，例如 7 * 24 * 60 * 60 * 1000 表示 7 天）；不传则永不过期
 */
const setItem = (storage, key, value, expire) => {
  const payload = { value, expire: expire ? Date.now() + expire : null }
  storage.setItem(key, JSON.stringify(payload))
}

/**
 * 从 storage 读取值，已过期则自动删除并返回 null
 */
const getItem = (storage, key) => {
  const raw = storage.getItem(key)
  if (!raw) return null
  try {
    const { value, expire } = JSON.parse(raw)
    if (expire && Date.now() > expire) {
      storage.removeItem(key)
      return null
    }
    return value
  } catch {
    return null
  }
}

const removeItem = (storage, key) => storage.removeItem(key)

// ── Token ─────────────────────────────────────────────────────────
export const setToken = (token, expire) =>
  setItem(localStorage, TOKEN_KEY, token, expire)

export const getToken = () => getItem(localStorage, TOKEN_KEY)

export const removeToken = () => removeItem(localStorage, TOKEN_KEY)

// ── Refresh Token ─────────────────────────────────────────────────
export const setRefreshToken = (token, expire) =>
  setItem(localStorage, REFRESH_TOKEN_KEY, token, expire)

export const getRefreshToken = () => getItem(localStorage, REFRESH_TOKEN_KEY)

export const removeRefreshToken = () => removeItem(localStorage, REFRESH_TOKEN_KEY)

// ── 用户信息 ──────────────────────────────────────────────────────
export const setUserInfo = (user) =>
  setItem(localStorage, USER_KEY, user)

export const getUserInfo = () => getItem(localStorage, USER_KEY)

export const removeUserInfo = () => removeItem(localStorage, USER_KEY)

// ── 清除全部认证数据 ──────────────────────────────────────────────
export const clearAuth = () => {
  removeToken()
  removeRefreshToken()
  removeUserInfo()
}
