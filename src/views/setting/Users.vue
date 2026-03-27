<!-- 用户管理 -->
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
              v-model="queryForm.role"
              placeholder="请选择角色"
              clearable
              class="filter-input"
          >
            <el-option label="管理员" value="管理员" />
            <el-option label="仓管员" value="仓管员" />
            <el-option label="普通用户" value="普通用户" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
              v-model="queryForm.status"
              placeholder="请选择状态"
              clearable
              class="filter-input"
          >
            <el-option label="启用" value="启用" />
            <el-option label="禁用" value="禁用" />
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
          <span class="table-tip">共 {{ filteredUsers.length }} 条数据</span>
        </div>
      </template>

      <el-table :data="pagedUsers" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="username" label="用户名" width="140" />
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleTag(row.role)" effect="light" size="small">
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'danger'" effect="light" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDialog('edit', row)">编辑</el-button>
            <el-button type="warning" link @click="toggleStatus(row)">
              {{ row.status === '启用' ? '禁用' : '启用' }}
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :total="filteredUsers.length"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增用户' : '编辑用户'" width="560px">
      <el-form :model="formData" label-width="90px">
        <el-form-item label="用户名">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formData.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="管理员" />
            <el-option label="仓管员" value="仓管员" />
            <el-option label="普通用户" value="普通用户" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
              v-model="formData.status"
              active-text="启用"
              inactive-text="禁用"
              active-value="启用"
              inactive-value="禁用"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Search, Refresh, Plus, UserFilled, Avatar, Stamp, CircleCheck } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const queryForm = reactive({
  username: '',
  role: '',
  status: '',
})

const users = ref([
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
])

const filteredUsers = computed(() => {
  let list = [...users.value]

  if (queryForm.username) {
    list = list.filter((item) => item.username.includes(queryForm.username))
  }
  if (queryForm.role) {
    list = list.filter((item) => item.role === queryForm.role)
  }
  if (queryForm.status) {
    list = list.filter((item) => item.status === queryForm.status)
  }

  return list
})

const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredUsers.value.slice(start, start + pageSize.value)
})

const summaryCards = computed(() => [
  {
    title: '总用户数',
    value: users.value.length,
    icon: UserFilled,
    colorClass: 'blue',
  },
  {
    title: '启用用户',
    value: users.value.filter((u) => u.status === '启用').length,
    icon: CircleCheck,
    colorClass: 'green',
  },
  {
    title: '管理员',
    value: users.value.filter((u) => u.role === '管理员').length,
    icon: Stamp,
    colorClass: 'orange',
  },
  {
    title: '仓管员',
    value: users.value.filter((u) => u.role === '仓管员').length,
    icon: Avatar,
    colorClass: 'red',
  },
])

const getRoleTag = (role) => {
  const map = {
    管理员: 'danger',
    仓管员: 'warning',
    普通用户: 'success',
  }
  return map[role] || 'info'
}

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('已筛选用户数据')
}

const handleReset = () => {
  queryForm.username = ''
  queryForm.role = ''
  queryForm.status = ''
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const dialogVisible = ref(false)
const dialogType = ref('add')
const editId = ref(null)

const formData = reactive({
  username: '',
  realName: '',
  role: '',
  phone: '',
  email: '',
  status: '启用',
})

const resetForm = () => {
  formData.username = ''
  formData.realName = ''
  formData.role = ''
  formData.phone = ''
  formData.email = ''
  formData.status = '启用'
}

const openDialog = (type, row = null) => {
  dialogType.value = type
  resetForm()

  if (type === 'edit' && row) {
    editId.value = row.id
    Object.assign(formData, row)
  } else {
    editId.value = null
  }

  dialogVisible.value = true
}

const handleSave = () => {
  if (!formData.username || !formData.realName || !formData.role) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (dialogType.value === 'add') {
    const maxId = users.value.length ? Math.max(...users.value.map((item) => item.id)) : 0
    users.value.unshift({
      id: maxId + 1,
      ...formData,
      lastLogin: '-',
    })
    ElMessage.success('新增用户成功')
  } else {
    const index = users.value.findIndex((item) => item.id === editId.value)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        ...formData,
      }
      ElMessage.success('编辑用户成功')
    }
  }

  dialogVisible.value = false
}

const toggleStatus = (row) => {
  row.status = row.status === '启用' ? '禁用' : '启用'
  ElMessage.success(`已${row.status === '启用' ? '启用' : '禁用'}用户`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除用户【${row.realName}】吗？`, '提示', {
    type: 'warning',
  })
      .then(() => {
        users.value = users.value.filter((item) => item.id !== row.id)
        ElMessage.success('删除成功')
      })
      .catch(() => {})
}
</script>

<style scoped>
.users-page {
  padding: 20px;
  background: #f5f7fb;
  min-height: 100vh;
  box-sizing: border-box;
}

.filter-card,
.table-card {
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

.summary-icon.blue {
  background: #e8f3ff;
  color: #409eff;
}

.summary-icon.green {
  background: #ecf9f0;
  color: #67c23a;
}

.summary-icon.orange {
  background: #fff6e8;
  color: #e6a23c;
}

.summary-icon.red {
  background: #fdecec;
  color: #f56c6c;
}

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
  .filter-input {
    width: 100%;
  }

  .filter-form {
    flex-direction: column;
  }
}
</style>