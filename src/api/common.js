/**
 * common.js — 通用 API（上传、下载、工作台统计、报表）
 */
import request from '../utils/request'
import { API_ENDPOINTS } from '../constants/api'

const { COMMON } = API_ENDPOINTS

/**
 * 文件上传
 * @param {File} file - 要上传的文件对象
 */
export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post(COMMON.UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 文件下载（返回 Blob）
 * @param {string|number} id - 文件 ID
 */
export const downloadFile = (id) =>
  request.get(COMMON.DOWNLOAD(id), { responseType: 'blob', loading: false })

/** 工作台统计数据 */
export const getDashboardStats = () =>
  request.get(COMMON.DASHBOARD_STATS)

/** 销售报表 */
export const getSalesReport = (params) =>
  request.get(COMMON.REPORT_SALES, { params })

/** 库存报表 */
export const getInventoryReport = (params) =>
  request.get(COMMON.REPORT_INVENTORY, { params })
