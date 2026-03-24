// src/constants/wms.js — WMS 全局常量与 Mock 数据配置

// ===================== 分类选项（对应 wms_category 表）=====================
export const MOCK_CATEGORIES = [
  { id: 1, name: '电子产品', code: 'ELECTRONICS', sort: 1 },
  { id: 2, name: '办公用品', code: 'OFFICE', sort: 2 },
  { id: 3, name: '机械设备', code: 'MACHINERY', sort: 3 },
]

/** 分类 id -> 名称 映射 */
export const CATEGORY_MAP = Object.fromEntries(
  MOCK_CATEGORIES.map((c) => [c.id, c.name]),
)

/** 下拉选项格式 */
export const CATEGORY_OPTIONS = MOCK_CATEGORIES.map((c) => ({
  label: c.name,
  value: c.id,
}))

// ===================== 物资数据（对应 wms_goods 表）=====================
export const MOCK_GOODS = [
  {
    id: 1, name: '笔记本电脑', code: 'GOODS-001', category_id: 1,
    specification: '15.6寸/16GB/512GB', unit: '台', price: 4999.00,
    min_stock: 10, max_stock: 100, status: 1,
    create_time: '2025-01-01 09:00:00',
  },
  {
    id: 2, name: '打印机', code: 'GOODS-002', category_id: 1,
    specification: '激光/彩色', unit: '台', price: 1299.00,
    min_stock: 5, max_stock: 50, status: 1,
    create_time: '2025-01-02 09:00:00',
  },
  {
    id: 3, name: 'A4打印纸', code: 'GOODS-003', category_id: 2,
    specification: '80g/500张/包', unit: '包', price: 28.50,
    min_stock: 100, max_stock: 2000, status: 1,
    create_time: '2025-01-03 09:00:00',
  },
  {
    id: 4, name: '办公椅', code: 'GOODS-004', category_id: 2,
    specification: '人体工学/可升降', unit: '把', price: 599.00,
    min_stock: 20, max_stock: 200, status: 1,
    create_time: '2025-01-04 09:00:00',
  },
  {
    id: 5, name: '液压搬运车', code: 'GOODS-005', category_id: 3,
    specification: '2吨/手动', unit: '台', price: 2200.00,
    min_stock: 2, max_stock: 20, status: 1,
    create_time: '2025-01-05 09:00:00',
  },
]

// ===================== 库存数据（对应 wms_inventory 表）=====================
export const MOCK_INVENTORY = [
  { id: 1, goods_id: 1, goods_name: '笔记本电脑', goods_code: 'GOODS-001', category_id: 1, unit: '台', warehouse_id: 1, quantity: 15 },
  { id: 2, goods_id: 2, goods_name: '打印机',     goods_code: 'GOODS-002', category_id: 1, unit: '台', warehouse_id: 1, quantity: 8  },
  { id: 3, goods_id: 3, goods_name: 'A4打印纸',   goods_code: 'GOODS-003', category_id: 2, unit: '包', warehouse_id: 1, quantity: 320 },
  { id: 4, goods_id: 4, goods_name: '办公椅',     goods_code: 'GOODS-004', category_id: 2, unit: '把', warehouse_id: 1, quantity: 45 },
  { id: 5, goods_id: 5, goods_name: '液压搬运车', goods_code: 'GOODS-005', category_id: 3, unit: '台', warehouse_id: 1, quantity: 3  },
]

// ===================== 出入库记录（对应 wms_record 表）=====================
export const MOCK_RECORDS = [
  { id: 1, goods_id: 1, goods_name: '笔记本电脑', type: 1, quantity: 20, before_quantity: 0,  after_quantity: 20,  operator: 'admin', remark: '首次入库',   create_time: '2025-01-10 10:00:00' },
  { id: 2, goods_id: 1, goods_name: '笔记本电脑', type: 2, quantity: 5,  before_quantity: 20, after_quantity: 15,  operator: 'admin', remark: '领用出库',   create_time: '2025-02-01 14:00:00' },
  { id: 3, goods_id: 3, goods_name: 'A4打印纸',   type: 1, quantity: 500, before_quantity: 0, after_quantity: 500, operator: 'admin', remark: '采购入库',   create_time: '2025-02-05 09:30:00' },
  { id: 4, goods_id: 3, goods_name: 'A4打印纸',   type: 2, quantity: 180, before_quantity: 500, after_quantity: 320, operator: 'admin', remark: '日常消耗', create_time: '2025-03-01 11:00:00' },
  { id: 5, goods_id: 2, goods_name: '打印机',     type: 1, quantity: 10, before_quantity: 0, after_quantity: 10,  operator: 'admin', remark: '新购入库',   create_time: '2025-03-10 08:00:00' },
  { id: 6, goods_id: 2, goods_name: '打印机',     type: 2, quantity: 2,  before_quantity: 10, after_quantity: 8,   operator: 'admin', remark: '部门领用',  create_time: '2025-03-15 15:30:00' },
]

