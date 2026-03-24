/**
 * useInventory.js — 库存管理 composable
 */
import { ElMessage } from 'element-plus'
import { useInventoryStore } from '../stores/inventoryStore'

export function useInventory() {
  const inventoryStore = useInventoryStore()

  /** 加载库存列表 */
  const loadInventory = (params) => inventoryStore.fetchInventoryList(params)

  /** 加载预警列表 */
  const loadAlerts = () => inventoryStore.fetchAlerts()

  /** 加载出入库记录 */
  const loadRecords = (params) => inventoryStore.fetchRecordList(params)

  /**
   * 物资入库
   * @param {{ goodsId: number|string, quantity: number, remark?: string }} data
   */
  const stockIn = async (data) => {
    await inventoryStore.doStockIn(data)
    ElMessage.success('入库成功')
  }

  /**
   * 物资出库
   * @param {{ goodsId: number|string, quantity: number, remark?: string }} data
   */
  const stockOut = async (data) => {
    await inventoryStore.doStockOut(data)
    ElMessage.success('出库成功')
  }

  /**
   * 库存盘点
   * @param {{ goodsId: number|string, actualQuantity: number, remark?: string }} data
   */
  const stockCheck = async (data) => {
    await inventoryStore.doStockCheck(data)
    ElMessage.success('盘点完成')
  }

  return {
    inventoryList: inventoryStore.inventoryList,
    inventoryTotal: inventoryStore.inventoryTotal,
    inventoryLoading: inventoryStore.inventoryLoading,
    alerts: inventoryStore.alerts,
    alertsLoading: inventoryStore.alertsLoading,
    records: inventoryStore.records,
    recordsTotal: inventoryStore.recordsTotal,
    recordsLoading: inventoryStore.recordsLoading,
    inventoryQuery: inventoryStore.inventoryQuery,
    recordQuery: inventoryStore.recordQuery,
    loadInventory,
    loadAlerts,
    loadRecords,
    stockIn,
    stockOut,
    stockCheck,
  }
}
