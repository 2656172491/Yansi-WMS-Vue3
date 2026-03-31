// src/api/inventory.js — 库存管理 API（当前使用 Mock 数据）
// 后端集成时：取消每个函数内的注释行，删除 mock 实现，即可切换到真实请求。

import { MOCK_INVENTORY, MOCK_RECORDS } from '@/constants/wms.js'
import request from "@/utils/request.js";

// 运行时可写副本
let inventory = [...MOCK_INVENTORY.map((i) => ({ ...i }))]
let records = [...MOCK_RECORDS.map((r) => ({ ...r }))]
let nextRecordId = Math.max(...records.map((r) => r.id)) + 1

// ===================== 入库 =====================

/**
 * 物资入库
 * 接口：POST /api/inventory/inbound
 * @param {{ goods_id: number, quantity: number, remark?: string }} data
 * @returns {Promise<object>} 新生成的出入库记录，含 id、before_quantity、after_quantity、create_time
 */
export function inbound(data) {
  console.log(data)
  const url = '/goods/' + data.id

  return request({
    url: url,
    method: "PUT",
    data: {
      goodsId: data.id,
      type: 1,
      quantity: data.quantity,
      remark: data.remark,
      warehouseId: 1
    }
  })
}


// ===================== 出库 =====================

/**
 * 物资出库
 * 接口：POST /api/inventory/outbound
 * @param {{ goods_id: number, quantity: number, remark?: string }} data
 * @returns {Promise<object>} 新生成的出入库记录，含 id、before_quantity、after_quantity、create_time
 */
export function outbound(data) {
  // 后端就绪后替换为：return request.post('/inventory/outbound', data)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const inv = inventory.find((i) => i.goods_id === data.goods_id)
      if (!inv) {
        reject(new Error('库存记录不存在'))
        return
      }
      if (inv.quantity < data.quantity) {
        reject(new Error(`库存不足，当前库存：${inv.quantity}`))
        return
      }
      const before = inv.quantity
      inv.quantity -= data.quantity
      const record = {
        id: nextRecordId++,
        goods_id: inv.goods_id,
        goods_name: inv.goods_name,
        type: 2,
        quantity: data.quantity,
        before_quantity: before,
        after_quantity: inv.quantity,
        operator: 'admin',
        remark: data.remark || '',
        create_time: new Date().toLocaleString('zh-CN'),
      }
      records.unshift(record)
      resolve({ code: 200, msg: '出库成功', data: record })
    }, 500)
  })
}

// ===================== 出入库记录 =====================

/**
 * 分页查询出入库记录
 * 接口：GET /api/inventory/records
 * @param {{ page?: number, pageSize?: number, type?: number, goods_name?: string }} params
 *   - type: 1 入库 | 2 出库
 * @returns {Promise<{ records: object[], total: number, page: number, pageSize: number }>}
 *   - records[]: { id, goods_id, goods_name, type, quantity, before_quantity, after_quantity, operator, remark, create_time }
 */
export function getRecordList(params = {}) {
  // 后端就绪后替换为：return request.get('/inventory/records', { params })
  return new Promise((resolve) => {
    setTimeout(() => {
      let list = [...records]
      if (params.type !== undefined && params.type !== '') {
        list = list.filter((r) => r.type === Number(params.type))
      }
      if (params.goods_name) list = list.filter((r) => r.goods_name.includes(params.goods_name))
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const total = list.length
      const data = list.slice((page - 1) * pageSize, page * pageSize)
      resolve({ code: 200, msg: '获取成功', data: { records: data, total, page, pageSize } })
    }, 300)
  })
}

/** 获取所有库存（供下拉选择用）
 * 接口：GET /api/inventory/all
 * @returns {Promise<object[]>} 完整库存列表（id、goods_id、goods_name、goods_code、unit、quantity）
 */
