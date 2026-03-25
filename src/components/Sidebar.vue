<template>
  <el-aside width="auto" style="background-color: #304156; height: 100vh">
    <div class="logo-container">
      <el-icon class="logo-icon"><Box /></el-icon>
      <span v-show="!isCollapse">言寺 WMS</span>
    </div>

    <el-menu
      :default-active="activeMenu"
      class="aside-menu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :collapse="isCollapse"
      router
    >
      <el-menu-item index="/goods/list">
        <el-icon><Goods /></el-icon>
        <template #title>物资管理</template>
      </el-menu-item>

      <el-sub-menu index="inventory">
        <template #title>
          <el-icon><Box /></el-icon>
          <span>库存管理</span>
        </template>
        <el-menu-item index="/inventory/list">库存列表</el-menu-item>
        <el-menu-item index="/inventory/inbound">入库管理</el-menu-item>
        <el-menu-item index="/inventory/outbound">出库管理</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/statistics/dashboard">
        <el-icon><PieChart /></el-icon>
        <template #title>统计分析</template>
      </el-menu-item>

      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <template #title>系统设置</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Box, Goods, PieChart, Setting } from '@element-plus/icons-vue'

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()

const activeMenu = computed(() => route.path)
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #485668;
  gap: 8px;
}

.logo-icon {
  font-size: 24px;
}

.aside-menu {
  border-right: none;
}
</style>
