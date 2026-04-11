<template>
  <div class="users-page">
    <!-- 搜索区域 -->
    <el-card class="filter-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-tag type="info" effect="light">系统账户</el-tag>
        </div>
      </template>

      <el-form :inline="true" :model="queryForm" class="filter-form">
        <el-form-item label="用户名">
          <el-input
              v-model="queryForm.username"
              placeholder="请输入用户名"
              clearable
              class="filter-input"
          />
        </el-form-item>

        <el-form-item label="角色">
          <el-select
              v-model="queryForm.roleId"
              placeholder="请选择角色"
              clearable
              class="filter-input"
          >
            <el-option
                v-for="item in roleOptions"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
              v-model="queryForm.status"
              placeholder="请选择状态"
              clearable
              class="filter-input"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          <el-button type="success" :icon="Plus" @click="openDialog('add')">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="summary-row">
      <el-col :xs="12" :sm="12" :md="6" v-for="item in summaryCards" :key="item.title">
        <el-card class="summary-card" shadow="hover">
          <div class="summary-box">
            <div class="summary-icon" :class="item.colorClass">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="summary-info">
              <div class="summary-title">{{ item.title }}</div>
              <div class="summary-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <span class="table-tip">共 {{ total }} 条数据</span>
        </div>
      </template>

      <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="username" label="用户名" width="140" />
        <el-table-column prop="realName" label="姓名" width="120" />

        <el-table-column prop="roleName" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleTag(row.roleName)" effect="light" size="small">
              {{ row.roleName || '-' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="employeeNo" label="员工ID" width="120" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="email" label="邮箱" min-width="180" />

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" effect="light" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="lastLoginTime" label="最后登录" width="170">
          <template #default="{ row }">
            {{ row.lastLoginTime || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDialog('edit', row)">编辑</el-button>
            <el-button type="warning" link @click="toggleStatus(row)">
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
        width="560px"
    >
      <el-form :model="formData" label-width="90px">
        <el-form-item label="用户名">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item v-if="dialogType === 'add'" label="密码">
          <el-input
              v-model="formData.password"
              placeholder="请输入密码"
              show-password
          />
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="formData.realName" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="员工ID">
          <el-input v-model="formData.employeeNo" placeholder="请输入员工ID" />
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="formData.roleId" placeholder="请选择角色" style="width: 100%">
            <el-option
                v-for="item in roleOptions"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="头像URL">
          <el-input v-model="formData.avatar" placeholder="请输入头像URL（可选）" />
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
              v-model="formData.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  Search,
  Refresh,
  Plus,
  UserFilled,
  Avatar,
  Stamp,
  CircleCheck
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  getUserStats,
  getRoleList,
  getRoleById
} from '@/api/api.js'

const loading = ref(false)
const saving = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const roleOptions = ref([])

const queryForm = reactive({
  username: '',
  roleId: '',
  status: ''
})

// 统计数据
const stats = reactive({
  total: 0,
  enabled: 0,
  admin: 0,
  storekeeper: 0
})

const loadUsers = async () => {
  loading.value = true
  try {
    const params = {
      username: queryForm.username || '',
      roleId: queryForm.roleId || '',
      status: queryForm.status === '' ? '' : queryForm.status,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    const res = await getUsers(params)
    const rows = res.data?.rows || []
    total.value = res.data?.total || 0

    tableData.value = await Promise.all(
        rows.map(async (item) => {
          let roleName = item.roleName || ''
          if (!roleName && item.roleId) {
            try {
              const roleRes = await getRoleById(item.roleId)
              roleName = roleRes.data?.roleName || '未知角色'
            } catch (e) {
              roleName = '未知角色'
            }
          }

          return {
            ...item,
            roleName
          }
        })
    )
  } catch (err) {
    tableData.value = []
    total.value = 0
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const res = await getUserStats()
    stats.total = res.data?.total || 0
    stats.enabled = res.data?.enabled || 0
    stats.admin = res.data?.admin || 0
    stats.storekeeper = res.data?.storekeeper || 0
  } catch (err) {
    stats.total = 0
    stats.enabled = 0
    stats.admin = 0
    stats.storekeeper = 0
  }
}

const loadRoles = async () => {
  try {
    const res = await getRoleList()
    roleOptions.value = res.data || []
  } catch (err) {
    roleOptions.value = []
  }
}

const summaryCards = computed(() => [
  {
    title: '总用户数',
    value: stats.total,
    icon: UserFilled,
    colorClass: 'blue'
  },
  {
    title: '启用用户',
    value: stats.enabled,
    icon: CircleCheck,
    colorClass: 'green'
  },
  {
    title: '管理员',
    value: stats.admin,
    icon: Stamp,
    colorClass: 'orange'
  },
  {
    title: '仓管员',
    value: stats.storekeeper,
    icon: Avatar,
    colorClass: 'red'
  }
])

const getRoleTag = (roleName) => {
  const map = {
    管理员: 'danger',
    仓管员: 'warning',
    普通用户: 'success'
  }
  return map[roleName] || 'info'
}

const handleSearch = () => {
  currentPage.value = 1
  loadUsers()
}

const handleReset = () => {
  queryForm.username = ''
  queryForm.roleId = ''
  queryForm.status = ''
  currentPage.value = 1
  loadUsers()
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadUsers()
}

// 弹窗逻辑
const dialogVisible = ref(false)
const dialogType = ref('add')
const editId = ref(null)

const formData = reactive({
  username: '',
  password: '',
  realName: '',
  employeeNo: '',
  roleId: '',
  phone: '',
  email: '',
  avatar: '',
  status: 1
})

const resetForm = () => {
  formData.username = ''
  formData.password = ''
  formData.realName = ''
  formData.employeeNo = ''
  formData.roleId = ''
  formData.phone = ''
  formData.email = ''
  formData.avatar = ''
  formData.status = 1
}

const openDialog = async (type, row = null) => {
  dialogType.value = type
  resetForm()

  if (type === 'edit' && row) {
    editId.value = row.id
    try {
      const res = await getUserById(row.id)
      Object.assign(formData, {
        username: res.data?.username || '',
        password: '',
        realName: res.data?.realName || '',
        employeeNo: res.data?.employeeNo || '',
        roleId: res.data?.roleId || '',
        phone: res.data?.phone || '',
        email: res.data?.email || '',
        avatar: res.data?.avatar || '',
        status: res.data?.status ?? 1
      })
    } catch (err) {
      ElMessage.error('获取用户详情失败')
      return
    }
  }

  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formData.username || !formData.realName || !formData.roleId) {
    ElMessage.warning('请填写用户名、姓名和角色')
    return
  }

  if (dialogType.value === 'add' && !formData.password) {
    ElMessage.warning('新增用户时请输入密码')
    return
  }

  saving.value = true
  try {
    if (dialogType.value === 'add') {
      await addUser({
        ...formData
      })
      ElMessage.success('新增成功')
    } else {
      await updateUser({
        id: editId.value,
        ...formData
      })
      ElMessage.success('编辑成功')
    }

    dialogVisible.value = false
    await loadUsers()
    await loadStats()
  } catch (err) {
    ElMessage.error(err.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  try {
    await updateUserStatus(row.id, newStatus)
    ElMessage.success(`已${newStatus === 1 ? '启用' : '禁用'}用户`)
    await loadUsers()
    await loadStats()
  } catch (err) {
    ElMessage.error('更新状态失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除 ${row.realName}？`, '提示', { type: 'warning' })
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    await loadUsers()
    await loadStats()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

watch([currentPage, pageSize], () => {
  loadUsers()
})

onMounted(async () => {
  await loadRoles()
  await loadUsers()
  await loadStats()
})
</script>

<style scoped>
.users-page {
  padding: 20px;
  background: #f5f7fb;
  min-height: 100vh;
  box-sizing: border-box;
}

.filter-card, .table-card {
  border-radius: 14px;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #303133;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-input {
  width: 220px;
}

.summary-row {
  margin-bottom: 16px;
}

.summary-card {
  border-radius: 14px;
}

.summary-box {
  display: flex;
  align-items: center;
  gap: 14px;
}

.summary-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.summary-icon.blue { background: #e8f3ff; color: #409eff; }
.summary-icon.green { background: #ecf9f0; color: #67c23a; }
.summary-icon.orange { background: #fff6e8; color: #e6a23c; }
.summary-icon.red { background: #fdecec; color: #f56c6c; }

.summary-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 6px;
}

.summary-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
}

.table-tip {
  font-size: 13px;
  color: #909399;
  font-weight: 400;
}

.pagination-box {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .filter-input { width: 100%; }
  .filter-form { flex-direction: column; }
}
</style>