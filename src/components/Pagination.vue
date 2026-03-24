<template>
  <div class="pagination-wrapper">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      background
      @current-change="emit('page-change', currentPage)"
      @size-change="emit('size-change', pageSize)"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  total: { type: Number, default: 0 },
  pageSizes: { type: Array, default: () => [10, 20, 50, 100] },
})

const currentPage = defineModel('currentPage', { default: 1 })
const pageSize = defineModel('pageSize', { default: 10 })

const emit = defineEmits(['page-change', 'size-change'])
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
