// 后端集成时：取消每个函数内的注释行，删除 mock 实现，即可切换到真实请求。

import axios from "axios";

/**
 * 用户登录
 * 接口：POST /api/auth/login
 * @param {{ username: string, password: string }} data — 登录凭据
 * @returns {Promise<{ token: string, userInfo: object }>} 返回 JWT token 及用户基本信息
 */
export function login(data) {
  return axios({
    url: '/api/auth/login',
    method: 'POST',
    data: new URLSearchParams(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 用户登出
 * 接口：POST /api/auth/logout
 * @returns {Promise<null>}
 */
export function logout() {
  // 后端就绪后替换为：return request.post('/auth/logout')
  return axios({
    url: '/api/auth/logout',
    method: 'POST',
    data:{
      username: JSON.parse(localStorage.getItem('userInfo'))['username'],
    }
  })
}

/**
 * 获取当前登录用户信息
 * 接口：GET /api/auth/me
 * @returns {Promise<object>} 当前用户的 id、username、realName、role 等字段
 */
export function getUserInfo(module) {
  return axios({
    url: '/api/auth/me',
    method: 'GET',
    // GET 用 params 而不是 data
    params: {
      token: localStorage.getItem('token'),
      module: module
    }
  })
}
