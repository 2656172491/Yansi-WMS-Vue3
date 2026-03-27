<!-- 空状态组件 — 标准化的无数据占位展示 -->
<!-- 用法示例：
  <EmptyState message="暂无用户数据" description="请点击新增按钮添加用户" />
-->
<template>
  <div class="empty-state">
    <el-empty :description="description || message">
      <template v-if="$slots.default" #default>
        <slot />
      </template>
    </el-empty>
  </div>
</template>

<script setup>
defineProps({
  /** 主提示文字 */
  message: {
    type: String,
    default: '暂无数据',
  },
  /** el-empty description 属性（优先级高于 message） */
  description: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.empty-state {
  padding: 32px 0;
  text-align: center;
}
</style>
