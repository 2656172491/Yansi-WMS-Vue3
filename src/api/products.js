/**
 * products.js — 产品管理 API
 */
import request from '../utils/request'
import { API_ENDPOINTS } from '../constants/api'

const { PRODUCTS } = API_ENDPOINTS

/** 获取产品列表 */
export const getProducts = (params) =>
  request.get(PRODUCTS.LIST, { params })

/** 获取产品详情 */
export const getProductById = (id) =>
  request.get(PRODUCTS.DETAIL(id))

/** 创建产品 */
export const createProduct = (data) =>
  request.post(PRODUCTS.CREATE, data)

/** 更新产品 */
export const updateProduct = (id, data) =>
  request.put(PRODUCTS.UPDATE(id), data)

/** 删除产品 */
export const deleteProduct = (id) =>
  request.delete(PRODUCTS.DELETE(id))

/** 获取产品分类列表 */
export const getProductCategories = () =>
  request.get(PRODUCTS.CATEGORIES)
