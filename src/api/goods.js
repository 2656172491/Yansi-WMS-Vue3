// src/api/goods.js — 物资管理 API（当前使用 Mock 数据）
// 后端集成时：将函数体替换为 request.get/post/put/delete 调用。

import { MOCK_GOODS, MOCK_CATEGORIES } from '@/constants/wms.js'

// 本地可写副本（运行时增删改）
let goods = [...MOCK_GOODS.map((g) => ({ ...g }))]
let nextId = Math.max(...goods.map((g) => g.id)) + 1

// ===================== 物资分类 =====================

/**
 * 获取分类列表
 * @returns {Promise}
 */
export function getCategoryList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '获取成功', data: [...MOCK_CATEGORIES] })
    }, 200)
  })
}

// ===================== 物资 CRUD =====================

/**
 * 分页查询物资列表
 * @param {{ page?: number, pageSize?: number, name?: string, code?: string, category_id?: number, status?: number }} params
 */
export function getGoodsList(params = {}) {
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
 * @param {number} id
 */
export function getGoodsById(id) {
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
 * @param {object} data
 */
export function addGoods(data) {
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
 * 修改物资
 * @param {object} data — 必须含 id
 */
export function updateGoods(data) {
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
 * @param {number} id
 */
export function deleteGoods(id) {
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
