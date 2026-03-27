<template>
  <div class="roles-page">
    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-tag type="info" effect="light">权限配置</el-tag>
        </div>
      </template>

      <el-form :inline="true" :model="queryForm" class="filter-form">
        <el-form-item label="角色名称">
          <el-input
              v-model="queryForm.name"
              placeholder="请输入角色名称"
              clearable
              class="filter-input"
          />
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
          <el-button type="success" :icon="Plus" @click="openDialog('add')">新增角色</el-button>
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

    <!-- 角色列表 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>角色列表</span>
          <span class="table-tip">共 {{ filteredRoles.length }} 个角色</span>
        </div>
      </template>

      <el-table :data="pagedRoles" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="角色名称" width="140" />
        <el-table-column prop="code" label="角色编码" width="160" />
        <el-table-column prop="desc" label="角色描述" min-width="220" />
        <el-table-column prop="permissionCount" label="权限数量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'danger'" effect="light" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDialog('edit', row)">编辑</el-button>
            <el-button type="warning" link @click="openPermissionDialog(row)">分配权限</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :total="filteredRoles.length"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑角色弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增角色' : '编辑角色'" width="560px">
      <el-form :model="formData" label-width="90px">
        <el-form-item label="角色名称">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="formData.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="formData.desc" type="textarea" :rows="3" placeholder="请输入角色描述" />
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

    <!-- 分配权限弹窗 -->
    <el-dialog v-model="permissionVisible" title="分配权限" width="640px">
      <div class="permission-tip">
        当前角色：<strong>{{ currentRole.name }}</strong>
      </div>

      <el-tree
          ref="treeRef"
          :data="permissionTree"
          show-checkbox
          node-key="id"
          :default-checked-keys="currentRole.permissions"
          :props="treeProps"
      />

      <template #footer>
        <el-button @click="permissionVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePermissionSave">保存权限</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Search, Refresh, Plus, Key, Stamp, ScaleToOriginal, Tools } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const queryForm = reactive({
  name: '',
  status: '',
})

const roles = ref([
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
])

const filteredRoles = computed(() => {
  let list = [...roles.value]

  if (queryForm.name) {
    list = list.filter((item) => item.name.includes(queryForm.name))
  }

  if (queryForm.status) {
    list = list.filter((item) => item.status === queryForm.status)
  }

  return list
})

const pagedRoles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRoles.value.slice(start, start + pageSize.value)
})

const summaryCards = computed(() => [
  {
    title: '总角色数',
    value: roles.value.length,
    icon: Stamp,
    colorClass: 'blue',
  },
  {
    title: '启用角色',
    value: roles.value.filter((r) => r.status === '启用').length,
    icon: Key,
    colorClass: 'green',
  },
  {
    title: '高权限角色',
    value: roles.value.filter((r) => r.permissionCount >= 10).length,
    icon: Tools,
    colorClass: 'orange',
  },
  {
    title: '普通角色',
    value: roles.value.filter((r) => r.permissionCount < 10).length,
    icon: ScaleToOriginal,
    colorClass: 'red',
  },
])

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('已筛选角色数据')
}

const handleReset = () => {
  queryForm.name = ''
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
  name: '',
  code: '',
  desc: '',
  status: '启用',
})

const resetForm = () => {
  formData.name = ''
  formData.code = ''
  formData.desc = ''
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
  if (!formData.name || !formData.code) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (dialogType.value === 'add') {
    const maxId = roles.value.length ? Math.max(...roles.value.map((item) => item.id)) : 0
    roles.value.unshift({
      id: maxId + 1,
      ...formData,
      permissionCount: 0,
      createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      permissions: [],
    })
    ElMessage.success('新增角色成功')
  } else {
    const index = roles.value.findIndex((item) => item.id === editId.value)
    if (index !== -1) {
      roles.value[index] = {
        ...roles.value[index],
        ...formData,
      }
      ElMessage.success('编辑角色成功')
    }
  }

  dialogVisible.value = false
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除角色【${row.name}】吗？`, '提示', {
    type: 'warning',
  })
      .then(() => {
        roles.value = roles.value.filter((item) => item.id !== row.id)
        ElMessage.success('删除成功')
      })
      .catch(() => {})
}

const permissionVisible = ref(false)
const currentRole = reactive({
  id: null,
  name: '',
  permissions: [],
})

const treeProps = {
  label: 'label',
  children: 'children',
}

const permissionTree = [
  {
    id: 1,
    label: '首页',
  },
  {
    id: 2,
    label: '物资管理',
    children: [
      { id: 21, label: '物资列表' },
    ],
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

const treeRef = ref(null)

const openPermissionDialog = (row) => {
  currentRole.id = row.id
  currentRole.name = row.name
  currentRole.permissions = [...(row.permissions || [])]
  permissionVisible.value = true
}

const handlePermissionSave = () => {
  ElMessage.success(`角色【${currentRole.name}】权限已保存`)
  permissionVisible.value = false
}
</script>

<style scoped>
.roles-page {
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

.permission-tip {
  margin-bottom: 16px;
  color: #606266;
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