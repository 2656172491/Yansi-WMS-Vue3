// src/api/statistics.js — 统计分析 API（当前使用 Mock 数据）
// 后端集成时：取消每个函数内的注释行，删除 mock 实现，即可切换到真实请求。

import request from '@/utils/request.js'

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