// src/api/statistics.js — 统计分析 API（当前使用 Mock 数据）
// 后端集成时：取消每个函数内的注释行，删除 mock 实现，即可切换到真实请求。

import request from '@/utils/request.js'
import {
  MOCK_CATEGORY_STATS,
  MOCK_INVENTORY,
  MOCK_GOODS,
} from '@/constants/wms.js'

/**
 * 统计概览数据（首页卡片）
 * 接口：GET /api/statistics/overview
 * @returns {Promise<object>} 含 totalGoods、totalInventory、inboundToday、outboundToday、warningCount 等字段
 */
export function getOverview() {
  // 后端就绪后替换为：return request.get('/statistics/overview')
  return request({
    url: '/statistics/overview',
    method: 'GET',
  })
}

/**
 * 出入库趋势数据
 * 接口：GET /api/statistics/trend
 * @param {{ period: 'week' | 'month' }} params — 统计周期
 * @returns {Promise<object>} 含 dates[]、inbound[]、outbound[] 三个并行数组
 */
export function getTrend(params={}) {
  return request({
    url: '/statistics/trends',
    method: 'GET',
    params: params,
  })
}

/**
 * 物资分类占比统计
 * 接口：GET /api/statistics/category
 * @returns {Promise<object[]>} 分类统计列表，每项含 name、value（库存数量）
 */
export function getCategoryStats() {
  // 后端就绪后替换为：return request.get('/statistics/category')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '获取成功', data: [...MOCK_CATEGORY_STATS] })
    }, 300)
  })
}

// ===================== 预警信息 =====================

/**
 * 获取库存预警列表（库存低于 min_stock 的物资）
 * 接口：GET /api/statistics/warning
 * @param {{ page?: number, pageSize?: number }} params
 * @returns {Promise<{ records: object[], total: number }>}
 *   - records[]: { goods_id, goods_name, goods_code, quantity, min_stock, warehouse_id }
 */
export function getWarningList(params = {}) {
  // 后端就绪后替换为：return request.get('/statistics/warning', { params })
  return new Promise((resolve) => {
    setTimeout(() => {
      const list = MOCK_INVENTORY.filter((inv) => {
        const goods = MOCK_GOODS.find((g) => g.id === inv.goods_id)
        return goods && inv.quantity <= goods.min_stock
      }).map((inv) => {
        const goods = MOCK_GOODS.find((g) => g.id === inv.goods_id)
        return {
          goods_id: inv.goods_id,
          goods_name: inv.goods_name,
          goods_code: inv.goods_code,
          quantity: inv.quantity,
          min_stock: goods.min_stock,
          warehouse_id: inv.warehouse_id,
        }
      })
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const total = list.length
      const records = list.slice((page - 1) * pageSize, page * pageSize)
      resolve({ code: 200, msg: '获取成功', data: { records, total, page, pageSize } })
    }, 300)
  })
}