// ===================== 统计概览数据 =====================
export const MOCK_OVERVIEW = {
  totalGoods: 5,
  totalInventory: 391,
  todayInbound: 86,
  todayOutbound: 52,
  warningCount: 2,   // 笔记本电脑 & 液压搬运车低于最小库存
}

// ===================== 出入库趋势（近7天 Mock）=====================
export const MOCK_TREND_WEEK = {
  dates: ['03-18', '03-19', '03-20', '03-21', '03-22', '03-23', '03-24'],
  inbound:  [30, 45, 28, 60, 35, 50, 86],
  outbound: [20, 38, 22, 45, 28, 40, 52],
}

export const MOCK_TREND_MONTH = {
  dates: ['03-01','03-05','03-10','03-15','03-20','03-24'],
  inbound:  [120, 200, 180, 150, 220, 86],
  outbound: [90, 160, 130, 120, 180, 52],
}

// ===================== 分类占比（统计用）=====================
export const MOCK_CATEGORY_STATS = [
  { name: '电子产品', value: 23 },
  { name: '办公用品', value: 365 },
  { name: '机械设备', value: 3 },
]

// ===================== 统计卡片配置（Dashboard 展示）=====================
export const STAT_CARDS_CONFIG = [
  { title: '物资总数',   value: '5',   icon: 'Goods',   colorClass: 'bg-blue-100 text-blue-500'   },
  { title: '今日入库',   value: '86',  icon: 'Download', colorClass: 'bg-green-100 text-green-500' },
  { title: '今日出库',   value: '52',  icon: 'Upload',  colorClass: 'bg-orange-100 text-orange-500'},
  { title: '库存预警',   value: '2',   icon: 'Warning', colorClass: 'bg-red-100 text-red-500'     },
]

// ===================== 预警信息（Dashboard Mock）=====================
export const MOCK_ALERTS = [
  { id: 1, type: 'danger',  tag: '预警', content: '笔记本电脑库存不足（剩余15，最低10）', time: '10分钟前' },
  { id: 2, type: 'danger',  tag: '预警', content: '液压搬运车库存不足（剩余3，最低2）',  time: '30分钟前' },
  { id: 3, type: 'success', tag: '完成', content: '出库单 #OUT-20260324 已完成',         time: '2小时前'  },
]

// ===================== 旧版商品表格（兼容现有 StockList / ProductsTable）=====================
export const MOCK_TABLE_DATA = MOCK_INVENTORY.map((inv) => ({
  id: inv.goods_id,
  name: inv.goods_name,
  sku: inv.goods_code,
  category: (() => CATEGORY_MAP[inv.category_id] || '')(),
  price: (MOCK_GOODS.find((g) => g.id === inv.goods_id)?.price ?? 0),
  stock: inv.quantity,
  status: true,
  image: 'https://via.placeholder.com/40',
}))

/** 商品分类选项（旧版兼容，label/value 均为字符串） */
export const CATEGORIES = MOCK_CATEGORIES.map((c) => ({
  label: c.name,
  value: c.name,
}))

/** 面包屑导航映射 */
export const MENU_BREADCRUMB_MAP = {
  dashboard:      '统计概览',
  goods:          '物资管理',
  'goods-list':   '物资列表',
  'goods-add':    '新增物资',
  'inventory':    '库存管理',
  'inv-list':     '库存列表',
  'inv-inbound':  '入库管理',
  'inv-outbound': '出库管理',
  'stock-check':  '库存盘点',
  settings:       '系统设置',
}
