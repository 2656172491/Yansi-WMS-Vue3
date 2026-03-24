// src/utils/request.js — Axios 封装
// 当前阶段使用 mock 数据，不发送真实请求。
// 后端集成时：移除 mockInterceptor，设置 baseURL = '/api'，并在 request/response 拦截器中处理 token 和错误。

import axios from 'axios'
import { getToken, clearAuth } from './auth.js'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器：自动携带 Token
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：统一处理响应格式与错误
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 统一响应格式: { code, msg, data }
    if (res.code !== 200) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    return res
  },
  (error) => {
    if (error.response?.status === 401) {
      clearAuth()
      window.location.href = '/login'
    } else {
      ElMessage.error(error.message || '网络异常')
    }
    return Promise.reject(error)
  },
)

export default service
