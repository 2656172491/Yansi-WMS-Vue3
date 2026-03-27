// src/api/statistics.js — 统计分析 API（当前使用 Mock 数据）
// 后端集成时：将函数体替换为 request.get 调用。

import {
  MOCK_OVERVIEW,
  MOCK_TREND_WEEK,
  MOCK_TREND_MONTH,
  MOCK_CATEGORY_STATS,
  MOCK_INVENTORY,
  MOCK_GOODS,
} from '@/constants/wms.js'

/**
 * 统计概览（首页卡片数据）
 */
export function getOverview() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '获取成功', data: { ...MOCK_OVERVIEW } })
    }, 300)
  })
}

/**
 * 出入库趋势
 * @param {{ period: 'week' | 'month' }} params
 */
export function getTrend(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = params.period === 'month' ? MOCK_TREND_MONTH : MOCK_TREND_WEEK
      resolve({ code: 200, msg: '获取成功', data: { ...data } })
    }, 300)
  })
}

/**
 * 分类占比
 */
export function getCategoryStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '获取成功', data: [...MOCK_CATEGORY_STATS] })
    }, 300)
  })
}

// ===================== 预警信息 =====================

/**
 * 获取库存预警列表（库存低于 min_stock 的物资）
 * @param {{ page?: number, pageSize?: number }} params
 * @returns {Promise<{ records: object[], total: number }>}
 *   - records[]: { goods_id, goods_name, goods_code, quantity, min_stock, warehouse_id }
 */
export function getWarningList(params = {}) {
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
