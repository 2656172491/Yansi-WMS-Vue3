<!-- 页面标题栏组件 — 左侧标题/标签，右侧可放操作按钮 -->
<!-- 用法示例：
  <PageHeader title="用户管理" tag="系统账户">
    <template #actions>
      <el-button type="success" @click="openDialog">新增用户</el-button>
    </template>
  </PageHeader>
-->
<template>
  <div class="page-header">
    <div class="header-left">
      <span class="header-title">{{ title }}</span>
      <el-tag v-if="tag" type="info" effect="light" class="header-tag">{{ tag }}</el-tag>
    </div>
    <div v-if="$slots.actions" class="header-right">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  /** 页面/区块标题 */
  title: {
    type: String,
    required: true,
  },
  /** 右侧小标签文字（可选） */
  tag: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary, #303133);
}

.header-tag {
  font-weight: 400;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
