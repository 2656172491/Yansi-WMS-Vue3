// src/api/user.js — 用户管理 API（当前使用 Mock 数据）
// 后端集成时：取消每个函数内的注释行，删除 mock 实现，即可切换到真实请求。

import request from '@/utils/request.js'

/** Mock 用户列表（运行时可写副本） */
let users = [
  {
    id: 1,
    username: 'admin',
    realName: '系统管理员',
    role: '管理员',
    phone: '13800000001',
    email: 'admin@wms.com',
    status: '启用',
    lastLogin: '2026-03-27 09:18',
  },
  {
    id: 2,
    username: 'warehouse01',
    realName: '张三',
    role: '仓管员',
    phone: '13800000002',
    email: 'zhangsan@wms.com',
    status: '启用',
    lastLogin: '2026-03-27 10:15',
  },
  {
    id: 3,
    username: 'warehouse02',
    realName: '李四',
    role: '仓管员',
    phone: '13800000003',
    email: 'lisi@wms.com',
    status: '禁用',
    lastLogin: '2026-03-26 16:30',
  },
  {
    id: 4,
    username: 'user01',
    realName: '王五',
    role: '普通用户',
    phone: '13800000004',
    email: 'wangwu@wms.com',
    status: '启用',
    lastLogin: '2026-03-27 11:20',
  },
]
let nextUserId = Math.max(...users.map((u) => u.id)) + 1

// ===================== 用户查询 =====================

/**
 * 分页查询用户列表
 * 接口：GET /api/user/list
 * @param {{ page?: number, pageSize?: number, username?: string, role?: string, status?: string }} params
 * @returns {Promise<{ records: object[], total: number, page: number, pageSize: number }>}
 *   - records[]: { id, username, realName, role, phone, email, status, lastLogin }
 */
export function getUserList(params = {}) {
  // 后端就绪后替换为：return request.get('/user/list', { params })
  return new Promise((resolve) => {
    setTimeout(() => {
      let list = [...users]
      if (params.username) list = list.filter((u) => u.username.includes(params.username))
      if (params.role) list = list.filter((u) => u.role === params.role)
      if (params.status) list = list.filter((u) => u.status === params.status)
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const total = list.length
      const records = list.slice((page - 1) * pageSize, page * pageSize)
      resolve({ code: 200, msg: '获取成功', data: { records, total, page, pageSize } })
    }, 300)
  })
}

/**
 * 根据 ID 获取用户详情
 * 接口：GET /api/user/:id
 * @param {number} id
 * @returns {Promise<object>} 用户信息对象（字段同列表中的 records 项）
 */
export function getUserById(id) {
  // 后端就绪后替换为：return request.get(`/user/${id}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = users.find((u) => u.id === id)
      if (item) {
        resolve({ code: 200, msg: '获取成功', data: { ...item } })
      } else {
        reject(new Error('用户不存在'))
      }
    }, 200)
  })
}

// ===================== 用户 CRUD =====================

/**
 * 新增用户
 * 接口：POST /api/user
 * @param {{ username: string, realName: string, role: string, phone: string, email: string, status: string }} data
 * @returns {Promise<object>} 新创建的用户对象（含服务端生成的 id）
 */
export function addUser(data) {
  // 后端就绪后替换为：return request.post('/user', data)
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = {
        ...data,
        id: nextUserId++,
        lastLogin: '-',
      }
      users.unshift(item)
      resolve({ code: 200, msg: '新增成功', data: item })
    }, 400)
  })
}

/**
 * 修改用户信息
 * 接口：PUT /api/user/:id
 * @param {object} data — 必须含 id，其余字段同新增
 * @returns {Promise<object>} 更新后的用户对象
 */
export function updateUser(data) {
  // 后端就绪后替换为：return request.put(`/user/${data.id}`, data)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = users.findIndex((u) => u.id === data.id)
      if (index === -1) {
        reject(new Error('用户不存在'))
        return
      }
      users[index] = { ...users[index], ...data }
      resolve({ code: 200, msg: '修改成功', data: users[index] })
    }, 400)
  })
}

/**
 * 删除用户
 * 接口：DELETE /api/user/:id
 * @param {number} id
 * @returns {Promise<null>}
 */
export function deleteUser(id) {
  // 后端就绪后替换为：return request.delete(`/user/${id}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = users.findIndex((u) => u.id === id)
      if (index === -1) {
        reject(new Error('用户不存在'))
        return
      }
      users.splice(index, 1)
      resolve({ code: 200, msg: '删除成功' })
    }, 300)
  })
}

// ===================== 用户状态与密码 =====================

/**
 * 启用或禁用用户
 * 接口：PUT /api/user/:id/status
 * @param {number} id
 * @param {'启用' | '禁用'} status
 * @returns {Promise<null>}
 */
export function updateUserStatus(id, status) {
  // 后端就绪后替换为：return request.put(`/user/${id}/status`, { status })
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = users.find((u) => u.id === id)
      if (!item) {
        reject(new Error('用户不存在'))
        return
      }
      item.status = status
      resolve({ code: 200, msg: '状态更新成功' })
    }, 300)
  })
}

/**
 * 重置用户密码
 * 接口：PUT /api/user/:id/password
 * @param {number} id — 用户 ID
 * @param {string} newPassword — 新密码（明文，后端应加密存储）
 * @returns {Promise<null>}
 */
export function resetUserPassword(id, newPassword) {
  // 后端就绪后替换为：return request.put(`/user/${id}/password`, { newPassword })
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = users.find((u) => u.id === id)
      if (!item) {
        reject(new Error('用户不存在'))
        return
      }
      resolve({ code: 200, msg: '密码重置成功' })
    }, 400)
  })
}
