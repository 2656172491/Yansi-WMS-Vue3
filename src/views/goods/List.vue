<template>
  <div>
    <ProductsTable
      v-model:search-query="searchQuery"
      v-model:search-category="searchCategory"
      :data="paginatedData"
      :loading="loading"
      :total="filteredTableData.length"
      :page-size="pageSize"
      @add="openDialog('add')"
      @edit="openDialog('edit', $event)"
      @delete="handleDelete"
      @page-change="handlePageChange"
      @reset="resetSearch"
    />

    <ProductDialog
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :form-data="formData"
      :saving="saving"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTable } from '@/composables/useTable.js'
import { useProductForm } from '@/composables/useProductForm.js'
import ProductsTable from '@/components/ProductsTable.vue'
import ProductDialog from '@/components/ProductDialog.vue'

const {
  loading,
  searchQuery,
  searchCategory,
  pageSize,
  filteredTableData,
  paginatedData,
  handlePageChange,
  resetSearch,
  addItem,
  updateItem,
  deleteItem,
} = useTable()

const {
  dialogVisible,
  saving,
  formData,
  dialogTitle,
  openDialog,
  saveData,
} = useProductForm()

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该物资？', '提示', { type: 'warning' })
    .then(() => {
      deleteItem(row)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

const handleSave = (data) => {
  saveData(data, addItem, updateItem)
}
</script>
