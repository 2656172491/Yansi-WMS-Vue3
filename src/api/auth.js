// src/api/auth.js — 认证模块 API（当前使用 Mock 数据）
// 后端集成时：取消每个函数内的注释行，删除 mock 实现，即可切换到真实请求。

import request from '@/utils/request.js'
import { setToken, setUserInfo, clearAuth, getToken } from '@/utils/auth.js'

/** Mock 用户数据库 */
const MOCK_USERS = [
  { id: 1, username: 'admin', password: '123456', realName: '管理员', role: 'ADMIN', phone: '138****8888' },
]

/**
 * 用户登录
 * 接口：POST /api/auth/login
 * @param {{ username: string, password: string }} data — 登录凭据
 * @returns {Promise<{ token: string, userInfo: object }>} 返回 JWT token 及用户基本信息
 */
export function login(data) {
  // 后端就绪后替换为：return request.post('/auth/login', data)
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
 * 接口：POST /api/auth/logout
 * @returns {Promise<null>}
 */
export function logout() {
  // 后端就绪后替换为：return request.post('/auth/logout')
  return new Promise((resolve) => {
    setTimeout(() => {
      clearAuth()
      resolve({ code: 200, msg: '退出成功' })
    }, 300)
  })
}

/**
 * 获取当前登录用户信息
 * 接口：GET /api/auth/me
 * @returns {Promise<object>} 当前用户的 id、username、realName、role 等字段
 */
export function getUserInfo() {
  // 后端就绪后替换为：return request.get('/auth/me')
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
