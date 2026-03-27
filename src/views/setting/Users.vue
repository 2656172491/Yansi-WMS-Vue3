<!-- 用户管理 -->
<template>
  <div class="users-page">
    <!-- 搜索筛选 -->
    <SearchBar title="用户管理" tag="系统账户" @search="handleSearch" @reset="handleReset">
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
      <template #actions>
        <el-button type="success" :icon="Plus" @click="openDialog('add')">新增用户</el-button>
      </template>
    </SearchBar>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="summary-row">
      <el-col :xs="12" :sm="12" :md="6" v-for="item in summaryCards" :key="item.title">
        <StatCard :title="item.title" :value="item.value" :icon="item.icon" :color="item.colorClass" />
      </el-col>
    </el-row>

    <!-- 用户表格 -->
    <DataTable
      title="用户列表"
      :loading="loading"
      :total="filteredUsers.length"
      :current-page="currentPage"
      :page-size="pageSize"
      @update:current-page="handlePageChange"
    >
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
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDialog('edit', row)">编辑</el-button>
            <el-button type="warning" link @click="toggleStatus(row)">
              {{ row.status === '启用' ? '禁用' : '启用' }}
            </el-button>
            <ConfirmButton
              :message="`确认删除用户【${row.realName}】吗？`"
              @confirm="handleDelete(row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </DataTable>

    <!-- 新增/编辑弹窗 -->
    <FormDialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
      @confirm="handleSave"
      @cancel="dialogVisible = false"
    >
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
    </FormDialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Plus, UserFilled, Avatar, Stamp, CircleCheck } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SearchBar from '@/components/common/SearchBar.vue'
import StatCard from '@/components/common/StatCard.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import ConfirmButton from '@/components/common/ConfirmButton.vue'

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
  users.value = users.value.filter((item) => item.id !== row.id)
  ElMessage.success('删除成功')
}
</script>

<style scoped>
.users-page {
  padding: var(--page-padding, 20px);
  background: var(--bg-page, #f5f7fb);
  min-height: 100vh;
  box-sizing: border-box;
}

.summary-row {
  margin-bottom: var(--card-gap, 16px);
}

.filter-input {
  width: 220px;
}

@media (max-width: 768px) {
  .filter-input {
    width: 100%;
  }
}
</style>