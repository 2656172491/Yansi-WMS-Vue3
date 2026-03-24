/**
 * apiHelper.js — API 辅助函数
 * 提供参数验证、分页构建、日期处理、错误消息转换等工具
 */
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/wms'
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/errorCode'

/**
 * 构建分页请求参数
 * @param {{ page?: number, pageSize?: number }} options
 * @returns {{ page: number, pageSize: number }}
 */
export const buildPageParams = ({ page, pageSize } = {}) => ({
  page: page ?? DEFAULT_PAGE,
  pageSize: pageSize ?? DEFAULT_PAGE_SIZE,
})

/**
 * 构建日期范围参数（过滤空值）
 * @param {string|null} startDate - 开始日期 (YYYY-MM-DD)
 * @param {string|null} endDate   - 结束日期 (YYYY-MM-DD)
 * @returns {{ startDate?: string, endDate?: string }}
 */
export const buildDateRangeParams = (startDate, endDate) => {
  const params = {}
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate
  return params
}

/**
 * 过滤对象中的空值（null / undefined / 空字符串）
 * @param {Object} obj
 * @returns {Object}
 */
export const filterEmptyParams = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== '')
  )

/**
 * 将业务错误码转换为可读消息
 * @param {number} code
 * @param {string} [fallback]
 * @returns {string}
 */
export const getErrorMessage = (code, fallback = '操作失败') =>
  ERROR_MESSAGES[code] || fallback

/**
 * 判断是否为认证错误
 * @param {number} code
 * @returns {boolean}
 */
export const isAuthError = (code) => code === ERROR_CODES.UNAUTHORIZED

/**
 * 验证必填字段（仅字符串/数字）
 * @param {Object} data       - 表单数据
 * @param {string[]} required - 必填字段名数组
 * @returns {{ valid: boolean, missing: string[] }}
 */
export const validateRequiredFields = (data, required) => {
  const missing = required.filter((key) => {
    const val = data[key]
    return val === null || val === undefined || val === ''
  })
  return { valid: missing.length === 0, missing }
}

/**
 * 将 Date 对象或时间戳格式化为 YYYY-MM-DD 字符串
 * @param {Date|number|string} date
 * @returns {string}
 */
export const formatDate = (date) => {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
