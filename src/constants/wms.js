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