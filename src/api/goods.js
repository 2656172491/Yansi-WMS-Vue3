// src/api/goods.js — 物资管理 API（当前使用 Mock 数据）
// 后端集成时：取消每个函数内的注释行，删除 mock 实现，即可切换到真实请求。

import request from '@/utils/request.js'
import { MOCK_GOODS, MOCK_CATEGORIES } from '@/constants/wms.js'

// 本地可写副本（运行时增删改）
let goods = [...MOCK_GOODS.map((g) => ({ ...g }))]
let nextId = Math.max(...goods.map((g) => g.id)) + 1

// ===================== 物资分类 =====================

/**
 * 获取物资分类列表
 * 接口：GET /api/goods/category
 * @returns {Promise<object[]>} 分类列表，每项含 id、name、code、sort
 */
export function getCategoryList() {
  // 后端就绪后替换为：return request.get('/goods/category')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '获取成功', data: [...MOCK_CATEGORIES] })
    }, 200)
  })
}

// ===================== 物资 CRUD =====================

/**
 * 分页查询物资列表
 * 接口：GET /api/goods/list
 * @param {{ page?: number, pageSize?: number, name?: string, code?: string, category_id?: number, status?: number }} params
 * @returns {Promise<{ records: object[], total: number, page: number, pageSize: number }>}
 *   - records[]: { id, name, code, category_id, specification, unit, price, min_stock, max_stock, status, create_time }
 */
export function getGoodsList(params = {}) {
  // 后端就绪后替换为：return request.get('/goods/list', { params })
  return new Promise((resolve) => {
    setTimeout(() => {
      let list = [...goods]
      if (params.name) list = list.filter((g) => g.name.includes(params.name))
      if (params.code) list = list.filter((g) => g.code.includes(params.code))
      if (params.category_id) list = list.filter((g) => g.category_id === params.category_id)
      if (params.status !== undefined && params.status !== '') {
        list = list.filter((g) => g.status === Number(params.status))
      }
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const total = list.length
      const records = list.slice((page - 1) * pageSize, page * pageSize)
      resolve({ code: 200, msg: '获取成功', data: { records, total, page, pageSize } })
    }, 300)
  })
}

/**
 * 根据 ID 获取物资详情
 * 接口：GET /api/goods/:id
 * @param {number} id — 物资 ID
 * @returns {Promise<object>} 物资详情对象，字段同 getGoodsList 的 records 项
 */
export function getGoodsById(id) {
  // 后端就绪后替换为：return request.get(`/goods/${id}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = goods.find((g) => g.id === id)
      if (item) {
        resolve({ code: 200, msg: '获取成功', data: { ...item } })
      } else {
        reject(new Error('物资不存在'))
      }
    }, 200)
  })
}

/**
 * 新增物资
 * 接口：POST /api/goods
 * @param {{ name: string, code: string, category_id: number, specification?: string, unit: string, price: number, min_stock: number, max_stock: number, status?: number }} data
 * @returns {Promise<object>} 新创建的物资对象（含服务端生成的 id、create_time）
 */
export function addGoods(data) {
  // 后端就绪后替换为：return request.post('/goods', data)
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = {
        ...data,
        id: nextId++,
        status: data.status ?? 1,
        create_time: new Date().toLocaleString('zh-CN'),
      }
      goods.push(item)
      resolve({ code: 200, msg: '新增成功', data: item })
    }, 400)
  })
}

/**
 * 修改物资信息
 * 接口：PUT /api/goods/:id
 * @param {object} data — 必须含 id，其余字段同新增
 * @returns {Promise<object>} 更新后的物资对象
 */
export function updateGoods(data) {
  // 后端就绪后替换为：return request.put(`/goods/${data.id}`, data)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = goods.findIndex((g) => g.id === data.id)
      if (index === -1) {
        reject(new Error('物资不存在'))
        return
      }
      goods[index] = { ...goods[index], ...data }
      resolve({ code: 200, msg: '修改成功', data: goods[index] })
    }, 400)
  })
}

/**
 * 删除物资
 * 接口：DELETE /api/goods/:id
 * @param {number} id — 物资 ID
 * @returns {Promise<null>}
 */
export function deleteGoods(id) {
  // 后端就绪后替换为：return request.delete(`/goods/${id}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = goods.findIndex((g) => g.id === id)
      if (index === -1) {
        reject(new Error('物资不存在'))
        return
      }
      goods.splice(index, 1)
      resolve({ code: 200, msg: '删除成功' })
    }, 300)
  })
}
