/**
 * goods.js — 物资管理 API
 */
import request from '../utils/request'
import { API_ENDPOINTS } from '../constants/api'

const { GOODS } = API_ENDPOINTS

/**
 * 获取物资列表
 * @param {{ page?: number, pageSize?: number, keyword?: string, categoryId?: number|string }} params
 */
export const getGoodsList = (params) =>
  request.get(GOODS.LIST, { params })

/**
 * 获取物资详情
 * @param {number|string} id
 */
export const getGoodsById = (id) =>
  request.get(GOODS.DETAIL(id))

/**
 * 新增物资
 * @param {Object} data
 */
export const createGoods = (data) =>
  request.post(GOODS.CREATE, data)

/**
 * 修改物资
 * @param {number|string} id
 * @param {Object} data
 */
export const updateGoods = (id, data) =>
  request.put(GOODS.UPDATE(id), data)

/**
 * 删除物资
 * @param {number|string} id
 */
export const deleteGoods = (id) =>
  request.delete(GOODS.DELETE(id))
