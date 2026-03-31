// src/api/goods.js — 物资管理 API（当前使用 Mock 数据）
// 后端集成时：取消每个函数内的注释行，删除 mock 实现，即可切换到真实请求。

import request from '@/utils/request.js'
import { MOCK_GOODS } from '@/constants/wms.js'

// 本地可写副本（运行时增删改）
let goods = [...MOCK_GOODS.map((g) => ({ ...g }))]
let nextId = Math.max(...goods.map((g) => g.id)) + 1


export function getGoodsList(params = {}) {
  // 后端就绪后替换为：return request.get('/inventory/list', { params })
  return request({
    url: '/goods',
    method: 'GET',
    params: params,
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
