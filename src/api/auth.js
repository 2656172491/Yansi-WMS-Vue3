/**
 * auth.js — 认证 API
 */
import request from '../utils/request'
import { API_ENDPOINTS } from '../constants/api'

const { AUTH } = API_ENDPOINTS

/** 登录 */
export const login = (data) =>
  request.post(AUTH.LOGIN, data)

/** 登出 */
export const logout = () =>
  request.post(AUTH.LOGOUT)

/** 刷新 token */
export const refreshToken = (refreshToken) =>
  request.post(AUTH.REFRESH, { refreshToken })

/** 获取当前用户信息 */
export const getMe = () =>
  request.get(AUTH.ME)

/** 获取当前用户权限列表 */
export const getPermissions = () =>
  request.get(AUTH.PERMISSIONS)
