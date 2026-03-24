/**
 * category.js — 分类管理 API
 */
import request from '../utils/request'
import { API_ENDPOINTS } from '../constants/api'

const { CATEGORY } = API_ENDPOINTS

/** 获取分类列表 */
export const getCategories = () =>
  request.get(CATEGORY.LIST)

/**
 * 新增分类
 * @param {Object} data
 */
export const createCategory = (data) =>
  request.post(CATEGORY.CREATE, data)

/**
 * 修改分类
 * @param {number|string} id
 * @param {Object} data
 */
export const updateCategory = (id, data) =>
  request.put(CATEGORY.UPDATE(id), data)

/**
 * 删除分类
 * @param {number|string} id
 */
export const deleteCategory = (id) =>
  request.delete(CATEGORY.DELETE(id))
