/**
 * inventory.js — 库存管理 API
 */
import request from '../utils/request'
import { API_ENDPOINTS } from '../constants/api'

const { INVENTORY, RECORD } = API_ENDPOINTS

/**
 * 获取库存列表
 * @param {{ page?: number, pageSize?: number, keyword?: string, status?: string }} params
 */
export const getInventoryList = (params) =>
  request.get(INVENTORY.LIST, { params })

/** @deprecated 请使用 getInventoryList */
export const getInventory = (params) => getInventoryList(params)

/**
 * 获取库存详情
 * @param {number|string} id
 */
export const getInventoryById = (id) =>
  request.get(INVENTORY.DETAIL(id))

/**
 * 物资入库
 * @param {{ goodsId: number|string, quantity: number, remark?: string }} data
 */
export const stockIn = (data) =>
  request.post(INVENTORY.INBOUND, data)

/**
 * 物资出库
 * @param {{ goodsId: number|string, quantity: number, remark?: string }} data
 */
export const stockOut = (data) =>
  request.post(INVENTORY.OUTBOUND, data)

/**
 * 库存盘点
 * @param {{ goodsId: number|string, actualQuantity: number, remark?: string }} data
 */
export const stockCheck = (data) =>
  request.post(INVENTORY.CHECK, data)

/** 获取库存预警列表 */
export const getInventoryAlerts = () =>
  request.get(INVENTORY.ALERTS)

/**
 * 获取出入库记录列表
 * @param {{ page?: number, pageSize?: number, startDate?: string, endDate?: string, type?: number }} params
 */
export const getRecordList = (params) =>
  request.get(RECORD.LIST, { params })
