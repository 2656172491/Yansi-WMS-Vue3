<template>
  <el-container style="height: 100vh">
    <Sidebar :collapse="isCollapse" />

    <el-container>
      <Header
        :collapse="isCollapse"
        :breadcrumb="currentBreadcrumb"
        :alert-count="alertCount"
        @toggle-collapse="isCollapse = !isCollapse"
      />

      <el-main class="main-container">
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
.main-container {
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
}
</style>
