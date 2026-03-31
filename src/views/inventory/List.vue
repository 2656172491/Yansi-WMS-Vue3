<template>
  <div>
    <!-- 搜索栏 -->
    <el-card shadow="never" class="mb-4">
      <el-form :model="searchForm" inline>
        <el-form-item label="物资名称">
          <el-input v-model="searchForm.goods_name" placeholder="请输入物资名称" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="物资编码">
          <el-input v-model="searchForm.goods_code" placeholder="请输入物资编码" clearable style="width: 160px" />
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
          <template #default="{ row }">{{ categoryMap[row.id] || '-' }}</template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="70" />
        <el-table-column prop="status" label="当前库存" width="100">
          <template #default="{ row }">
            <el-tag :type="getStockTagType(row)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="库存状态" width="100">
          <template #default="{ row }">
            <span :class="getStockStatusClass(row)">{{ getStockStatusText(row) }}</span>
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
import { CATEGORY_MAP } from '@/constants/wms.js'
import Pagination from '@/components/Pagination.vue'
import {getGoodsList} from "@/api/goods.js";

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const categoryMap = CATEGORY_MAP

const searchForm = reactive({ goods_name: '', goods_code: '' })

// 从物资数据中快速查找预警值
const goodsMinStockMap = ref({})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getGoodsList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm,
    })

    console.log(res.data.rows)

    goodsMinStockMap.value = Object.fromEntries(
        res.data.rows.map((g) => [g.code, g.minStock])
    )

    console.log(goodsMinStockMap.value)

    tableData.value = res.data.rows
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
  Object.assign(searchForm, { goods_name: '', goods_code: '' })
  currentPage.value = 1
  loadData()
}

const getStockTagType = (row) => {
  const min = goodsMinStockMap.value[row.code] ?? 0
  if (row.status <= min) return 'danger'
  if (row.status <= min * 1.5) return 'warning'
  return 'success'
}

const getStockStatusText = (row) => {
  const min = goodsMinStockMap.value[row.code] ?? 0
  if (row.status <= min) return '库存预警'
  if (row.status <= min * 1.5) return '库存偏低'
  return '库存正常'
}

const getStockStatusClass = (row) => {
  const min = goodsMinStockMap.value[row.code] ?? 0
  if (row.status <= min) return 'text-red-500 font-bold'
  if (row.status <= min * 1.5) return 'text-orange-400'
  return 'text-green-500'
}

onMounted(loadData)
</script>
