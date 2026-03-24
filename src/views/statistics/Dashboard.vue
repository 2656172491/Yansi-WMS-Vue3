<template>
  <div>
    <!-- 统计卡片 -->
    <StatsCard :cards="statCards" class="mb-4" />

    <el-row :gutter="20">
      <!-- 出入库趋势 -->
      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-bold">出入库趋势</span>
              <el-radio-group v-model="chartPeriod" size="small" @change="loadTrend">
                <el-radio-button value="week">本周</el-radio-button>
                <el-radio-button value="month">本月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChartRef" style="height: 320px" />
        </el-card>
      </el-col>

      <!-- 分类占比 -->
      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <span class="font-bold">物资分类占比</span>
          </template>
          <div ref="categoryChartRef" style="height: 320px" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 预警信息 -->
    <el-card shadow="never" class="mt-4">
      <template #header>
        <span class="font-bold">预警信息</span>
      </template>
      <AlertsPanel :alerts="alerts" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { getOverview, getTrend, getCategoryStats } from '@/api/statistics.js'
import { STAT_CARDS_CONFIG, MOCK_ALERTS } from '@/constants/wms.js'
import StatsCard from '@/components/StatsCard.vue'
import AlertsPanel from '@/components/AlertsPanel.vue'

// ── 统计卡片 ──────────────────────────────────────────────
const statCards = ref([...STAT_CARDS_CONFIG])
const alerts = ref([...MOCK_ALERTS])

const loadOverview = async () => {
  const res = await getOverview()
  const d = res.data
  statCards.value = [
    { title: '物资总数',   value: String(d.totalGoods),     icon: 'Goods',   colorClass: 'bg-blue-100 text-blue-500'    },
    { title: '今日入库',   value: String(d.todayInbound),   icon: 'Download', colorClass: 'bg-green-100 text-green-500'  },
    { title: '今日出库',   value: String(d.todayOutbound),  icon: 'Upload',  colorClass: 'bg-orange-100 text-orange-500' },
    { title: '库存预警',   value: String(d.warningCount),   icon: 'Warning', colorClass: 'bg-red-100 text-red-500'      },
  ]
}

// ── 趋势折线图 ────────────────────────────────────────────
const trendChartRef = ref(null)
let trendChart = null
const chartPeriod = ref('week')

const initTrendChart = () => {
  trendChart = echarts.init(trendChartRef.value)
}

const loadTrend = async () => {
  const res = await getTrend({ period: chartPeriod.value })
  const { dates, inbound, outbound } = res.data
  trendChart?.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['入库', '出库'] },
    xAxis: { type: 'category', data: dates, boundaryGap: false },
    yAxis: { type: 'value' },
    series: [
      {
        name: '入库', type: 'line', data: inbound, smooth: true,
        itemStyle: { color: '#67C23A' }, areaStyle: { opacity: 0.1 },
      },
      {
        name: '出库', type: 'line', data: outbound, smooth: true,
        itemStyle: { color: '#E6A23C' }, areaStyle: { opacity: 0.1 },
      },
    ],
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
  })
}

// ── 分类饼图 ──────────────────────────────────────────────
const categoryChartRef = ref(null)
let categoryChart = null

const initCategoryChart = () => {
  categoryChart = echarts.init(categoryChartRef.value)
}

const loadCategoryStats = async () => {
  const res = await getCategoryStats()
  categoryChart?.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left', top: 'middle' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: res.data,
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } },
      },
    ],
  })
}

// ── 生命周期 ──────────────────────────────────────────────
const onResize = () => {
  trendChart?.resize()
  categoryChart?.resize()
}

onMounted(async () => {
  await loadOverview()
  initTrendChart()
  initCategoryChart()
  await Promise.all([loadTrend(), loadCategoryStats()])
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  trendChart?.dispose()
  categoryChart?.dispose()
})
</script>
