/**
 * inventoryStore.js — 库存管理状态
 * 管理库存列表缓存、预警信息缓存、出入库记录缓存
 */
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import {
  getInventoryList,
  getInventoryAlerts,
  stockIn,
  stockOut,
  stockCheck,
  getRecordList,
} from '../api/inventory'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/wms'

export const useInventoryStore = defineStore('inventory', () => {
  // ── 库存列表 ──────────────────────────────────────────────────────
  const inventoryList = ref([])
  const inventoryTotal = ref(0)
  const inventoryLoading = ref(false)

  // ── 预警信息 ──────────────────────────────────────────────────────
  const alerts = ref([])
  const alertsLoading = ref(false)

  // ── 出入库记录 ────────────────────────────────────────────────────
  const records = ref([])
  const recordsTotal = ref(0)
  const recordsLoading = ref(false)

  // ── 搜索与分页状态（库存） ─────────────────────────────────────────
  const inventoryQuery = reactive({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    keyword: '',
    status: '',
  })

  // ── 搜索与分页状态（记录） ─────────────────────────────────────────
  const recordQuery = reactive({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    startDate: '',
    endDate: '',
    type: '',
  })

  // ── 方法 ──────────────────────────────────────────────────────────

  /** 获取库存列表 */
  const fetchInventoryList = async (params) => {
    inventoryLoading.value = true
    try {
      const data = await getInventoryList({ ...inventoryQuery, ...params })
      inventoryList.value = data?.list || data?.records || []
      inventoryTotal.value = data?.total || 0
      return data
    } finally {
      inventoryLoading.value = false
    }
  }

  /** 获取库存预警列表 */
  const fetchAlerts = async () => {
    alertsLoading.value = true
    try {
      const data = await getInventoryAlerts()
      alerts.value = Array.isArray(data) ? data : (data?.list || [])
      return alerts.value
    } finally {
      alertsLoading.value = false
    }
  }

  /**
   * 物资入库
   * @param {{ goodsId: number|string, quantity: number, remark?: string }} data
   */
  const doStockIn = async (data) => {
    await stockIn(data)
    await fetchInventoryList()
  }

  /**
   * 物资出库
   * @param {{ goodsId: number|string, quantity: number, remark?: string }} data
   */
  const doStockOut = async (data) => {
    await stockOut(data)
    await fetchInventoryList()
  }

  /**
   * 库存盘点
   * @param {{ goodsId: number|string, actualQuantity: number, remark?: string }} data
   */
  const doStockCheck = async (data) => {
    await stockCheck(data)
    await fetchInventoryList()
  }

  /** 获取出入库记录列表 */
  const fetchRecordList = async (params) => {
    recordsLoading.value = true
    try {
      const data = await getRecordList({ ...recordQuery, ...params })
      records.value = data?.list || data?.records || []
      recordsTotal.value = data?.total || 0
      return data
    } finally {
      recordsLoading.value = false
    }
  }

  return {
    inventoryList,
    inventoryTotal,
    inventoryLoading,
    alerts,
    alertsLoading,
    records,
    recordsTotal,
    recordsLoading,
    inventoryQuery,
    recordQuery,
    fetchInventoryList,
    fetchAlerts,
    doStockIn,
    doStockOut,
    doStockCheck,
    fetchRecordList,
  }
})
