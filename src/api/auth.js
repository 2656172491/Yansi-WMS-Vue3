// src/api/auth.js — 认证模块 API（当前使用 Mock 数据）
// 后端集成时：将函数体替换为 request.post/get 调用，删除 mock 逻辑即可。

import { setToken, setUserInfo, clearAuth, getToken } from '@/utils/auth.js'

/** Mock 用户数据库 */
const MOCK_USERS = [
  { id: 1, username: 'admin', password: '123456', realName: '管理员', role: 'ADMIN', phone: '138****8888' },
]

/**
 * 用户登录
 * @param {{ username: string, password: string }} data
 * @returns {Promise<{ token: string, userInfo: object }>}
 */
export function login(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.username === data.username && u.password === data.password,
      )
      if (user) {
        const token = `mock-token-${user.id}-${Date.now()}`
        const userInfo = { id: user.id, username: user.username, realName: user.realName, role: user.role, phone: user.phone }
        setToken(token)
        setUserInfo(userInfo)
        resolve({ code: 200, msg: '登录成功', data: { token, userInfo } })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 600)
  })
}

/**
 * 用户登出
 */
export function logout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      clearAuth()
      resolve({ code: 200, msg: '退出成功' })
    }, 300)
  })
}

/**
 * 获取当前用户信息
 */
export function getUserInfo() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = getToken()
      if (!token) {
        reject(new Error('未登录'))
        return
      }
      const userInfo = JSON.parse(localStorage.getItem('wms_user') || 'null')
      if (userInfo) {
        resolve({ code: 200, msg: '获取成功', data: userInfo })
      } else {
        reject(new Error('用户信息不存在'))
      }
    }, 200)
  })
}
