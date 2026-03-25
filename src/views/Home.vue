<template>
  <div class="home-page">
    <!-- 欢迎区 -->
    <el-card class="welcome-card" shadow="never">
      <div class="welcome-content">
        <div class="welcome-text">
          <div class="title-row">
            <h2>欢迎回来，{{ userName }} 👋</h2>
            <el-tag type="success" effect="light">系统运行正常</el-tag>
          </div>

          <p class="subtitle">
            今天是 {{ todayText }}，当前仓库状态良好，您可以查看库存、处理入库出库业务并关注预警信息。
          </p>

          <div class="welcome-stats">
            <div class="mini-stat">
              <span class="mini-label">今日入库</span>
              <span class="mini-value">{{ overview.todayInbound }}</span>
            </div>
            <div class="mini-stat">
              <span class="mini-label">今日出库</span>
              <span class="mini-value">{{ overview.todayOutbound }}</span>
            </div>
            <div class="mini-stat">
              <span class="mini-label">库存预警</span>
              <span class="mini-value warning">{{ overview.warningCount }}</span>
            </div>
          </div>
        </div>

        <div class="welcome-illustration">
          <el-icon class="warehouse-icon"><Box /></el-icon>
          <div class="illustration-tip">仓库管理工作台</div>
        </div>
      </div>
    </el-card>

    <!-- 数据概览 -->
    <el-row :gutter="16" class="section-row">
      <el-col
          v-for="card in statCards"
          :key="card.title"
          :xs="12"
          :sm="12"
          :md="6"
      >
        <el-card class="stat-card" shadow="hover">
          <div class="stat-card-body">
            <div class="stat-icon" :class="card.colorClass">
              <el-icon>
                <component :is="card.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ card.title }}</div>
              <div class="stat-value">{{ card.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-card class="section-card" shadow="never">
      <template #header>
        <div class="section-header">
          <span>快捷入口</span>
        </div>
      </template>

      <el-row :gutter="16">
        <el-col
            v-for="item in quickLinks"
            :key="item.title"
            :xs="12"
            :sm="12"
            :md="6"
        >
          <div class="quick-link" @click="handleNavigate(item.path)">
            <el-icon class="quick-link-icon">
              <component :is="item.icon" />
            </el-icon>
            <div class="quick-link-title">{{ item.title }}</div>
            <div class="quick-link-desc">{{ item.desc }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 底部信息 -->
    <el-row :gutter="16" class="section-row">
      <el-col :xs="24" :md="12">
        <el-card class="section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <span>库存预警</span>
            </div>
          </template>

          <el-empty
              v-if="alerts.length === 0"
              description="暂无预警信息"
          />
          <div v-else class="alert-list">
            <div v-for="item in alerts" :key="item.id" class="alert-item">
              <div class="alert-left">
                <el-tag :type="item.type" effect="light" size="small">
                  {{ item.label }}
                </el-tag>
                <span class="alert-title">{{ item.title }}</span>
              </div>
              <span class="alert-time">{{ item.time }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="12">
        <el-card class="section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <span>最近动态</span>
            </div>
          </template>

          <el-timeline>
            <el-timeline-item
                v-for="item in activities"
                :key="item.id"
                :timestamp="item.time"
                :type="item.type"
            >
              {{ item.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Box, Goods, Download, Upload, List, Bell } from '@element-plus/icons-vue'
import { getOverview } from '@/api/statistics.js'
import { useAuthStore } from '@/store/index.js'

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => authStore.realName || '管理员')

const todayText = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
})

const overview = reactive({
  totalGoods: 0,
  todayInbound: 0,
  todayOutbound: 0,
  warningCount: 0,
})

const statCards = ref([
  { title: '物资总数', value: '0', icon: Goods, colorClass: 'blue' },
  { title: '今日入库', value: '0', icon: Download, colorClass: 'green' },
  { title: '今日出库', value: '0', icon: Upload, colorClass: 'orange' },
  { title: '库存预警', value: '0', icon: Bell, colorClass: 'red' },
])

const quickLinks = [
  {
    title: '物资列表',
    desc: '查看全部物资信息',
    icon: Goods,
    path: '/goods/list',
  },
  {
    title: '入库管理',
    desc: '登记入库记录',
    icon: Download,
    path: '/inventory/inbound',
  },
  {
    title: '出库管理',
    desc: '处理出库业务',
    icon: Upload,
    path: '/inventory/outbound',
  },
  {
    title: '库存盘点',
    desc: '进行库存核对',
    icon: List,
    path: '/inventory/stock-check',
  },
]

const alerts = ref([
  { id: 1, label: '预警', type: 'danger', title: 'A区货架库存不足', time: '10 分钟前' },
  { id: 2, label: '提醒', type: 'warning', title: 'B类物资即将临期', time: '1 小时前' },
  { id: 3, label: '通知', type: 'success', title: '今日盘点任务已完成', time: '今天 09:20' },
])

const activities = ref([
  { id: 1, type: 'primary', content: '管理员完成了 12 条入库记录', time: '今天 09:30' },
  { id: 2, type: 'success', content: '出库申请已审核通过', time: '今天 10:05' },
  { id: 3, type: 'warning', content: '发现 3 条库存预警信息', time: '今天 11:10' },
  { id: 4, type: 'info', content: '系统数据同步完成', time: '今天 12:00' },
])

// 加载概览数据
const loadOverviewData = async () => {
  const res = await getOverview()
  const d = res.data
  overview.totalGoods = d.totalGoods
  overview.todayInbound = d.todayInbound
  overview.todayOutbound = d.todayOutbound
  overview.warningCount = d.warningCount

  statCards.value = [
    { title: '物资总数', value: String(d.totalGoods), icon: Goods, colorClass: 'blue' },
    { title: '今日入库', value: String(d.todayInbound), icon: Download, colorClass: 'green' },
    { title: '今日出库', value: String(d.todayOutbound), icon: Upload, colorClass: 'orange' },
    { title: '库存预警', value: String(d.warningCount), icon: Bell, colorClass: 'red' },
  ]
}

// 路由跳转
const handleNavigate = (path) => {
  router.push(path)
}

onMounted(async () => {
  await loadOverviewData()
})
</script>

<style scoped>
.home-page {
  padding: 20px;
  background: #f5f7fb;
  min-height: 100%;
  box-sizing: border-box;
}

.welcome-card {
  border-radius: 16px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #e8f3ff 0%, #f8fbff 100%);
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.title-row h2 {
  margin: 0;
  font-size: 24px;
  color: #1f2d3d;
}

.subtitle {
  margin: 0 0 18px;
  color: #606266;
  line-height: 1.7;
}

.welcome-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.mini-stat {
  min-width: 100px;
}

.mini-label {
  display: block;
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}

.mini-value {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
}

.mini-value.warning {
  color: #f56c6c;
}

.welcome-illustration {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 160px;
}

.warehouse-icon {
  font-size: 72px;
  color: #409eff;
  margin-bottom: 8px;
}

.illustration-tip {
  color: #606266;
  font-size: 14px;
}

.section-row {
  margin-top: 16px;
}

.stat-card {
  border-radius: 14px;
}

.stat-card-body {
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
}

.section-card {
  border-radius: 14px;
  margin-top: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: #303133;
}

.quick-link {
  padding: 18px 14px;
  border-radius: 12px;
  background: #f7f9fc;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.quick-link:hover {
  transform: translateY(-2px);
  background: #ecf5ff;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.12);
}

.quick-link-icon {
  font-size: 26px;
  color: #409eff;
  margin-bottom: 10px;
}

.quick-link-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.quick-link-desc {
  font-size: 13px;
  color: #909399;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fafafa;
}

.alert-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.alert-title {
  color: #303133;
}

.alert-time {
  color: #909399;
  font-size: 13px;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .welcome-illustration {
    align-items: flex-start;
  }
}

/* 给统计卡片图标补充颜色（原代码缺失） */
.stat-icon.blue {
  background: #ecf5ff;
  color: #409eff;
}
.stat-icon.green {
  background: #f0f9ff;
  color: #67c23a;
}
.stat-icon.orange {
  background: #fdf6ec;
  color: #e6a23c;
}
.stat-icon.red {
  background: #fef0f0;
  color: #f56c6c;
}
</style>