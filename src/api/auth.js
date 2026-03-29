// 🔥 把这里改成 你的封装 request
import request from '@/utils/request'

/**
 * 用户登录
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'POST',
    data: new URLSearchParams(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 用户登出
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'POST'
  })
}