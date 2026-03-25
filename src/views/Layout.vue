<template>
  <el-container style="height: 100vh; margin: 0; padding: 0">
    <Sidebar :is-collapse="isCollapse" />

    <el-container style="height: 100vh">
      <Header :is-collapse="isCollapse" @toggle-collapse="isCollapse = !isCollapse" />

      <!-- 主内容区域 -->
      <el-main class="main-container">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'

const isCollapse = ref(false)
</script>

<style scoped>
.main-container {
  padding: 20px;
  background-color: #f5f7fa;
  height: calc(100vh - 60px);
  overflow: auto;
}
</style>