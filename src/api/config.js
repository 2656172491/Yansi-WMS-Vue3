// src/api/config.js — 系统参数配置 API（当前使用 Mock 数据）
// 后端集成时：取消每个函数内的注释行，删除 mock 实现，即可切换到真实请求。

import request from '@/utils/request.js'

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
 * 接口：GET /api/config
 * @returns {Promise<object>} 完整配置对象，包含：
 *   基础信息: systemName, systemShortName, version, phone, email, copyright
 *   仓库参数: defaultWarehouse, warningThreshold, minStockAlert, dataRetentionDays, checkCycleDays,
 *             allowNegativeStock, enableApproval, enableAutoCheckReminder
 *   安全设置: loginFailLimit, passwordExpireDays, logRetentionDays, enableTwoFactor, passwordPolicy
 *   通知设置: notifyInApp, notifyEmail, notifySms, notifyReceiver
 */
export function getSystemConfig() {
  // 后端就绪后替换为：return request.get('/config')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '获取成功', data: { ...currentConfig } })
    }, 300)
  })
}

/**
 * 保存系统参数配置
 * 接口：POST /api/config
 * @param {object} data — 完整或部分配置对象（字段同 getSystemConfig 返回值）
 * @returns {Promise<null>}
 */
export function saveSystemConfig(data) {
  // 后端就绪后替换为：return request.post('/config', data)
  return new Promise((resolve) => {
    setTimeout(() => {
      Object.assign(currentConfig, data)
      resolve({ code: 200, msg: '保存成功' })
    }, 400)
  })
}

/**
 * 恢复系统参数为默认值
 * 接口：POST /api/config/reset
 * @returns {Promise<object>} 恢复后的默认配置对象（字段同 getSystemConfig 返回值）
 */
export function resetSystemConfig() {
  // 后端就绪后替换为：return request.post('/config/reset')
  return new Promise((resolve) => {
    setTimeout(() => {
      currentConfig = { ...DEFAULT_CONFIG }
      resolve({ code: 200, msg: '已恢复默认配置', data: { ...currentConfig } })
    }, 400)
  })
}
