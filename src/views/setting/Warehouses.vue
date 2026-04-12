<template>
  <div class="warehouses-page">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="summary-row">
      <el-col :xs="24" :sm="12" :md="8" v-for="item in summaryCards" :key="item.title">
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

    <!-- 表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>仓库列表</span>
          <div class="header-right">
            <span class="table-tip">共 {{ tableData.length }} 个仓库</span>
            <el-button type="primary" :icon="Plus" @click="openDialog('add')">新增仓库</el-button>
          </div>
        </div>
      </template>

      <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="仓库名称" min-width="150" />
        <el-table-column prop="code" label="仓库编码" width="140" />
        <el-table-column prop="address" label="仓库地址" min-width="220" />
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" effect="light" size="small">
              {{ row.status === 1 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170">
          <template #default="{ row }">
            {{ row.createTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="170">
          <template #default="{ row }">
            {{ row.updateTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDialog('edit', row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增仓库' : '编辑仓库'"
        width="560px"
    >
      <el-form :model="formData" label-width="90px" class="warehouse-form">
        <el-form-item label="仓库名称">
          <el-input v-model="formData.name" placeholder="请输入仓库名称" />
        </el-form-item>

        <el-form-item label="仓库编码">
          <el-input v-model="formData.code" placeholder="请输入仓库编码" />
        </el-form-item>

        <el-form-item label="仓库地址">
          <el-input v-model="formData.address" placeholder="请输入仓库地址" />
        </el-form-item>

        <el-form-item label="联系人">
          <el-input v-model="formData.contact" placeholder="请输入联系人" />
        </el-form-item>

        <el-form-item label="联系电话">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="formData.status" style="width: 100%">
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
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
import { Plus, HomeFilled, Location, Box } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import {
  getWarehouseList,
  getWarehouseById,
  addWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseStats
} from '@/api/api.js'

const loading = ref(false)
const saving = ref(false)
const tableData = ref([])

const stats = reactive({
  total: 0,
  normal: 0,
  stopped: 0,
})

const loadWarehouses = async () => {
  loading.value = true
  try {
    const res = await getWarehouseList()
    console.log(res.data)
    tableData.value = res.data || []
  } catch (err) {
    tableData.value = []
    ElMessage.error('加载仓库列表失败')
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const res = await getWarehouseStats()
    stats.total = res.data?.total || 0
    stats.normal = res.data?.normal || 0
    stats.stopped = res.data?.stopped || 0
  } catch (err) {
    stats.total = 0
    stats.normal = 0
    stats.stopped = 0
  }
}

const summaryCards = computed(() => [
  {
    title: '仓库总数',
    value: stats.total,
    icon: HomeFilled,
    colorClass: 'blue'
  },
  {
    title: '正常仓库',
    value: stats.normal,
    icon: Box,
    colorClass: 'green'
  },
  {
    title: '停用仓库',
    value: stats.stopped,
    icon: Location,
    colorClass: 'orange'
  },
])

const getStatusTag = (status) => {
  const map = {
    1: 'success',
    0: 'danger'
  }
  return map[status] || 'info'
}

// 新增/编辑
const dialogVisible = ref(false)
const dialogType = ref('add')
const editId = ref(null)

const formData = reactive({
  name: '',
  code: '',
  address: '',
  contact: '',
  phone: '',
  status: 1
})

const resetForm = () => {
  formData.name = ''
  formData.code = ''
  formData.address = ''
  formData.contact = ''
  formData.phone = ''
  formData.status = 1
}

const openDialog = async (type, row = null) => {
  dialogType.value = type
  resetForm()

  if (type === 'edit' && row) {
    editId.value = row.id
    try {
      const res = await getWarehouseById(row.id)
      Object.assign(formData, {
        name: res.data?.name || '',
        code: res.data?.code || '',
        address: res.data?.address || '',
        contact: res.data?.contact || '',
        phone: res.data?.phone || '',
        status: res.data?.status ?? 1
      })
    } catch (err) {
      ElMessage.error('获取仓库详情失败')
      return
    }
  } else {
    editId.value = null
  }

  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formData.name || !formData.code || !formData.contact) {
    ElMessage.warning('请填写完整信息')
    return
  }

  saving.value = true
  try {
    if (dialogType.value === 'add') {
      await addWarehouse({ ...formData })
      ElMessage.success('��增仓库成功')
    } else {
      await updateWarehouse({
        id: editId.value,
        ...formData
      })
      ElMessage.success('编辑仓库成功')
    }

    dialogVisible.value = false
    await loadWarehouses()
    await loadStats()
  } catch (err) {
    ElMessage.error(err.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除仓库【${row.name}】吗？`, '提示', {
      type: 'warning'
    })
    await deleteWarehouse(row.id)
    ElMessage.success('删除成功')
    await loadWarehouses()
    await loadStats()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(async () => {
  await loadWarehouses()
  await loadStats()
})
</script>

<style scoped>
.warehouses-page {
  padding: 20px;
  background: #f5f7fb;
  min-height: 80vh;
  box-sizing: border-box;
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

.table-card {
  border-radius: 14px;
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

.table-tip {
  font-size: 13px;
  color: #909399;
  font-weight: 400;
}

.warehouse-form {
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