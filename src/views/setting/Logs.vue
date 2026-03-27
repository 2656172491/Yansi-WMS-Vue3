<!-- 操作日志 -->
<template>
  <div class="logs-page">
    <el-card class="filter-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
          <el-tag type="info" effect="light">系统审计</el-tag>
        </div>
      </template>

      <el-form :inline="true" :model="queryForm" class="filter-form">
        <el-form-item label="操作人">
          <el-input
              v-model="queryForm.operator"
              placeholder="请输入操作人"
              clearable
              class="filter-input"
          />
        </el-form-item>

        <el-form-item label="操作类型">
          <el-select
              v-model="queryForm.type"
              placeholder="请选择类型"
              clearable
              class="filter-input"
          >
            <el-option label="登录" value="login" />
            <el-option label="新增" value="create" />
            <el-option label="修改" value="update" />
            <el-option label="删除" value="delete" />
            <el-option label="盘点" value="check" />
            <el-option label="出入库" value="inventory" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间范围">
          <el-date-picker
              v-model="queryForm.timeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              class="filter-input"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

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

    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>日志列表</span>
          <el-button type="primary" link @click="handleExport">导出日志</el-button>
        </div>
      </template>

      <el-table :data="filteredLogs" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="time" label="操作时间" width="180" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="typeLabel" label="操作类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" effect="light" size="small">
              {{ row.typeLabel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="模块" width="140" />
        <el-table-column prop="content" label="操作内容" min-width="260" />
        <el-table-column prop="ip" label="IP 地址" width="140" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.success ? 'success' : 'danger'" effect="light" size="small">
              {{ row.success ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="详情" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="showDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :total="filteredLogs.length"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="日志详情" width="560px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="操作时间">{{ detailData.time }}</el-descriptions-item>
        <el-descriptions-item label="操作人">{{ detailData.operator }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">{{ detailData.typeLabel }}</el-descriptions-item>
        <el-descriptions-item label="模块">{{ detailData.module }}</el-descriptions-item>
        <el-descriptions-item label="操作内容">{{ detailData.content }}</el-descriptions-item>
        <el-descriptions-item label="IP 地址">{{ detailData.ip }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detailData.success ? 'success' : 'danger'" effect="light" size="small">
            {{ detailData.success ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Search, Refresh, Document, Clock, User, DataLine } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const queryForm = reactive({
  operator: '',
  type: '',
  timeRange: [],
})

const logs = ref([
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
])

const getTypeTag = (type) => {
  const map = {
    login: 'success',
    create: 'primary',
    update: 'warning',
    delete: 'danger',
    check: 'info',
    inventory: 'success',
  }
  return map[type] || 'info'
}

const filteredLogs = computed(() => {
  let list = [...logs.value]

  if (queryForm.operator) {
    list = list.filter((item) => item.operator.includes(queryForm.operator))
  }

  if (queryForm.type) {
    list = list.filter((item) => item.type === queryForm.type)
  }

  if (queryForm.timeRange && queryForm.timeRange.length === 2) {
    const [start, end] = queryForm.timeRange
    list = list.filter((item) => {
      const time = item.time.slice(0, 10)
      return time >= start && time <= end
    })
  }

  const start = (currentPage.value - 1) * pageSize.value
  return list.slice(start, start + pageSize.value)
})

const summaryCards = computed(() => [
  {
    title: '总日志数',
    value: logs.value.length,
    icon: Document,
    colorClass: 'blue',
  },
  {
    title: '今日操作',
    value: logs.value.filter((item) => item.time.startsWith('2026-03-27')).length,
    icon: Clock,
    colorClass: 'green',
  },
  {
    title: '操作人数',
    value: new Set(logs.value.map((item) => item.operator)).size,
    icon: User,
    colorClass: 'orange',
  },
  {
    title: '成功率',
    value: `${Math.round((logs.value.filter((item) => item.success).length / logs.value.length) * 100)}%`,
    icon: DataLine,
    colorClass: 'red',
  },
])

const detailVisible = ref(false)
const detailData = reactive({
  time: '',
  operator: '',
  typeLabel: '',
  module: '',
  content: '',
  ip: '',
  success: true,
})

const showDetail = (row) => {
  Object.assign(detailData, row)
  detailVisible.value = true
}

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('已按条件筛选日志')
}

const handleReset = () => {
  queryForm.operator = ''
  queryForm.type = ''
  queryForm.timeRange = []
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleExport = () => {
  ElMessage.success('日志导出成功')
}
</script>

<style scoped>
.logs-page {
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
  align-items: center;
  justify-content: space-between;
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