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
              <span class="mini-value">{{ overview.warningCount }}</span>
            </div>
          </div>
        </div>

        <div class="welcome-hero">
          <el-icon class="welcome-icon">
            <Box />
          </el-icon>
        </div>
      </div>
    </el-card>

    <!-- 数据卡片 -->
    <el-row :gutter="20" class="mt-4">
      <el-col
          v-for="card in statCards"
          :key="card.title"
          :xs="24"
          :sm="12"
          :md="6"
      >
        <el-card class="stat-card" shadow="never">
          <div class="stat-content">
            <div class="stat-icon" :class="card.colorClass">
              <el-icon>
                <component :is="card.icon" />
              </el-icon>
            </div>
            <div>
              <div class="stat-title">{{ card.title }}</div>
              <div class="stat-value">{{ card.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>


    <el-row :gutter="20"  class="mt-4">
      <!-- 预警信息 -->
      <el-col :span="12">
        <el-card class="section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <span>预警信息</span>
            </div>
          </template>

          <div class="alert-list">
            <div
                v-for="item in alerts"
                :key="item.id"
                class="alert-item"
            >
              <div class="alert-left">
                <el-tag :type="item.type" effect="light" size="small">
                  {{ item.label }}
                </el-tag>
                <span class="alert-title">{{ item.title }}</span>
              </div>
              <div class="alert-time">{{ item.time }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 最近动态 -->
      <el-col :xs="24" :md="12">
        <el-card class="section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <span>最近动态</span>
            </div>
          </template>

          <div class="alert-list">
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
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {computed, markRaw, onMounted, reactive, ref} from 'vue'
import { Box, Goods, Download, Upload, Bell } from '@element-plus/icons-vue'
import { getOverview, getQuickLinks, getAlerts, getActivities } from '@/api/home.js'

const userName = '管理员'

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
  { title: '物资总数', value: '0', icon: markRaw(Goods), colorClass: 'blue' },
  { title: '今日入库', value: '0', icon: markRaw(Download), colorClass: 'green' },
  { title: '今日出库', value: '0', icon: markRaw(Upload), colorClass: 'orange' },
  { title: '库存预警', value: '0', icon: markRaw(Bell), colorClass: 'red' },
])

const quickLinks = ref([])
const alerts = ref([])
const activities = ref([])

const loadHomeData = async () => {
  const [overviewRes, quickLinksRes, alertsRes, activitiesRes] = await Promise.all([
    getOverview(),
    getQuickLinks(),
    getAlerts(),
    getActivities(),
  ])

  const d = overviewRes.data
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

  quickLinks.value = quickLinksRes.data
  alerts.value = alertsRes.data
  activities.value = activitiesRes.data
}
onMounted(async () => {
  await loadHomeData()
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
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.welcome-text {
  flex: 1;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.title-row h2 {
  margin: 0;
  color: #303133;
}

.subtitle {
  margin: 12px 0 18px;
  color: #606266;
  line-height: 1.8;
}

.welcome-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.mini-stat {
  min-width: 110px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8fafc;
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

.welcome-hero {
  width: 120px;
  height: 120px;
  border-radius: 24px;
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f9ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.welcome-icon {
  font-size: 52px;
  color: #409eff;
}

.mt-4 {
  margin-top: 16px;
}

.stat-card {
  border-radius: 14px;
}

.stat-content {
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

.section-card {
  border-radius: 14px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: #303133;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 244px;
  overflow-y: auto;
  padding-right: 6px;
}

/* 美化滚动条（可选） */
.alert-list::-webkit-scrollbar {
  width: 6px;
}

.alert-list::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 999px;
}

.alert-list::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
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

  .welcome-hero {
    width: 90px;
    height: 90px;
  }

  .stat-value {
    font-size: 22px;
  }

  .alert-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>