export function getInventoryAll() {
  // 后端就绪后替换为：return request.get('/inventory/all')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '获取成功', data: [...inventory] })
    }, 200)
  })
}

// ===================== 库存盘点 =====================

/** Mock 盘点单列表（运行时可写副本） */
let stockChecks = []
let nextCheckId = 1

/**
 * 分页查询盘点单列表
 * 接口：GET /api/stock-check/list
 * @param {{ page?: number, pageSize?: number, status?: string }} params
 *   - status: '进行中' | '已完成' | '已取消'
 * @returns {Promise<{ records: object[], total: number, page: number, pageSize: number }>}
 */
export function getStockCheckList(params = {}) {
  // 后端就绪后替换为：return request.get('/stock-check/list', { params })
  return new Promise((resolve) => {
    setTimeout(() => {
      let list = [...stockChecks]
      if (params.status) list = list.filter((c) => c.status === params.status)
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const total = list.length
      const data = list.slice((page - 1) * pageSize, page * pageSize)
      resolve({ code: 200, msg: '获取成功', data: { records: data, total, page, pageSize } })
    }, 300)
  })
}

/**
 * 根据 ID 获取盘点单详情（含盘点明细列表）
 * 接口：GET /api/stock-check/:id
 * @param {number} id
 * @returns {Promise<object>} 盘点单对象，含 id、checkNo、status、createTime、items 数组
 *   - items[]: { goods_id, goodsCode, goodsName, category_id, unit, bookQuantity, actualQuantity, diffQuantity }
 */
export function getStockCheckById(id) {
  // 后端就绪后替换为：return request.get(`/stock-check/${id}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = stockChecks.find((c) => c.id === id)
      if (item) {
        resolve({ code: 200, msg: '获取成功', data: { ...item } })
      } else {
        reject(new Error('盘点单不存在'))
      }
    }, 200)
  })
}

/**
 * 新建盘点单（自动抓取当前库存数量作为账面数量）
 * 接口：POST /api/stock-check
 * @returns {Promise<object>} 新建的盘点单对象，含 id、checkNo、status:'进行中'、items 数组
 *   - checkNo 格式: CK + YYYYMMDD + 3位序号，例如 CK20260327001
 */
export function createStockCheck() {
  // 后端就绪后替换为：return request.post('/stock-check')
  return new Promise((resolve) => {
    setTimeout(() => {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const seq = String(nextCheckId).padStart(3, '0')
      const checkNo = `CK${date}${seq}`
      const items = inventory.map((inv) => ({
        goods_id: inv.goods_id,
        goodsCode: inv.goods_code,
        goodsName: inv.goods_name,
        category_id: inv.category_id,
        unit: inv.unit,
        bookQuantity: inv.quantity,
        actualQuantity: inv.quantity,
        diffQuantity: 0,
      }))
      const check = {
        id: nextCheckId++,
        checkNo,
        status: '进行中',
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
        items,
      }
      stockChecks.unshift(check)
      resolve({ code: 200, msg: '盘点单创建成功', data: check })
    }, 400)
  })
}

/**
 * 确认盘点单（将实盘数量同步回库存）
 * 接口：POST /api/stock-check/:id/confirm
 * @param {number} id — 盘点单 ID
 * @param {{ goods_id: number, actualQuantity: number }[]} items — 各物资实盘数量
 * @returns {Promise<null>}
 */
export function confirmStockCheck(id, items) {
  // 后端就绪后替换为：return request.post(`/stock-check/${id}/confirm`, { items })
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const check = stockChecks.find((c) => c.id === id)
      if (!check) {
        reject(new Error('盘点单不存在'))
        return
      }
      items.forEach(({ goods_id, actualQuantity }) => {
        const inv = inventory.find((i) => i.goods_id === goods_id)
        if (inv) inv.quantity = actualQuantity
      })
      check.status = '已完成'
      resolve({ code: 200, msg: '盘点确认成功' })
    }, 500)
  })
}
