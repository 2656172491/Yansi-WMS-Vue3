// src/api/log.js — 操作日志 API（当前使用 Mock 数据）
// 后端集成时：取消每个函数内的注释行，删除 mock 实现，即可切换到真实请求。

import request from '@/utils/request.js'

/** Mock 日志列表（运行时可写副本） */
let logs = [
  {
    id: 1,
    time: '2026-03-27 09:18:22',
    operator: '管理员',
    type: 'login',
    typeLabel: '登录',
    module: '系统登录',
    content: '管理员登录了系统',
    ip: '192.168.1.10',
    success: true,
  },
  {
    id: 2,
    time: '2026-03-27 09:30:10',
    operator: '管理员',
    type: 'inventory',
    typeLabel: '出入库',
    module: '入库管理',
    content: '新增了 1 条入库记录，物资：笔记本电脑',
    ip: '192.168.1.10',
    success: true,
  },
  {
    id: 3,
    time: '2026-03-27 10:05:33',
    operator: '张三',
    type: 'check',
    typeLabel: '盘点',
    module: '库存盘点',
    content: '完成了库存盘点单 CK20260327001',
    ip: '192.168.1.22',
    success: true,
  },
  {
    id: 4,
    time: '2026-03-27 10:20:45',
    operator: '李四',
    type: 'update',
    typeLabel: '修改',
    module: '物资管理',
    content: '修改了物资【A4打印纸】的库存预警值',
    ip: '192.168.1.31',
    success: true,
  },
  {
    id: 5,
    time: '2026-03-27 11:02:11',
    operator: '系统',
    type: 'delete',
    typeLabel: '删除',
    module: '操作日志',
    content: '清理了 30 天前的历史日志',
    ip: '127.0.0.1',
    success: true,
  },
  {
    id: 6,
    time: '2026-03-27 11:40:00',
    operator: '管理员',
    type: 'inventory',
    typeLabel: '出入库',
    module: '出库管理',
    content: '出库失败：库存不足',
    ip: '192.168.1.10',
    success: false,
  },
]
let nextLogId = Math.max(...logs.map((l) => l.id)) + 1

// ===================== 日志查询 =====================

/**
 * 分页查询操作日志列表
 * 接口：GET /api/log/list
 * @param {{ page?: number, pageSize?: number, operator?: string, type?: string, startDate?: string, endDate?: string }} params
 *   - type: 'login' | 'create' | 'update' | 'delete' | 'check' | 'inventory'
 *   - startDate / endDate: 'YYYY-MM-DD' 格式的日期字符串
 * @returns {Promise<{ records: object[], total: number, page: number, pageSize: number }>}
 *   - records[]: { id, time, operator, type, typeLabel, module, content, ip, success }
 */
export function getLogList(params = {}) {
  // 后端就绪后替换为：return request.get('/log/list', { params })
  return new Promise((resolve) => {
    setTimeout(() => {
      let list = [...logs]
      if (params.operator) list = list.filter((l) => l.operator.includes(params.operator))
      if (params.type) list = list.filter((l) => l.type === params.type)
      if (params.startDate) list = list.filter((l) => l.time.slice(0, 10) >= params.startDate)
      if (params.endDate) list = list.filter((l) => l.time.slice(0, 10) <= params.endDate)
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const total = list.length
      const records = list.slice((page - 1) * pageSize, page * pageSize)
      resolve({ code: 200, msg: '获取成功', data: { records, total, page, pageSize } })
    }, 300)
  })
}

/**
 * 根据 ID 获取日志详情
 * 接口：GET /api/log/:id
 * @param {number} id
 * @returns {Promise<object>} 日志详情，包含 time、operator、type、typeLabel、module、content、ip、success 等字段
 */
export function getLogById(id) {
  // 后端就绪后替换为：return request.get(`/log/${id}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = logs.find((l) => l.id === id)
      if (item) {
        resolve({ code: 200, msg: '获取成功', data: { ...item } })
      } else {
        reject(new Error('日志不存在'))
      }
    }, 200)
  })
}

// ===================== 日志导出与清理 =====================

/**
 * 导出操作日志（触发文件下载）
 * 接口：GET /api/log/export
 * @param {{ operator?: string, type?: string, startDate?: string, endDate?: string }} params — 与 getLogList 相同的筛选条件
 * @returns {Promise<null>}
 * 后端集成时：使用 request.get('/log/export', { params, responseType: 'blob' }) 接收文件流，
 *   再通过 URL.createObjectURL 触发浏览器下载。
 */
export function exportLogs(params = {}) {
  // 后端就绪后替换为：return request.get('/log/export', { params, responseType: 'blob' })
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '导出成功' })
    }, 600)
  })
}

/**
 * 按时间范围批量删除日志
 * 接口：DELETE /api/log
 * @param {{ startDate: string, endDate: string }} params — 'YYYY-MM-DD' 格式的起止日期（含边界）
 * @returns {Promise<{ deletedCount: number }>} 返回实际删除的条数
 */
export function deleteLogsByRange(params) {
  // 后端就绪后替换为：return request.delete('/log', { data: params })
  return new Promise((resolve) => {
    setTimeout(() => {
      const before = logs.length
      logs = logs.filter((l) => {
        const date = l.time.slice(0, 10)
        return date < params.startDate || date > params.endDate
      })
      const deletedCount = before - logs.length
      resolve({ code: 200, msg: `已删除 ${deletedCount} 条日志`, data: { deletedCount } })
    }, 400)
  })
}
