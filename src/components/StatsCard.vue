<template>
  <el-row :gutter="20" class="mb-6">
    <el-col :span="6" v-for="(card, index) in cards" :key="index">
      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-gray-500 text-sm mb-2">{{ card.title }}</div>
            <div class="text-2xl font-bold text-gray-800">{{ card.value }}</div>
          </div>
          <div class="card-icon-wrapper" :class="card.colorClass">
            <el-icon><component :is="card.icon" /></el-icon>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
defineProps({
  cards: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
}
.card-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  font-size: 28px;
}
</style>
