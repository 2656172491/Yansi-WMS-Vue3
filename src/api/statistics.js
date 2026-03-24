/**
 * statistics.js — 统计分析 API
 */
import request from '../utils/request'
import { API_ENDPOINTS } from '../constants/api'

const { STATISTICS } = API_ENDPOINTS

/** 获取统计概览（总库存、今日入库、今日出库、预警数量等） */
export const getStatisticsOverview = () =>
  request.get(STATISTICS.OVERVIEW)

/**
 * 获取出入库趋势
 * @param {{ startDate?: string, endDate?: string, type?: 'day'|'week'|'month' }} params
 */
export const getStockTrend = (params) =>
  request.get(STATISTICS.TREND, { params })

/** 获取分类占比（各分类库存分布） */
export const getCategoryDistribution = () =>
  request.get(STATISTICS.CATEGORY)

/**
 * 获取库存报表
 * @param {{ startDate?: string, endDate?: string, categoryId?: number|string }} params
 */
export const getInventoryReport = (params) =>
  request.get(STATISTICS.INVENTORY_REPORT, { params })
