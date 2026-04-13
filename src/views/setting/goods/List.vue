<template>
  <div>
    <!-- 搜索栏 -->
    <el-card shadow="never" class="mb-4">
      <el-form :model="searchForm" inline>
        <el-form-item label="物资名称">
          <el-input
              v-model="searchForm.name"
              placeholder="请输入物资名称"
              clearable
              style="width: 180px"
          />
        </el-form-item>

        <el-form-item label="物资编码">
          <el-input
              v-model="searchForm.code"
              placeholder="请输入物资编码"
              clearable
              style="width: 160px"
          />
        </el-form-item>

        <el-form-item label="分类">
          <el-select
              v-model="searchForm.categoryId"
              placeholder="全部分类"
              clearable
              style="width: 140px"
          >
            <el-option
                v-for="opt in categoryOptions"
                :key="opt.id"
                :label="opt.name"
                :value="opt.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
              v-model="searchForm.status"
              placeholder="全部状态"
              clearable
              style="width: 120px"
          >
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
        <el-table-column prop="code" label="物资编码" width="120" />
        <el-table-column prop="name" label="物资名称" min-width="140" />

        <el-table-column label="分类" width="110">
          <template #default="{ row }">
            {{ getCategoryName(row.categoryId) || '-' }}
          </template>
        </el-table-column>

        <el-table-column
            prop="specification"
            label="规格"
            width="130"
            show-overflow-tooltip
        />
        <el-table-column prop="unit" label="单位" width="70" />

        <el-table-column prop="price" label="单价(元)" width="100">
          <template #default="{ row }">
            {{ Number(row.price || 0).toFixed(2) }}
          </template>
        </el-table-column>

        <el-table-column prop="minStock" label="预警下限" width="90" />
        <el-table-column prop="maxStock" label="预警上限" width="90" />

        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openDialog('edit', row)">
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              删除
            </el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination.vue'
import AddEdit from './AddEdit.vue'

// 下面这些接口方法由你自己实现
import {
  getGoodsList,
  deleteGoods,
  getCategoryList
} from '@/api/api.js'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const categoryOptions = ref([])

const searchForm = reactive({
  name: '',
  code: '',
  categoryId: '',
  status: ''
})

const loadCategoryOptions = async () => {
  const res = await getCategoryList()
  categoryOptions.value = res.data || []
}

const getCategoryName = (categoryId) => {
  const item = categoryOptions.value.find((i) => i.id === categoryId)
  return item ? item.name : ''
}

const formatDateTime = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getGoodsList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm
    })
    tableData.value = res.data.rows || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    code: '',
    categoryId: '',
    status: ''
  })
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

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除物资「${row.name}」？`, '提示', { type: 'warning' })
      .then(async () => {
        await deleteGoods(row.id)
        ElMessage.success('删除成功')
        loadData()
      })
      .catch(() => {})
}

onMounted(async () => {
  await loadCategoryOptions()
  await loadData()
})
</script>