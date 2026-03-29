<template>
  <div class="dashboard-page">
    <!-- 统计卡片 -->
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

    <el-row :gutter="20" class="section-row">
      <!-- 出入库趋势 -->
      <el-col :xs="24" :lg="16">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span class="panel-title">出入库趋势</span>
              <el-radio-group v-model="chartPeriod" size="small" @change="loadTrend">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
              </el-radio-group>
            </div>
          </template>

          <div ref="trendChartRef" class="chart-box" />
        </el-card>
      </el-col>

      <!-- 分类占比 -->
      <el-col :xs="24" :lg="8">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <span class="panel-title">物资分类占比</span>
          </template>

          <div ref="categoryChartRef" class="chart-box" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 预警信息 -->
<!--    <el-card class="panel-card warning-panel" shadow="never">-->
<!--      <template #header>-->
<!--        <span class="panel-title">预警信息</span>-->
<!--      </template>-->

<!--      <div class="warning-scroll">-->
<!--        <AlertsPanel :alerts="alerts" />-->
<!--      </div>-->
<!--    </el-card>-->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, markRaw, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getOverview, getTrend, getCategoryStats } from '@/api/statistics.js'
import { Bell, Download, Goods, Upload } from '@element-plus/icons-vue'

const statCards = ref([
  { title: '物资总数', value: '0', icon: markRaw(Goods), colorClass: 'blue' },
  { title: '今日入库', value: '0', icon: markRaw(Download), colorClass: 'green' },
  { title: '今日出库', value: '0', icon: markRaw(Upload), colorClass: 'orange' },
  { title: '库存预警', value: '0', icon: markRaw(Bell), colorClass: 'red' },
])

const loadOverview = async () => {
  try {
    const res = await getOverview()
    const d = res.data || {}
    statCards.value = [
      { title: '物资总数', value: d.CountGoods ?? 0, icon: markRaw(Goods), colorClass: 'blue' },
      { title: '今日入库', value: d.TodayInGoods ?? 0, icon: markRaw(Download), colorClass: 'green' },
      { title: '今日出库', value: d.todayOutbound ?? 0, icon: markRaw(Upload), colorClass: 'orange' },
      { title: '库存预警', value: d.InventoryWarning, icon: markRaw(Bell), colorClass: 'red' },
    ]
  } catch (e) {
    console.log('获取统计数据失败', e)
  }
}

const trendChartRef = ref(null)
let trendChart = null
const chartPeriod = ref('week')

const initTrendChart = async () => {
  await nextTick()
  trendChart = echarts.init(trendChartRef.value)
}

const loadTrend = async () => {
  try {
    const res = await getTrend({ period: chartPeriod.value })
    const { dates = [], inbound = [], outbound = [] } = res.data || {}

    trendChart?.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['入库', '出库'] },
      grid: { left: 40, right: 20, top: 40, bottom: 30 },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '入库',
          type: 'line',
          data: inbound,
          smooth: true,
          itemStyle: { color: '#67C23A' },
          areaStyle: { opacity: 0.1 },
        },
        {
          name: '出库',
          type: 'line',
          data: outbound,
          smooth: true,
          itemStyle: { color: '#E6A23C' },
          areaStyle: { opacity: 0.1 },
        },
      ],
    })
  } catch (e) {
    console.log('获取趋势数据失败', e)
  }
}

const categoryChartRef = ref(null)
let categoryChart = null

const initCategoryChart = async () => {
  await nextTick()
  categoryChart = echarts.init(categoryChartRef.value)
}

const loadCategoryStats = async () => {
  try {
    const res = await getCategoryStats()
    categoryChart?.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', left: 'left', top: 'middle' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          data: res.data || [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0,0,0,0.5)',
            },
          },
        },
      ],
    })
  } catch (e) {
    console.log('获取分类数据失败', e)
  }
}

const onResize = () => {
  trendChart?.resize()
  categoryChart?.resize()
}

onMounted(async () => {
  await loadOverview()
  await initTrendChart()
  await initCategoryChart()
  await Promise.all([loadTrend(), loadCategoryStats()])
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  trendChart?.dispose()
  categoryChart?.dispose()
})
</script>

<style scoped>
.dashboard-page {
  padding: 20px;
  box-sizing: border-box;
  background: #f5f7fb;
  min-height: 100%;
}

.section-row {
  margin-bottom: 16px;
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
  flex-shrink: 0;
}

.stat-info {
  min-width: 0;
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

.panel-card {
  border-radius: 14px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.panel-title {
  font-weight: 700;
  color: #303133;
}

.chart-box {
  height: 340px;
  width: 100%;
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 14px;
  }

  .chart-box {
    height: 280px;
  }

  .stat-value {
    font-size: 22px;
  }
}
</style>