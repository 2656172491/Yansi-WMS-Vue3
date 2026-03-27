<!-- 统计卡片组件 — 显示带图标的统计数值 -->
<!-- 用法示例：
  <StatCard title="总用户数" :value="100" :icon="UserFilled" color="blue" />
-->
<template>
  <el-card class="stat-card" shadow="hover">
    <div class="stat-box">
      <!-- 图标区域，通过 color prop 控制颜色主题 -->
      <div class="stat-icon" :class="color">
        <el-icon>
          <component :is="icon" />
        </el-icon>
      </div>
      <div class="stat-info">
        <div class="stat-title">{{ title }}</div>
        <div class="stat-value">{{ value }}</div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  /** 卡片标题 */
  title: {
    type: String,
    required: true,
  },
  /** 显示的数值 */
  value: {
    type: [Number, String],
    required: true,
  },
  /** Element Plus 图标组件 */
  icon: {
    type: [Object, Function],
    required: true,
  },
  /** 颜色主题：blue | green | orange | red */
  color: {
    type: String,
    default: 'blue',
    validator: (v) => ['blue', 'green', 'orange', 'red'].includes(v),
  },
})
</script>

<style scoped>
.stat-card {
  border-radius: var(--card-radius, 14px);
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--icon-radius, 14px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-icon.blue {
  background: var(--stat-blue-bg, #e8f3ff);
  color: var(--stat-blue-fg, #409eff);
}

.stat-icon.green {
  background: var(--stat-green-bg, #ecf9f0);
  color: var(--stat-green-fg, #67c23a);
}

.stat-icon.orange {
  background: var(--stat-orange-bg, #fff6e8);
  color: var(--stat-orange-fg, #e6a23c);
}

.stat-icon.red {
  background: var(--stat-red-bg, #fdecec);
  color: var(--stat-red-fg, #f56c6c);
}

.stat-title {
  font-size: 14px;
  color: var(--text-secondary, #909399);
  margin-bottom: 6px;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary, #303133);
}
</style>
