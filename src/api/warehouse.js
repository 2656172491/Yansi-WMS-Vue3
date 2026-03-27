// src/api/warehouse.js — 仓库管理 API（当前使用 Mock 数据）
// 后端集成时：取消每个函数内的注释行，删除 mock 实现，即可切换到真实请求。

import request from '@/utils/request.js'

/** Mock 仓库列表（运行时可写副本） */
let warehouses = [
  {
    id: 1,
    name: '主仓库',
    code: 'WH-001',
    address: '深圳市南山区科技园1号',
    manager: '张三',
    phone: '13800000001',
    capacity: 10000,
    used: 6800,
    status: '启用',
    createTime: '2026-03-20 09:00',
  },
  {
    id: 2,
    name: '东区仓库',
    code: 'WH-002',
    address: '深圳市宝安区工业园8号',
    manager: '李四',
    phone: '13800000002',
    capacity: 6000,
    used: 4300,
    status: '启用',
    createTime: '2026-03-21 10:20',
  },
  {
    id: 3,
    name: '临时仓库',
    code: 'WH-003',
    address: '深圳市龙华区仓储路12号',
    manager: '王五',
    phone: '13800000003',
    capacity: 3000,
    used: 800,
    status: '维护中',
    createTime: '2026-03-22 11:15',
  },
  {
    id: 4,
    name: '备用仓库',
    code: 'WH-004',
    address: '深圳市福田区物流中心3号',
    manager: '赵六',
    phone: '13800000004',
    capacity: 5000,
    used: 0,
    status: '停用',
    createTime: '2026-03-23 14:30',
  },
]
let nextWarehouseId = Math.max(...warehouses.map((w) => w.id)) + 1

// ===================== 仓库查询 =====================

/**
 * 分页查询仓库列表
 * 接口：GET /api/warehouse/list
 * @param {{ page?: number, pageSize?: number, name?: string, status?: string }} params
 * @returns {Promise<{ records: object[], total: number, page: number, pageSize: number }>}
 *   - records[]: { id, name, code, address, manager, phone, capacity, used, status, createTime }
 */
export function getWarehouseList(params = {}) {
  // 后端就绪后替换为：return request.get('/warehouse/list', { params })
  return new Promise((resolve) => {
    setTimeout(() => {
      let list = [...warehouses]
      if (params.name) list = list.filter((w) => w.name.includes(params.name))
      if (params.status) list = list.filter((w) => w.status === params.status)
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const total = list.length
      const records = list.slice((page - 1) * pageSize, page * pageSize)
      resolve({ code: 200, msg: '获取成功', data: { records, total, page, pageSize } })
    }, 300)
  })
}

/**
 * 根据 ID 获取仓库详情
 * 接口：GET /api/warehouse/:id
 * @param {number} id
 * @returns {Promise<object>} 仓库信息对象（含 capacity、used、manager 等字段）
 */
export function getWarehouseById(id) {
  // 后端就绪后替换为：return request.get(`/warehouse/${id}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = warehouses.find((w) => w.id === id)
      if (item) {
        resolve({ code: 200, msg: '获取成功', data: { ...item } })
      } else {
        reject(new Error('仓库不存在'))
      }
    }, 200)
  })
}

/**
 * 获取所有仓库（供下拉选择用）
 * 接口：GET /api/warehouse/all
 * @returns {Promise<object[]>} 仓库简要信息列表（id、name、code）
 */
export function getWarehouseAll() {
  // 后端就绪后替换为：return request.get('/warehouse/all')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: '获取成功',
        data: warehouses.map(({ id, name, code }) => ({ id, name, code })),
      })
    }, 200)
  })
}

// ===================== 仓库 CRUD =====================

/**
 * 新增仓库
 * 接口：POST /api/warehouse
 * @param {{ name: string, code: string, address: string, manager: string, phone: string, capacity: number, used?: number, status: string }} data
 * @returns {Promise<object>} 新创建的仓库对象（含服务端生成的 id、createTime）
 */
export function addWarehouse(data) {
  // 后端就绪后替换为：return request.post('/warehouse', data)
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = {
        ...data,
        id: nextWarehouseId++,
        used: data.used ?? 0,
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      }
      warehouses.unshift(item)
      resolve({ code: 200, msg: '新增成功', data: item })
    }, 400)
  })
}

/**
 * 修改仓库信息
 * 接口：PUT /api/warehouse/:id
 * @param {object} data — 必须含 id，其余字段同新增
 * @returns {Promise<object>} 更新后的仓库对象
 */
export function updateWarehouse(data) {
  // 后端就绪后替换为：return request.put(`/warehouse/${data.id}`, data)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = warehouses.findIndex((w) => w.id === data.id)
      if (index === -1) {
        reject(new Error('仓库不存在'))
        return
      }
      warehouses[index] = { ...warehouses[index], ...data }
      resolve({ code: 200, msg: '修改成功', data: warehouses[index] })
    }, 400)
  })
}

/**
 * 删除仓库
 * 接口：DELETE /api/warehouse/:id
 * @param {number} id
 * @returns {Promise<null>}
 */
export function deleteWarehouse(id) {
  // 后端就绪后替换为：return request.delete(`/warehouse/${id}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = warehouses.findIndex((w) => w.id === id)
      if (index === -1) {
        reject(new Error('仓库不存在'))
        return
      }
      warehouses.splice(index, 1)
      resolve({ code: 200, msg: '删除成功' })
    }, 300)
  })
}

// ===================== 仓库状态 =====================

/**
 * 更新仓库状态
 * 接口：PUT /api/warehouse/:id/status
 * @param {number} id
 * @param {'启用' | '停用' | '维护中'} status
 * @returns {Promise<null>}
 */
export function updateWarehouseStatus(id, status) {
  // 后端就绪后替换为：return request.put(`/warehouse/${id}/status`, { status })
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = warehouses.find((w) => w.id === id)
      if (!item) {
        reject(new Error('仓库不存在'))
        return
      }
      item.status = status
      resolve({ code: 200, msg: '状态更新成功' })
    }, 300)
  })
}
