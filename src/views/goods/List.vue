<template>
  <div>
    <!-- 搜索栏 -->
    <el-card shadow="never" class="mb-4">
      <el-form :model="searchForm" inline>
        <el-form-item label="物资名称">
          <el-input v-model="searchForm.name" placeholder="请输入物资名称" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="物资编码">
          <el-input v-model="searchForm.code" placeholder="请输入物资编码" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category_id" placeholder="全部分类" clearable style="width: 140px">
            <el-option
              v-for="opt in categoryOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 + 表格 -->
    <el-card shadow="never">
      <div class="mb-4 flex justify-between items-center">
        <span class="font-bold text-gray-700">物资列表</span>
        <el-button type="primary" :icon="Plus" @click="openDialog('add')">新增物资</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="code"          label="物资编码"   width="120" />
        <el-table-column prop="name"          label="物资名称"   min-width="140" />
        <el-table-column label="分类" width="110">
          <template #default="{ row }">{{ categoryMap[row.category_id] || '-' }}</template>
        </el-table-column>
        <el-table-column prop="specification" label="规格"       width="130" show-overflow-tooltip />
        <el-table-column prop="unit"          label="单位"       width="70"  />
        <el-table-column prop="price"         label="单价(元)"   width="100">
          <template #default="{ row }">{{ Number(row.price).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="min_stock"     label="预警下限"   width="90"  />
        <el-table-column prop="max_stock"     label="预警上限"   width="90"  />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openDialog('edit', row)">编辑</el-button>
            <ConfirmButton :message="`确认删除物资「${row.name}」？`" size="small" @confirm="handleDeleteConfirm(row)" />
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        @page-change="loadData"
        @size-change="loadData"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <AddEdit
      v-model:visible="dialogVisible"
      :type="dialogType"
      :row-data="editRow"
      :category-options="categoryOptions"
      @saved="loadData"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getGoodsList, deleteGoods } from '@/api/goods.js'
import { CATEGORY_OPTIONS, CATEGORY_MAP } from '@/constants/wms.js'
import Pagination from '@/components/Pagination.vue'
import AddEdit from './AddEdit.vue'
import ConfirmButton from '@/components/common/ConfirmButton.vue'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const categoryOptions = CATEGORY_OPTIONS
const categoryMap = CATEGORY_MAP

const searchForm = reactive({ name: '', code: '', category_id: '', status: '' })

const loadData = async () => {
  loading.value = true
  try {
    const res = await getGoodsList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm,
    })
    tableData.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleReset = () => {
  Object.assign(searchForm, { name: '', code: '', category_id: '', status: '' })
  currentPage.value = 1
  loadData()
}

// 弹窗
const dialogVisible = ref(false)
const dialogType = ref('add')
const editRow = ref(null)

const openDialog = (type, row = null) => {
  dialogType.value = type
  editRow.value = row ? { ...row } : null
  dialogVisible.value = true
}

const handleDeleteConfirm = async (row) => {
  await deleteGoods(row.id)
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>
