<template>
  <div class="roles-page">
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
          <div class="header-right">
            <el-button type="primary" :icon="Plus" @click="openDialog('add')">新增角色</el-button>
          </div>
        </div>
      </template>

      <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="roleName" label="角色名称" min-width="160" />
        <el-table-column prop="roleCode" label="角色编码" min-width="200" />
        <el-table-column prop="level" label="权限等级" min-width="100" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" effect="light" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="170">
          <template #default="{ row }">
            {{ row.createTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="170">
          <template #default="{ row }">
            {{ row.updateTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDialog('edit', row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑角色弹窗 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
        width="560px"
    >
      <el-form :model="formData" label-width="90px" class="role-form">
        <el-form-item label="角色名称">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色编码">
          <el-input v-model="formData.roleCode" placeholder="请输入角色编码" />
        </el-form-item>

        <el-form-item label="权限等级">
          <el-input-number v-model="formData.level" :min="1" :max="999" style="width: 100%" />
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
import { computed, onMounted, reactive, ref } from 'vue'
import { Plus, Key, Stamp, ScaleToOriginal, Tools } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import {
  getRoleList,
  getRoleById,
  addRole,
  updateRole,
  deleteRole,
  getRoleStats
} from '@/api/api.js'

const loading = ref(false)
const saving = ref(false)
const tableData = ref([])

const stats = reactive({
  total: 0,
  enabled: 0,
  highPermission: 0,
  normal: 0
})

const loadRoles = async () => {
  loading.value = true
  try {
    const res = await getRoleList()
    tableData.value = res.data
  } catch (err) {
    tableData.value = []
    ElMessage.error('加载角色列表失败')
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const res = await getRoleStats()
    stats.total = res.data?.total || 0
    stats.enabled = res.data?.enabled || 0
    stats.highPermission = res.data?.highPermission || 0
    stats.normal = res.data?.normal || 0
  } catch (err) {
    stats.total = 0
    stats.enabled = 0
    stats.highPermission = 0
    stats.normal = 0
  }
}

const summaryCards = computed(() => [
  {
    title: '总角色数',
    value: stats.total,
    icon: Stamp,
    colorClass: 'blue'
  },
  {
    title: '启用角色',
    value: stats.enabled,
    icon: Key,
    colorClass: 'green'
  },
  {
    title: '高权限角色',
    value: stats.highPermission,
    icon: Tools,
    colorClass: 'orange'
  },
  {
    title: '普通角色',
    value: stats.normal,
    icon: ScaleToOriginal,
    colorClass: 'red'
  }
])

// 新增/编辑
const dialogVisible = ref(false)
const dialogType = ref('add')
const editId = ref(null)

const formData = reactive({
  roleName: '',
  roleCode: '',
  level: 1,
  status: 1
})

const resetForm = () => {
  formData.roleName = ''
  formData.roleCode = ''
  formData.level = 1
  formData.status = 1
}

const openDialog = async (type, row = null) => {
  dialogType.value = type
  resetForm()

  if (type === 'edit' && row) {
    editId.value = row.id
    try {
      const res = await getRoleById(row.id)
      Object.assign(formData, {
        roleName: res.data?.roleName || '',
        roleCode: res.data?.roleCode || '',
        level: res.data?.level ?? 1,
        status: res.data?.status ?? 1
      })
    } catch (err) {
      ElMessage.error('获取角色详情失败')
      return
    }
  } else {
    editId.value = null
  }

  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formData.roleName || !formData.roleCode) {
    ElMessage.warning('请填写完整信息')
    return
  }

  saving.value = true
  try {
    if (dialogType.value === 'add') {
      await addRole({ ...formData })
      ElMessage.success('新增角色成功')
    } else {
      await updateRole({
        id: editId.value,
        ...formData
      })
      ElMessage.success('编辑角色成功')
    }

    dialogVisible.value = false
    await loadRoles()
    await loadStats()
  } catch (err) {
    ElMessage.error(err.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除角色【${row.roleName}】吗？`, '提示', {
      type: 'warning'
    })
    await deleteRole(row.id)
    ElMessage.success('删除成功')
    await loadRoles()
    await loadStats()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(async () => {
  await loadRoles()
  await loadStats()
})
</script>

<style scoped>
.roles-page {
  padding: 20px;
  background: #f5f7fb;
  min-height: 80vh;
  box-sizing: border-box;
}

.table-card {
  border-radius: 14px;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-form {
  padding-top: 4px;
}

@media (max-width: 768px) {
  .header-right {
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }
}
</style>