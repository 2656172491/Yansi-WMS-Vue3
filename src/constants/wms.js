// src/constants/wms.js — WMS 全局常量配置

/** 商品分类选项 */
export const CATEGORIES = [
  { label: '电子产品', value: '电子产品' },
  { label: '家居用品', value: '家居用品' },
  { label: '办公耗材', value: '办公耗材' },
]

/** 物资状态 */
export const GOODS_STATUS = {
  ENABLED: 1,
  DISABLED: 0,
}

/** 出入库类型 */
export const RECORD_TYPE = {
  IN: 1,
  OUT: 2,
}

/** 订单状态 */
export const ORDER_STATUS = {
  PENDING: { value: 'pending', label: '待处理', type: 'info' },
  PROCESSING: { value: 'processing', label: '处理中', type: 'warning' },
  SHIPPED: { value: 'shipped', label: '已发货', type: 'primary' },
  COMPLETED: { value: 'completed', label: '已完成', type: 'success' },
  CANCELLED: { value: 'cancelled', label: '已取消', type: 'danger' },
}

/** 库存预警状态 */
export const INVENTORY_STATUS = {
  NORMAL: { value: 'normal', label: '正常', type: 'success' },
  LOW: { value: 'low', label: '库存不足', type: 'warning' },
  HIGH: { value: 'high', label: '库存过多', type: 'info' },
  OUT: { value: 'out', label: '缺货', type: 'danger' },
  OVERSTOCKED: { value: 'overstocked', label: '积压', type: 'info' },
}

/** 出入库操作类型 */
export const OPERATION_TYPES = {
  IN: { value: 'in', label: '入库', icon: 'Download' },
  OUT: { value: 'out', label: '出库', icon: 'Upload' },
  CHECK: { value: 'check', label: '盘点', icon: 'DataAnalysis' },
  TRANSFER: { value: 'transfer', label: '调拨', icon: 'Sort' },
  RETURN: { value: 'return', label: '退库', icon: 'RefreshLeft' },
}

/** 分页默认值 */
export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 10

/** 面包屑导航映射 */
export const MENU_BREADCRUMB_MAP = {
  dashboard: '工作台',
  'stock-list': '库存列表',
  'stock-check': '库存盘点',
  inbound: '入库管理',
  outbound: '出库管理',
  settings: '系统设置',
}

/** 统计卡片配置 */
export const STAT_CARDS_CONFIG = [
  { title: '总商品数', value: '1240', icon: 'Goods', colorClass: 'bg-blue-100 text-blue-500' },
  { title: '今日入库', value: '86', icon: 'Download', colorClass: 'bg-green-100 text-green-500' },
  { title: '今日出库', value: '52', icon: 'Upload', colorClass: 'bg-orange-100 text-orange-500' },
  { title: '库存预警', value: '18', icon: 'Warning', colorClass: 'bg-red-100 text-red-500' },
]

/** 预警数据（Mock） */
export const MOCK_ALERTS = [
  { id: 1, type: 'danger', tag: '预警', content: '笔记本电脑库存不足（剩余15）', time: '10分钟前' },
  { id: 2, type: 'warning', tag: '提醒', content: '采购订单 #PO20260320 待审核', time: '1小时前' },
  { id: 3, type: 'success', tag: '完成', content: '出库单 #OUT20260324 已完成', time: '2小时前' },
]

/** 商品表格初始数据（Mock） */
export const MOCK_TABLE_DATA = [
  { id: 1, name: '笔记本电脑', sku: 'SKU-001', category: '电子产品', price: 4999, stock: 15, status: true, image: 'https://via.placeholder.com/40' },
  { id: 2, name: '办公椅', sku: 'SKU-002', category: '家居用品', price: 299, stock: 68, status: true, image: 'https://via.placeholder.com/40' },
  { id: 3, name: 'A4打印纸', sku: 'SKU-003', category: '办公耗材', price: 59.9, stock: 200, status: true, image: 'https://via.placeholder.com/40' },
]