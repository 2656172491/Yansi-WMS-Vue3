// src/api/statistics.js — 统计分析 API（当前使用 Mock 数据）
// 后端集成时：将函数体替换为 request.get 调用。

import {
  MOCK_OVERVIEW,
  MOCK_TREND_WEEK,
  MOCK_TREND_MONTH,
  MOCK_CATEGORY_STATS,
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
