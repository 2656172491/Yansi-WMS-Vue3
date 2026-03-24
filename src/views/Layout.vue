<template>
  <el-container style="height: 100vh; width: 100vw; margin: 0; padding: 0;">
    <Sidebar :collapse="isCollapse" />

    <el-container style="margin: 0; padding: 0; flex-direction: column;">
      <Header
          :collapse="isCollapse"
          :breadcrumb="currentBreadcrumb"
          :alert-count="alertCount"
          @toggle-collapse="isCollapse = !isCollapse"
          style="width: 100%; margin: 0; padding: 0;"
      />

      <el-main class="main-container" style="flex: 1; padding: 20px; background-color: #f5f7fa; overflow-y: auto;">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
const isCollapse = ref(false)
const alertCount = ref(2)

const currentBreadcrumb = computed(() => route.meta?.title || '统计概览')
</script>

<style scoped>
/* 样式保持简洁，避免干扰 */
.main-container {
  flex: 1;
}
</style>