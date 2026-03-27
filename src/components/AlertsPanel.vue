<template>
  <div class="space-y-4">
    <div
      v-for="item in alerts"
      :key="item.id"
      class="flex items-start p-2 border-b border-gray-100 last:border-0"
    >
      <el-tag :type="item.type" size="small" class="mr-3">{{ item.label }}</el-tag>
      <div>
        <div class="text-sm font-medium text-gray-700">{{ item.title }}</div>
        <div class="text-xs text-gray-400 mt-1">{{ item.time }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  alerts: {
    type: Array,
    required: true,
  },
})
</script>
