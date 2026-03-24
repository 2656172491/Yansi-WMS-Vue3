/**
 * orders.js — 订单管理 API
 */
import request from '../utils/request'
import { API_ENDPOINTS } from '../constants/api'

const { ORDERS } = API_ENDPOINTS

/** 获取订单列表 */
export const getOrders = (params) =>
  request.get(ORDERS.LIST, { params })

/** 获取订单详情 */
export const getOrderById = (id) =>
  request.get(ORDERS.DETAIL(id))

/** 创建订单 */
export const createOrder = (data) =>
  request.post(ORDERS.CREATE, data)

/** 更新订单 */
export const updateOrder = (id, data) =>
  request.put(ORDERS.UPDATE(id), data)

/** 删除订单 */
export const deleteOrder = (id) =>
  request.delete(ORDERS.DELETE(id))

/** 发货 */
export const shipOrder = (id, data) =>
  request.post(ORDERS.SHIP(id), data)
