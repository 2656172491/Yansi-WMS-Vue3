// src/api/config.js — 系统参数配置 API（当前使用 Mock 数据）
// 后端集成时：将函数体替换为 request.get/post 调用，删除 mock 逻辑即可。

/** Mock 系统默认配置（与 Config.vue 中的 defaultForm 保持一致） */
const DEFAULT_CONFIG = {
  systemName: 'Yansi WMS',
  systemShortName: '仓库管理系统',
  version: 'v1.0.0',
  phone: '13800000000',
  email: 'admin@wms.com',
  copyright: '© 2026 Yansi WMS',
  defaultWarehouse: '主仓库',
  warningThreshold: 10,
  minStockAlert: 5,
  dataRetentionDays: 90,
  checkCycleDays: 7,
  allowNegativeStock: false,
  enableApproval: true,
  enableAutoCheckReminder: true,
  loginFailLimit: 5,
  passwordExpireDays: 90,
  logRetentionDays: 180,
  enableTwoFactor: false,
  passwordPolicy: '中等',
  notifyInApp: true,
  notifyEmail: false,
  notifySms: false,
  notifyReceiver: '管理员',
}

/** 运行时可写配置副本 */
let currentConfig = { ...DEFAULT_CONFIG }

// ===================== 系统参数 =====================

/**
 * 获取系统参数配置
 * @returns {Promise<object>} 完整的系统配置对象，包含基础信息、仓库参数、安全设置、通知设置等字段
 */
export function getSystemConfig() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '获取成功', data: { ...currentConfig } })
    }, 300)
  })
}

/**
 * 保存系统参数配置
 * @param {object} data — 完整或部分配置对象（字段同 getSystemConfig 返回值）
 * @returns {Promise<null>}
 */
export function saveSystemConfig(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      Object.assign(currentConfig, data)
      // TODO: 后端集成时发送 POST /api/config 并持久化到数据库
      resolve({ code: 200, msg: '保存成功' })
    }, 400)
  })
}

/**
 * 恢复系统参数为默认值
 * @returns {Promise<object>} 恢复后的默认配置对象
 */
export function resetSystemConfig() {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentConfig = { ...DEFAULT_CONFIG }
      // TODO: 后端集成时发送 POST /api/config/reset
      resolve({ code: 200, msg: '已恢复默认配置', data: { ...currentConfig } })
    }, 400)
  })
}
