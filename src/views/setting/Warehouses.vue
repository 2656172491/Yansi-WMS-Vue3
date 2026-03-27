<template>
  <div class="warehouses-page">
    <!-- 筛选区 -->
    <el-card class="filter-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>仓库管理</span>
          <el-tag type="info" effect="light">仓库基础信息</el-tag>
        </div>
      </template>

      <el-form :inline="true" :model="queryForm" class="filter-form">
        <el-form-item label="仓库名称">
          <el-input
              v-model="queryForm.name"
              placeholder="请输入仓库名称"
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
            <el-option label="停用" value="停用" />
            <el-option label="维护中" value="维护中" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          <el-button type="success" :icon="Plus" @click="openDialog('add')">新增仓库</el-button>
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

    <!-- 表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>仓库列表</span>
          <span class="table-tip">共 {{ filteredWarehouses.length }} 个仓库</span>
        </div>
      </template>

      <el-table :data="pagedWarehouses" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="仓库名称" min-width="150" />
        <el-table-column prop="code" label="仓库编码" width="140" />
        <el-table-column prop="address" label="仓库地址" min-width="220" />
        <el-table-column prop="manager" label="负责人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="capacity" label="总容量" width="100" />
        <el-table-column prop="used" label="已使用" width="100" />
        <el-table-column label="容量占比" width="120">
          <template #default="{ row }">
            <el-progress
                :percentage="getUsagePercent(row)"
                :stroke-width="8"
                :status="getUsagePercent(row) >= 90 ? 'exception' : getUsagePercent(row) >= 70 ? 'warning' : 'success'"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" effect="light" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDialog('edit', row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :total="filteredWarehouses.length"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增仓库' : '编辑仓库'" width="560px">
      <el-form :model="formData" label-width="90px">
        <el-form-item label="仓库名称">
          <el-input v-model="formData.name" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="仓库编码">
          <el-input v-model="formData.code" placeholder="请输入仓库编码" />
        </el-form-item>
        <el-form-item label="仓库地址">
          <el-input v-model="formData.address" placeholder="请输入仓库地址" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="formData.manager" placeholder="请输入负责人姓名" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="总容量">
          <el-input-number v-model="formData.capacity" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="已使用">
          <el-input-number v-model="formData.used" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.status" style="width: 100%">
            <el-option label="启用" value="启用" />
            <el-option label="停用" value="停用" />
            <el-option label="维护中" value="维护中" />
          </el-select>
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
import { Search, Refresh, Plus, HomeFilled, Location, UserFilled, Box } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const queryForm = reactive({
  name: '',
  status: '',
})

const warehouses = ref([
  {
    id: 1,
    name: '主仓库',
    code: 'WH-001',
    address: '深圳市南山区科技园1号',
    manager: '张三',
    phone: '13800000001',
    capacity: 10000,
    used: 6800,
    status: '启用',
    createTime: '2026-03-20 09:00',
  },
  {
    id: 2,
    name: '东区仓库',
    code: 'WH-002',
    address: '深圳市宝安区工业园8号',
    manager: '李四',
    phone: '13800000002',
    capacity: 6000,
    used: 4300,
    status: '启用',
    createTime: '2026-03-21 10:20',
  },
  {
    id: 3,
    name: '临时仓库',
    code: 'WH-003',
    address: '深圳市龙华区仓储路12号',
    manager: '王五',
    phone: '13800000003',
    capacity: 3000,
    used: 800,
    status: '维护中',
    createTime: '2026-03-22 11:15',
  },
  {
    id: 4,
    name: '备用仓库',
    code: 'WH-004',
    address: '深圳市福田区物流中心3号',
    manager: '赵六',
    phone: '13800000004',
    capacity: 5000,
    used: 0,
    status: '停用',
    createTime: '2026-03-23 14:30',
  },
])

const filteredWarehouses = computed(() => {
  let list = [...warehouses.value]

  if (queryForm.name) {
    list = list.filter((item) => item.name.includes(queryForm.name))
  }

  if (queryForm.status) {
    list = list.filter((item) => item.status === queryForm.status)
  }

  return list
})

const pagedWarehouses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredWarehouses.value.slice(start, start + pageSize.value)
})

const summaryCards = computed(() => [
  {
    title: '仓库总数',
    value: warehouses.value.length,
    icon: HomeFilled,
    colorClass: 'blue',
  },
  {
    title: '启用仓库',
    value: warehouses.value.filter((w) => w.status === '启用').length,
    icon: Box,
    colorClass: 'green',
  },
  {
    title: '维护中',
    value: warehouses.value.filter((w) => w.status === '维护中').length,
    icon: Location,
    colorClass: 'orange',
  },
  {
    title: '负责人数量',
    value: new Set(warehouses.value.map((w) => w.manager)).size,
    icon: UserFilled,
    colorClass: 'red',
  },
])

const getUsagePercent = (row) => {
  if (!row.capacity) return 0
  return Math.round((row.used / row.capacity) * 100)
}

const getStatusTag = (status) => {
  const map = {
    启用: 'success',
    停用: 'danger',
    维护中: 'warning',
  }
  return map[status] || 'info'
}

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('已筛选仓库数据')
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
  address: '',
  manager: '',
  phone: '',
  capacity: 0,
  used: 0,
  status: '启用',
})

const resetForm = () => {
  formData.name = ''
  formData.code = ''
  formData.address = ''
  formData.manager = ''
  formData.phone = ''
  formData.capacity = 0
  formData.used = 0
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
  if (!formData.name || !formData.code || !formData.manager) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (dialogType.value === 'add') {
    const maxId = warehouses.value.length ? Math.max(...warehouses.value.map((item) => item.id)) : 0
    warehouses.value.unshift({
      id: maxId + 1,
      ...formData,
      createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
    })
    ElMessage.success('新增仓库成功')
  } else {
    const index = warehouses.value.findIndex((item) => item.id === editId.value)
    if (index !== -1) {
      warehouses.value[index] = {
        ...warehouses.value[index],
        ...formData,
      }
      ElMessage.success('编辑仓库成功')
    }
  }

  dialogVisible.value = false
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除仓库【${row.name}】吗？`, '提示', {
    type: 'warning',
  })
      .then(() => {
        warehouses.value = warehouses.value.filter((item) => item.id !== row.id)
        ElMessage.success('删除成功')
      })
      .catch(() => {})
}
</script>

<style scoped>
.warehouses-page {
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