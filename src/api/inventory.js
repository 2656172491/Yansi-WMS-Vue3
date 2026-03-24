/**
 * inventory.js — 库存管理 API
 */
import request from '../utils/request'
import { API_ENDPOINTS } from '../constants/api'

const { INVENTORY } = API_ENDPOINTS

/** 获取库存列表 */
export const getInventory = (params) =>
  request.get(INVENTORY.LIST, { params })

/** 获取库存详情 */
export const getInventoryById = (id) =>
  request.get(INVENTORY.DETAIL(id))

/** 入库操作 */
export const stockIn = (data) =>
  request.post(INVENTORY.IN, data)

/** 出库操作 */
export const stockOut = (data) =>
  request.post(INVENTORY.OUT, data)

/** 库存盘点 */
export const stockCheck = (data) =>
  request.post(INVENTORY.CHECK, data)

/** 获取库存预警列表 */
export const getInventoryAlerts = () =>
  request.get(INVENTORY.ALERTS)
