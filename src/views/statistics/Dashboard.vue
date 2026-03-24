<template>
  <div class="w-full">
    <el-card shadow="never" class="mb-4">
      <template #header>
        <span class="font-bold">统计分析</span>
      </template>
      <div class="flex flex-col items-center justify-center py-16 text-gray-400">
        <el-icon class="text-6xl mb-4" aria-label="统计图表图标"><PieChart /></el-icon>
        <p class="text-lg">统计分析模块</p>
        <p class="text-sm mt-2">数据报表与趋势分析功能开发中</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { PieChart } from '@element-plus/icons-vue'
</script>
