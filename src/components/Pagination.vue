<template>
  <el-pagination
    v-bind="$attrs"
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    :page-sizes="pageSizes"
    layout="total, sizes, prev, pager, next, jumper"
    background
    @current-change="$emit('current-change', $event)"
    @size-change="$emit('size-change', $event)"
  />
</template>

<script setup>
defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
})

defineEmits(['current-change', 'size-change'])
</script>
