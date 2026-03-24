/**
 * useStatistics.js — 统计分析 composable
 */
import { ref } from 'vue'
import {
  getStatisticsOverview,
  getStockTrend,
  getCategoryDistribution,
  getInventoryReport,
} from '../api/statistics'

export function useStatistics() {
  const overview = ref(null)
  const trend = ref([])
  const categoryDistribution = ref([])
  const inventoryReport = ref([])

  const overviewLoading = ref(false)
  const trendLoading = ref(false)
  const categoryLoading = ref(false)
  const reportLoading = ref(false)

  /** 获取统计概览数据 */
  const loadOverview = async () => {
    overviewLoading.value = true
    try {
      overview.value = await getStatisticsOverview()
      return overview.value
    } finally {
      overviewLoading.value = false
    }
  }

  /**
   * 获取出入库趋势数据
   * @param {{ startDate?: string, endDate?: string, type?: 'day'|'week'|'month' }} params
   */
  const loadTrend = async (params) => {
    trendLoading.value = true
    try {
      const data = await getStockTrend(params)
      trend.value = Array.isArray(data) ? data : (data?.list || [])
      return trend.value
    } finally {
      trendLoading.value = false
    }
  }

  /** 获取分类占比数据 */
  const loadCategoryDistribution = async () => {
    categoryLoading.value = true
    try {
      const data = await getCategoryDistribution()
      categoryDistribution.value = Array.isArray(data) ? data : (data?.list || [])
      return categoryDistribution.value
    } finally {
      categoryLoading.value = false
    }
  }

  /**
   * 获取库存报表
   * @param {{ startDate?: string, endDate?: string, categoryId?: number|string }} params
   */
  const loadInventoryReport = async (params) => {
    reportLoading.value = true
    try {
      const data = await getInventoryReport(params)
      inventoryReport.value = Array.isArray(data) ? data : (data?.list || [])
      return inventoryReport.value
    } finally {
      reportLoading.value = false
    }
  }

  return {
    overview,
    trend,
    categoryDistribution,
    inventoryReport,
    overviewLoading,
    trendLoading,
    categoryLoading,
    reportLoading,
    loadOverview,
    loadTrend,
    loadCategoryDistribution,
    loadInventoryReport,
  }
}
