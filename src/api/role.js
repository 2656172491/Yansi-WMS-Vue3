// src/api/role.js — 角色管理 API（当前使用 Mock 数据）
// 后端集成时：将函数体替换为 request.get/post/put/delete 调用，删除 mock 逻辑即可。

/** Mock 角色列表（运行时可写副本） */
let roles = [
  {
    id: 1,
    name: '管理员',
    code: 'ADMIN',
    desc: '拥有系统全部权限',
    permissionCount: 18,
    status: '启用',
    createTime: '2026-03-20 09:00',
    permissions: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    id: 2,
    name: '仓管员',
    code: 'WAREHOUSE',
    desc: '负责库存、入库、出库、盘点等操作',
    permissionCount: 10,
    status: '启用',
    createTime: '2026-03-21 10:30',
    permissions: [2, 3, 4, 5],
  },
  {
    id: 3,
    name: '普通用户',
    code: 'USER',
    desc: '仅可查看基础信息',
    permissionCount: 4,
    status: '启用',
    createTime: '2026-03-22 14:10',
    permissions: [1],
  },
  {
    id: 4,
    name: '审计员',
    code: 'AUDITOR',
    desc: '负责查看操作日志与审计信息',
    permissionCount: 6,
    status: '禁用',
    createTime: '2026-03-23 16:40',
    permissions: [6, 7],
  },
]
let nextRoleId = Math.max(...roles.map((r) => r.id)) + 1

/** 系统权限树（与 Roles.vue 保持一致） */
const PERMISSION_TREE = [
  { id: 1, label: '首页' },
  {
    id: 2,
    label: '物资管理',
    children: [{ id: 21, label: '物资列表' }],
  },
  {
    id: 3,
    label: '库存管理',
    children: [
      { id: 31, label: '库存列表' },
      { id: 32, label: '入库管理' },
      { id: 33, label: '出库管理' },
      { id: 34, label: '库存盘点' },
    ],
  },
  {
    id: 4,
    label: '系统设置',
    children: [
      { id: 41, label: '用户管理' },
      { id: 42, label: '角色管理' },
      { id: 43, label: '仓库管理' },
      { id: 44, label: '系统参数' },
      { id: 45, label: '操作日志' },
    ],
  },
]

// ===================== 角色查询 =====================

/**
 * 分页查询角色列表
 * @param {{ page?: number, pageSize?: number, name?: string, status?: string }} params
 * @returns {Promise<{ records: object[], total: number, page: number, pageSize: number }>}
 */
export function getRoleList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let list = [...roles]
      if (params.name) list = list.filter((r) => r.name.includes(params.name))
      if (params.status) list = list.filter((r) => r.status === params.status)
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const total = list.length
      const records = list.slice((page - 1) * pageSize, page * pageSize)
      resolve({ code: 200, msg: '获取成功', data: { records, total, page, pageSize } })
    }, 300)
  })
}

/**
 * 根据 ID 获取角色详情（含已分配权限列表）
 * @param {number} id
 * @returns {Promise<object>} 角色详情，含 permissions 数组（权限节点 ID 列表）
 */
export function getRoleById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = roles.find((r) => r.id === id)
      if (item) {
        resolve({ code: 200, msg: '获取成功', data: { ...item } })
      } else {
        reject(new Error('角色不存在'))
      }
    }, 200)
  })
}

// ===================== 角色 CRUD =====================

/**
 * 新增角色
 * @param {{ name: string, code: string, desc?: string, status: string }} data
 * @returns {Promise<object>} 新创建的角色对象
 */
export function addRole(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = {
        ...data,
        id: nextRoleId++,
        permissionCount: 0,
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
        permissions: [],
      }
      roles.unshift(item)
      resolve({ code: 200, msg: '新增成功', data: item })
    }, 400)
  })
}

/**
 * 修改角色信息
 * @param {object} data — 必须含 id
 * @returns {Promise<object>} 更新后的角色对象
 */
export function updateRole(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = roles.findIndex((r) => r.id === data.id)
      if (index === -1) {
        reject(new Error('角色不存在'))
        return
      }
      roles[index] = { ...roles[index], ...data }
      resolve({ code: 200, msg: '修改成功', data: roles[index] })
    }, 400)
  })
}

/**
 * 删除角色
 * @param {number} id
 * @returns {Promise<null>}
 */
export function deleteRole(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = roles.findIndex((r) => r.id === id)
      if (index === -1) {
        reject(new Error('角色不存在'))
        return
      }
      roles.splice(index, 1)
      resolve({ code: 200, msg: '删除成功' })
    }, 300)
  })
}

// ===================== 权限管理 =====================

/**
 * 获取系统权限树（用于角色授权弹窗）
 * @returns {Promise<object[]>} 树形权限节点列表，每个节点含 id、label、children
 */
export function getPermissionTree() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '获取成功', data: PERMISSION_TREE })
    }, 200)
  })
}

/**
 * 保存角色权限（覆盖已有权限）
 * @param {number} roleId — 角色 ID
 * @param {number[]} permissionIds — 勾选的权限节点 ID 数组（含半选父节点）
 * @returns {Promise<null>}
 */
export function saveRolePermissions(roleId, permissionIds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = roles.find((r) => r.id === roleId)
      if (!item) {
        reject(new Error('角色不存在'))
        return
      }
      item.permissions = [...permissionIds]
      item.permissionCount = permissionIds.length
      // TODO: 后端集成时发送 PUT /api/role/{roleId}/permissions
      resolve({ code: 200, msg: '权限保存成功' })
    }, 400)
  })
}
