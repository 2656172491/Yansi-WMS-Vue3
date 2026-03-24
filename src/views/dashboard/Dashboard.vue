<template>
  <div class="w-full">
    <StatsCard :cards="statCards" />
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-bold">库存变动趋势</span>
              <el-radio-group v-model="chartPeriod" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div id="stockChart" style="height: 350px" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <span class="font-bold">预警信息</span>
          </template>
          <AlertsPanel :alerts="alerts" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useDashboard } from '@/composables/useDashboard.js'
import StatsCard from '@/components/StatsCard.vue'
import AlertsPanel from '@/components/AlertsPanel.vue'

const { statCards, alerts, chartPeriod } = useDashboard()
</script>
