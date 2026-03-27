<!-- 数据表格组件 — 统一的卡片包装，含表头、加载状态、分页 -->
<!-- 用法示例：
  <DataTable
    title="用户列表"
    :total="filteredUsers.length"
    :loading="loading"
    :current-page="currentPage"
    :page-size="pageSize"
    @update:current-page="currentPage = $event"
  >
    <el-table :data="pagedUsers" border stripe style="width: 100%">
      <el-table-column prop="username" label="用户名" />
      ...
    </el-table>
  </DataTable>
-->
<template>
  <el-card class="data-table-card" shadow="never">
    <!-- 卡片标题行 -->
    <template #header>
      <div class="data-table-header">
        <span class="data-table-title">{{ title }}</span>
        <slot name="header-extra">
          <span class="data-table-tip">共 {{ total }} 条数据</span>
        </slot>
      </div>
    </template>

    <!-- 表格内容插槽（el-table 内置 empty-text 处理空状态） -->
    <slot />

    <!-- 分页（有数据时才显示） -->
    <div v-if="total > 0" class="pagination-box">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="$emit('update:currentPage', $event)"
      />
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  /** 卡片标题 */
  title: {
    type: String,
    default: '数据列表',
  },
  /** 是否加载中 */
  loading: {
    type: Boolean,
    default: false,
  },
  /** 数据总条数（用于分页显示判断） */
  total: {
    type: Number,
    default: 0,
  },
  /** 当前页码 */
  currentPage: {
    type: Number,
    default: 1,
  },
  /** 每页条数 */
  pageSize: {
    type: Number,
    default: 10,
  },
})

defineEmits(['update:currentPage'])
</script>

<style scoped>
.data-table-card {
  border-radius: var(--card-radius, 14px);
}

.data-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-table-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary, #303133);
}

.data-table-tip {
  font-size: 13px;
  color: var(--text-secondary, #909399);
  font-weight: 400;
}

.pagination-box {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
