<template>
  <div class="stock-check-page">
    <!-- 顶部操作栏 -->
    <el-card class="tool-card" shadow="never">
      <div class="tool-row">
        <div class="left">
          <el-button type="primary" :icon="Plus" @click="handleCreateCheck">
            新建盘点单
          </el-button>
          <el-button :icon="Check" @click="handleConfirmCheck" :disabled="!currentCheck.id">
            确认盘点
          </el-button>
          <el-button :icon="Download" @click="handleExport" :disabled="!currentCheck.id">
            导出报表
          </el-button>
        </div>
        <div class="right">
          <el-tag :type="checkStatusTag" size="default">
            {{ currentCheck.statusText || '未开始盘点' }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <!-- 当前盘点明细 -->
    <el-card class="section-card" shadow="never" style="margin-top: 16px">
      <template #header>
        <div class="section-header">
          <span>盘点明细</span>
          <span v-if="currentCheck.checkNo" class="check-no">单号：{{ currentCheck.checkNo }}</span>
        </div>
      </template>

      <el-empty v-if="!currentCheck.id" description="点击【新建盘点单】开始盘点" />

      <el-table v-else :data="checkItems" border stripe style="width: 100%">
        <el-table-column label="物资编号" prop="goodsCode" width="140" />
        <el-table-column label="物资名称" prop="goodsName" min-width="160" />
        <el-table-column label="分类" prop="category" width="120" />
        <el-table-column label="规格" prop="specs" min-width="140" />
        <el-table-column label="账面数量" prop="bookQuantity" width="100" />
        <el-table-column label="实盘数量" width="140">
          <template #default="scope">
            <el-input-number
                v-model="scope.row.actualQuantity"
                :min="0"
                @change="handleCalcDiff(scope.row)"
                style="width: 120px"
            />
          </template>
        </el-table-column>
        <el-table-column label="差异数量" width="100">
          <template #default="scope">
            <span :class="scope.row.diffQuantity > 0 ? 'diff-plus' : scope.row.diffQuantity < 0 ? 'diff-minus' : ''">
              {{ scope.row.diffQuantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="差异原因" min-width="180">
          <template #default="scope">
            <el-input v-model="scope.row.diffReason" placeholder="选填" clearable />
          </template>
        </el-table-column>
      </el-table>

      <!-- 盘点统计 -->
      <div class="check-stats" v-if="currentCheck.id">
        <div class="stat-item">
          <span>总物资：{{ totalCount }}</span>
        </div>
        <div class="stat-item">
          <span>已盘点：{{ checkedCount }}</span>
        </div>
        <div class="stat-item">
          <span class="diff-plus">盘盈：{{ plusCount }}</span>
        </div>
        <div class="stat-item">
          <span class="diff-minus">盘亏：{{ minusCount }}</span>
        </div>
      </div>
    </el-card>

    <!-- 历史盘点记录 -->
    <el-card class="section-card" shadow="never" style="margin-top: 16px">
      <template #header>
        <div class="section-header">
          <span>历史盘点记录</span>
        </div>
      </template>

      <el-table :data="historyList" border stripe style="width: 100%">
        <el-table-column label="盘点单号" prop="checkNo" />
        <el-table-column label="盘点时间" prop="createTime" />
        <el-table-column label="盘点人" prop="checker" />
        <el-table-column label="状态" prop="statusText" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" link @click="handleViewDetail(scope.row)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus, Check, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { MOCK_INVENTORY, MOCK_GOODS, CATEGORY_MAP } from '@/constants/wms.js'

// 当前盘点单
const currentCheck = reactive({
  id: null,
  checkNo: '',
  status: 0, // 0未开始 1盘点中 2已完成
  statusText: '未开始盘点',
})

// 从项目静态数据生成盘点明细
const checkItems = ref([])

// 历史记录
const historyList = ref([
  {
    id: 1,
    checkNo: 'CK20260327001',
    createTime: '2026-03-27 10:20',
    checker: '管理员',
    statusText: '已完成',
  },
  {
    id: 2,
    checkNo: 'CK20260326001',
    createTime: '2026-03-26 15:40',
    checker: '管理员',
    statusText: '已完成',
  },
])

// 状态样式
const checkStatusTag = computed(() => {
  const status = currentCheck.status
  if (status === 1) return 'warning'
  if (status === 2) return 'success'
  return 'info'
})

// 统计
const totalCount = computed(() => checkItems.value.length)
const checkedCount = computed(() => checkItems.value.filter((i) => i.actualQuantity > 0).length)
const plusCount = computed(() => checkItems.value.filter((i) => i.diffQuantity > 0).length)
const minusCount = computed(() => checkItems.value.filter((i) => i.diffQuantity < 0).length)

// 新建盘点
const handleCreateCheck = () => {
  currentCheck.id = Date.now()
  currentCheck.checkNo = 'CK' + new Date().getTime().toString().slice(-8)
  currentCheck.status = 1
  currentCheck.statusText = '盘点中'

  // 使用项目中的静态数据生成盘点项
  checkItems.value = MOCK_INVENTORY.map((inv) => {
    const goods = MOCK_GOODS.find((g) => g.id === inv.goods_id)
    return {
      id: inv.id,
      goodsCode: inv.goods_code,
      goodsName: inv.goods_name,
      category: CATEGORY_MAP[inv.category_id] || '-',
      specs: goods?.specification || '-',
      bookQuantity: inv.quantity,
      actualQuantity: 0,
      diffQuantity: 0,
      diffReason: '',
    }
  })

  ElMessage.success('已创建盘点单：' + currentCheck.checkNo)
}

// 计算差异
const handleCalcDiff = (row) => {
  row.diffQuantity = row.actualQuantity - row.bookQuantity
}

// 确认盘点
const handleConfirmCheck = () => {
  if (!currentCheck.id) return ElMessage.warning('请先创建盘点单')
  if (checkedCount.value === 0) return ElMessage.warning('请录入实盘数量')

  currentCheck.status = 2
  currentCheck.statusText = '已完成'
  ElMessage.success('盘点确认成功，库存已自动更新！')

  historyList.value.unshift({
    id: Date.now(),
    checkNo: currentCheck.checkNo,
    createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
    checker:  '管理员',
    statusText: '已完成',
  })
}

// 导出
const handleExport = () => {
  ElMessage.success('盘点报表导出成功')
}

// 查看明细
const handleViewDetail = (row) => {
  ElMessage.info('查看：' + row.checkNo)
}
</script>

<style scoped>
.stock-check-page {
  padding: 20px;
  background: #f5f7fb;
  min-height: 100vh;
  box-sizing: border-box;
}

.tool-card {
  border-radius: 14px;
}

.tool-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left,
.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-card {
  border-radius: 14px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #303133;
}

.check-no {
  font-size: 13px;
  color: #606266;
  font-weight: 400;
}

.check-stats {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.stat-item {
  font-size: 14px;
  color: #303133;
}

.diff-plus {
  color: #67c23a;
  font-weight: bold;
}

.diff-minus {
  color: #f56c6c;
  font-weight: bold;
}
</style>