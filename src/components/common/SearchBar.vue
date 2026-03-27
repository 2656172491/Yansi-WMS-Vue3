<!-- 搜索筛选栏组件 — 包含卡片标题、筛选表单以及查询/重置按钮 -->
<!-- 用法示例：
  <SearchBar title="用户管理" tag="系统账户" @search="handleSearch" @reset="handleReset">
    <el-form-item label="用户名">
      <el-input v-model="queryForm.username" placeholder="请输入用户名" clearable />
    </el-form-item>
    <template #actions>
      <el-button type="success" :icon="Plus" @click="openDialog('add')">新增用户</el-button>
    </template>
  </SearchBar>
-->
<template>
  <el-card class="search-bar-card" shadow="never">
    <template v-if="title" #header>
      <PageHeader :title="title" :tag="tag" />
    </template>

    <el-form :inline="true" class="search-bar-form">
      <!-- 筛选字段插槽 -->
      <slot />

      <!-- 固定的查询/重置按钮 + 额外操作 -->
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="$emit('search')">查询</el-button>
        <el-button :icon="Refresh" @click="$emit('reset')">重置</el-button>
        <!-- 额外操作按钮（如新增） -->
        <slot name="actions" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { Search, Refresh } from '@element-plus/icons-vue'
import PageHeader from './PageHeader.vue'

defineProps({
  /** 卡片标题（可选） */
  title: {
    type: String,
    default: '',
  },
  /** 标题右侧小标签（可选） */
  tag: {
    type: String,
    default: '',
  },
})

defineEmits(['search', 'reset'])
</script>

<style scoped>
.search-bar-card {
  border-radius: var(--card-radius, 14px);
  margin-bottom: var(--card-gap, 16px);
}

.search-bar-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
