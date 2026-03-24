export const CATEGORIES = [
  { label: '电子产品', value: 'elec' },
  { label: '家居用品', value: 'home' },
  { label: '办公耗材', value: 'office' },
];

export const MENU_ITEMS = [
  { index: 'dashboard', label: '工作台', icon: 'Odometer' },
  { index: 'inventory', label: '库存管理', icon: 'Goods', children: true },
  { index: 'stock-list', label: '库存列表', parent: 'inventory' },
  { index: 'stock-check', label: '库存盘点', parent: 'inventory' },
  { index: 'inbound', label: '入库管理', icon: 'Download' },
  { index: 'outbound', label: '出库管理', icon: 'Upload' },
  { index: 'settings', label: '系统设置', icon: 'Setting' },
];

export const ALERT_TYPES = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
};

export const STAT_CARDS = [
  {
    title: '总库存',
    value: 0,
    icon: 'Goods',
    colorClass: 'bg-blue-100 text-blue-600',
  },
  {
    title: '入库单',
    value: 0,
    icon: 'Download',
    colorClass: 'bg-green-100 text-green-600',
  },
  {
    title: '出库单',
    value: 0,
    icon: 'Upload',
    colorClass: 'bg-orange-100 text-orange-600',
  },
  {
    title: '预警商品',
    value: 0,
    icon: 'Warning',
    colorClass: 'bg-red-100 text-red-600',
  },
];