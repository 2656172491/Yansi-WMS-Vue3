<template>
  <el-container style="height: 100vh">
    <!-- 侧边栏 -->
    <el-aside width="auto" style="background-color: #304156">
      <div class="logo-container" v-if="!isCollapse">
        <el-icon class="logo-icon"><Box /></el-icon>
        <span>言寺 WMS</span>
      </div>
      <div class="logo-container" v-else>
        <el-icon class="logo-icon"><Box /></el-icon>
      </div>

      <el-menu
        :default-active="activeMenu"
        class="aside-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :collapse="isCollapse"
        @select="handleMenuSelect"
      >
        <el-menu-item index="dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>工作台</template>
        </el-menu-item>
        <el-sub-menu index="inventory">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>库存管理</span>
          </template>
          <el-menu-item index="stock-list">库存列表</el-menu-item>
          <el-menu-item index="stock-check">库存盘点</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="inbound">
          <el-icon><Download /></el-icon>
          <template #title>入库管理</template>
        </el-menu-item>
        <el-menu-item index="outbound">
          <el-icon><Upload /></el-icon>
          <template #title>出库管理</template>
        </el-menu-item>
        <el-menu-item index="settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部 Header -->
      <el-header class="header-container">
        <div class="flex items-center">
          <el-icon
            class="cursor-pointer text-xl text-gray-600 hover:text-blue-500 mr-4"
            @click="isCollapse = !isCollapse"
          >
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentBreadcrumb }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="flex items-center gap-4">
          <el-badge :value="3" class="item cursor-pointer">
            <el-icon class="text-xl text-gray-600"><Bell /></el-icon>
          </el-badge>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link flex items-center cursor-pointer text-gray-700">
              <el-avatar
                :size="32"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                class="mr-2"
              />
              管理员
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区域 -->
      <el-main class="main-container">
        <!-- 工作台 -->
        <div v-if="activeMenu === 'dashboard'">
          <StatsCard :cards="statCards" />
          <el-row :gutter="20">
            <el-col :span="16">
              <el-card shadow="never">
                <template #header>
                  <div class="flex justify-between items-center">
                    <span class="font-bold">库存变动趋势</span>
                    <el-radio-group v-model="chartPeriod" size="small">
                      <el-radio-button label="week">本周</el-radio-button>
                      <el-radio-button label="month">本月</el-radio-button>
                    </el-radio-group>
                  </div>
                </template>
                <div id="stockChart" style="height: 350px" />
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="never">
                <template #header>
                  <span class="font-bold">预警信息</span>
                </template>
                <AlertsPanel :alerts="alerts" />
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 库存列表 -->
        <div v-else-if="activeMenu === 'stock-list'">
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
        </div>

        <!-- 未实现模块 -->
        <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
          <el-icon class="text-6xl mb-4"><FolderOpened /></el-icon>
          <p class="text-lg">该模块功能开发中...</p>
          <p class="text-sm mt-2">当前仅演示 [工作台] 与 [库存列表] 功能</p>
          <el-button type="primary" class="mt-6" @click="activeMenu = 'stock-list'">
            返回库存列表
          </el-button>
        </div>
      </el-main>
    </el-container>
  </el-container>

  <!-- 新增/编辑商品对话框 -->
  <ProductDialog
    v-model:visible="dialogVisible"
    :title="dialogTitle"
    :form-data="formData"
    :saving="saving"
    @save="handleSave"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MENU_BREADCRUMB_MAP } from '@/constants/wms.js'
import { useDashboard } from '@/composables/useDashboard.js'
import { useTable } from '@/composables/useTable.js'
import { useProductForm } from '@/composables/useProductForm.js'
import StatsCard from '@/components/StatsCard.vue'
import AlertsPanel from '@/components/AlertsPanel.vue'
import ProductsTable from '@/components/ProductsTable.vue'
import ProductDialog from '@/components/ProductDialog.vue'

// 仪表板数据
const { statCards, alerts, chartPeriod } = useDashboard()

// 表格数据与操作
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

// 表单/对话框状态
const {
  dialogVisible,
  saving,
  formData,
  dialogTitle,
  openDialog,
  saveData,
} = useProductForm()

// UI 状态
const isCollapse = ref(false)
const activeMenu = ref('dashboard')

const currentBreadcrumb = computed(() => MENU_BREADCRUMB_MAP[activeMenu.value] || '首页')

const handleMenuSelect = (key) => {
  activeMenu.value = key
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该商品？', '提示', { type: 'warning' })
    .then(() => {
      deleteItem(row)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

const handleSave = (data) => {
  saveData(data, addItem, updateItem)
}

const handleLogout = () => {
  ElMessageBox.confirm('确定退出登录？', '提示', { type: 'warning' })
    .then(() => ElMessage.success('退出成功'))
    .catch(() => {})
}
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #485668;
}
.logo-icon {
  font-size: 24px;
  margin-right: 8px;
}
.aside-menu {
  border-right: none;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}
.main-container {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>