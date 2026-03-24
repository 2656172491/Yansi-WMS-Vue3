<template>
  <el-card shadow="never">
    <!-- 搜索栏 -->
    <div class="flex justify-between mb-4">
      <div class="flex gap-2">
        <el-input
          :model-value="searchQuery"
          placeholder="输入商品名称/SKU"
          style="width: 200px"
          prefix-icon="Search"
          @update:model-value="$emit('update:searchQuery', $event)"
        />
        <el-select
          :model-value="searchCategory"
          placeholder="全部分类"
          style="width: 150px"
          clearable
          @update:model-value="$emit('update:searchCategory', $event)"
        >
          <el-option
            v-for="cat in categories"
            :key="cat.value"
            :label="cat.label"
            :value="cat.value"
          />
        </el-select>
        <el-button type="primary" @click="$emit('search')">查询</el-button>
        <el-button @click="$emit('reset')">重置</el-button>
      </div>
      <el-button type="primary" @click="$emit('add')">
        <el-icon class="mr-1"><Plus /></el-icon>新增商品
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="data" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="商品图片" width="100">
        <template #default="{ row }">
          <el-image
            style="width: 40px; height: 40px; border-radius: 4px"
            :src="row.image"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" min-width="150" />
      <el-table-column prop="sku" label="SKU编号" width="120" />
      <el-table-column prop="category" label="分类" width="100">
        <template #default="{ row }">
          <el-tag size="small">{{ row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价 (¥)" width="100" sortable />
      <el-table-column prop="stock" label="当前库存" width="120" sortable>
        <template #default="{ row }">
          <span :class="row.stock < 20 ? 'text-red-500 font-bold' : ''">{{ row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <div class="flex items-center">
            <span
              class="status-dot"
              :style="{ background: row.status ? '#67C23A' : '#F56C6C' }"
            />
            {{ row.status ? '正常' : '下架' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="$emit('edit', row)">编辑</el-button>
          <el-button link type="primary" size="small">出库</el-button>
          <el-button link type="danger" size="small" @click="$emit('delete', row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="table-pagination">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        @current-change="$emit('page-change', $event)"
      />
    </div>
  </el-card>
</template>

<script setup>
import { CATEGORIES } from '@/constants/wms.js'

defineProps({
  data: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  total: { type: Number, required: true },
  pageSize: { type: Number, default: 10 },
  searchQuery: { type: String, default: '' },
  searchCategory: { type: String, default: '' },
  categories: { type: Array, default: () => CATEGORIES },
})

defineEmits([
  'update:searchQuery',
  'update:searchCategory',
  'search',
  'reset',
  'add',
  'edit',
  'delete',
  'page-change',
])
</script>

<style scoped>
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}
.table-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
