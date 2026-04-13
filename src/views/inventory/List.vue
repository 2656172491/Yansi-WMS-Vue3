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

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never">
      <template #header>
        <span class="font-bold text-gray-700">库存列表</span>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="code" label="物资编码" width="130" />
        <el-table-column prop="name" label="物资名称" min-width="140" />

        <el-table-column label="分类" width="110">
          <template #default="{ row }">
            {{ categoryMap[row.categoryId] || '-' }}
          </template>
        </el-table-column>

        <el-table-column prop="unit" label="单位" width="70" />

        <el-table-column label="当前库存" width="100">
          <template #default="{ row }">
            <el-tag :type="getStockTagType(row)" size="small">
              {{ getQuantity(row) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="库存状态" width="100">
          <template #default="{ row }">
            <span :class="getStockStatusClass(row)">
              {{ getStockStatusText(row) }}
            </span>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination.vue'
import { getGoodsList, getQuantityById, getCategoryList } from '@/api/api.js'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 分类下拉和映射
const categoryOptions = ref([])
const categoryMap = ref({})

// 搜索条件
const searchForm = reactive({
  name: '',
  code: '',
  categoryId: '',
})

// 每个物资的最小库存映射：{ [code]: minStock }
const goodsMinStockMap = ref({})

/**
 * 加载分类数据
 */
const loadCategoryOptions = async () => {
  try {
    const res = await getCategoryList()
    const list = Array.isArray(res.data) ? res.data : (res.data?.rows || [])

    categoryOptions.value = list
    categoryMap.value = Object.fromEntries(
        list.map((item) => [item.id, item.name])
    )
  } catch (error) {
    categoryOptions.value = []
    categoryMap.value = {}
  }
}

/**
 * 加载物资列表
 */
const fetchGoodsList = async () => {
  const res = await getGoodsList({
    page: currentPage.value,
    pageSize: pageSize.value,
    ...searchForm,
  })

  return {
    rows: res.data?.rows || [],
    total: res.data?.total || 0,
  }
}

/**
 * 获取单个物资库存数量
 */
const fetchGoodsQuantity = async (goodsId) => {
  try {
    const res = await getQuantityById(goodsId)
    return res.data?.[0]?.quantity || 0
  } catch (error) {
    return 0
  }
}

/**
 * 批量补充 quantity 字段
 */
const fillQuantityForRows = async (rows) => {
  await Promise.all(
      rows.map(async (row) => {
        row.quantity = await fetchGoodsQuantity(row.id)
      })
  )
  return rows
}

/**
 * 加载页面数据
 */
const loadData = async () => {
  loading.value = true
  try {
    const { rows, total: listTotal } = await fetchGoodsList()

    goodsMinStockMap.value = Object.fromEntries(
        rows.map((item) => [item.code, item.minStock ?? 0])
    )

    const enrichedRows = await fillQuantityForRows(rows)

    tableData.value = enrichedRows
    total.value = listTotal
  } finally {
    loading.value = false
  }
}

/**
 * 查询
 */
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

/**
 * 重置
 */
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    code: '',
    categoryId: '',
  })
  currentPage.value = 1
  loadData()
}

/**
 * 获取最小库存
 */
const getMinStock = (row) => {
  return goodsMinStockMap.value[row.code] ?? 0
}

/**
 * 获取当前库存
 */
const getQuantity = (row) => {
  return row.quantity ?? 0
}

/**
 * 库存标签类型
 */
const getStockTagType = (row) => {
  const quantity = getQuantity(row)
  const minStock = getMinStock(row)

  if (quantity <= minStock) return 'danger'
  if (quantity <= minStock * 1.5) return 'warning'
  return 'success'
}

/**
 * 库存状态文本
 */
const getStockStatusText = (row) => {
  const quantity = getQuantity(row)
  const minStock = getMinStock(row)

  if (quantity <= minStock) return '库存预警'
  if (quantity <= minStock * 1.5) return '库存偏低'
  return '库存正常'
}

/**
 * 库存状态样式
 */
const getStockStatusClass = (row) => {
  const quantity = getQuantity(row)
  const minStock = getMinStock(row)

  if (quantity <= minStock) return 'text-red-500 font-bold'
  if (quantity <= minStock * 1.5) return 'text-orange-400'
  return 'text-green-500'
}

onMounted(async () => {
  await loadCategoryOptions()
  await loadData()
})
</script>