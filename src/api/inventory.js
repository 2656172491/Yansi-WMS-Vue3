// src/api/inventory.js — 库存管理 API（当前使用 Mock 数据）
// 后端集成时：将函数体替换为 request.get/post 调用。

import { MOCK_INVENTORY, MOCK_RECORDS } from '@/constants/wms.js'

// 运行时可写副本
let inventory = [...MOCK_INVENTORY.map((i) => ({ ...i }))]
let records = [...MOCK_RECORDS.map((r) => ({ ...r }))]
let nextRecordId = Math.max(...records.map((r) => r.id)) + 1

// ===================== 库存查询 =====================

/**
 * 分页查询库存列表
 * @param {{ page?: number, pageSize?: number, goods_name?: string, goods_code?: string }} params
 */
export function getInventoryList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let list = [...inventory]
      if (params.goods_name) list = list.filter((i) => i.goods_name.includes(params.goods_name))
      if (params.goods_code) list = list.filter((i) => i.goods_code.includes(params.goods_code))
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const total = list.length
      const records = list.slice((page - 1) * pageSize, page * pageSize)
      resolve({ code: 200, msg: '获取成功', data: { records, total, page, pageSize } })
    }, 300)
  })
}

// ===================== 入库 =====================

/**
 * 物资入库
 * @param {{ goods_id: number, quantity: number, remark?: string }} data
 */
export function inbound(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const inv = inventory.find((i) => i.goods_id === data.goods_id)
      if (!inv) {
        reject(new Error('库存记录不存在'))
        return
      }
      const before = inv.quantity
      inv.quantity += data.quantity
      const record = {
        id: nextRecordId++,
        goods_id: inv.goods_id,
        goods_name: inv.goods_name,
        type: 1,
        quantity: data.quantity,
        before_quantity: before,
        after_quantity: inv.quantity,
        operator: 'admin',
        remark: data.remark || '',
        create_time: new Date().toLocaleString('zh-CN'),
      }
      records.unshift(record)
      resolve({ code: 200, msg: '入库成功', data: record })
    }, 500)
  })
}

// ===================== 出库 =====================

/**
 * 物资出库
 * @param {{ goods_id: number, quantity: number, remark?: string }} data
 */
export function outbound(data) {
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
 * @param {{ page?: number, pageSize?: number, type?: number, goods_name?: string }} params
 */
export function getRecordList(params = {}) {
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

/** 获取所有库存（供下拉选择用） */
export function getInventoryAll() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '获取成功', data: [...inventory] })
    }, 200)
  })
}
