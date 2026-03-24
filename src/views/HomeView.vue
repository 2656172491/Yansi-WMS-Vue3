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

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
}

.card-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  font-size: 28px;
}

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

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.mr-1 {
  margin-right: 4px;
}

.mr-2 {
  margin-right: 8px;
}

.mr-3 {
  margin-right: 12px;
}

.mr-4 {
  margin-right: 16px;
}

.mt-1 {
  margin-top: 4px;
}

.mt-2 {
  margin-top: 8px;
}

.mt-6 {
  margin-top: 24px;
}

.text-sm {
  font-size: 14px;
}

.text-lg {
  font-size: 18px;
}

.text-xl {
  font-size: 20px;
}

.text-2xl {
  font-size: 24px;
}

.text-6xl {
  font-size: 48px;
}

.text-gray-400 {
  color: #909399;
}

.text-gray-500 {
  color: #909399;
}

.text-gray-600 {
  color: #606266;
}

.text-gray-700 {
  color: #303133;
}

.text-gray-800 {
  color: #303133;
}

.text-red-500 {
  color: #f56c6c;
}

.text-blue-500 {
  color: #409eff;
}

.font-bold {
  font-weight: bold;
}

.font-medium {
  font-weight: 500;
}

.border-b {
  border-bottom: 1px solid #ebeef5;
}

.border-gray-100 {
  border-color: #f5f7fa;
}

.last\:border-0:last-child {
  border: none;
}

.space-y-4 > * + * {
  margin-top: 16px;
}

.h-full {
  height: 100%;
}

.w-full {
  width: 100%;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:text-blue-500:hover {
  color: #409eff;
}
</style>

<template>
  <el-container style="height: 100%">
    <!-- 侧边栏 -->
    <el-aside width="auto" style="background-color: #304156">
      <div class="logo-container" v-if="!isCollapse">
        <el-icon class="logo-icon"><Box /></el-icon>
        <span>智汇 WMS</span>
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
            @click="toggleCollapse"
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
              ></el-avatar>
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
        <!-- 视图：工作台 (Dashboard) -->
        <div v-if="activeMenu === 'dashboard'">
          <el-row :gutter="20" class="mb-6">
            <el-col :span="6" v-for="(card, index) in statCards" :key="index">
              <el-card shadow="hover" class="stat-card">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-gray-500 text-sm mb-2">{{ card.title }}</div>
                    <div class="text-2xl font-bold text-gray-800">{{ card.value }}</div>
                  </div>
                  <div class="card-icon-wrapper" :class="card.colorClass">
                    <el-icon><component :is="card.icon" /></el-icon>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

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
                <div id="stockChart" style="height: 350px"></div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="never">
                <template #header>
                  <span class="font-bold">预警信息</span>
                </template>
                <div class="space-y-4">
                  <div
                    v-for="item in alerts"
                    :key="item.id"
                    class="flex items-start p-2 border-b border-gray-100 last:border-0"
                  >
                    <el-tag :type="item.type" size="small" class="mr-3">{{
                      item.tag
                    }}</el-tag>
                    <div>
                      <div class="text-sm font-medium text-gray-700">
                        {{ item.content }}
                      </div>
                      <div class="text-xs text-gray-400 mt-1">{{ item.time }}</div>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 视图：库存列表 (Inventory) -->
        <div v-else-if="activeMenu === 'stock-list'">
          <el-card shadow="never">
            <!-- 搜索栏 -->
            <div class="flex justify-between mb-4">
              <div class="flex gap-2">
                <el-input
                  v-model="searchQuery"
                  placeholder="输入商品名称/SKU"
                  style="width: 200px"
                  @input="debounceSearch"
                  prefix-icon="Search"
                ></el-input>
                <el-select v-model="searchCategory" placeholder="全部分类" style="width: 150px">
                  <el-option label="电子产品" value="电子产品"></el-option>
                  <el-option label="家居用品" value="家居用品"></el-option>
                  <el-option label="办公耗材" value="办公耗材"></el-option>
                </el-select>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="resetSearch">重置</el-button>
              </div>
              <el-button type="primary" @click="openDialog('add')">
                <el-icon class="mr-1"><Plus /></el-icon> 新增商品
              </el-button>
            </div>

            <!-- 表格 -->
            <el-table :data="paginatedData" stripe style="width: 100%" v-loading="loading">
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column label="商品图片" width="100">
                <template #default="scope">
                  <el-image
                    style="width: 40px; height: 40px; border-radius: 4px"
                    :src="scope.row.image"
                    fit="cover"
                  ></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="商品名称" min-width="150"></el-table-column>
              <el-table-column prop="sku" label="SKU编号" width="120"></el-table-column>
              <el-table-column prop="category" label="分类" width="100">
                <template #default="scope">
                  <el-tag size="small">{{ scope.row.category }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="单价 (¥)" width="100" sortable></el-table-column>
              <el-table-column prop="stock" label="当前库存" width="120" sortable>
                <template #default="scope">
                  <span :class="scope.row.stock < 20 ? 'text-red-500 font-bold' : ''">{{
                    scope.row.stock
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <div class="flex items-center">
                    <span
                      class="status-dot"
                      :style="{ background: scope.row.status ? '#67C23A' : '#F56C6C' }"
                    ></span>
                    {{ scope.row.status ? '正常' : '下架' }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" fixed="right">
                <template #default="scope">
                  <el-button link type="primary" size="small" @click="openDialog('edit', scope.row)"
                    >编辑</el-button
                  >
                  <el-button link type="primary" size="small">出库</el-button>
                  <el-button link type="danger" size="small" @click="handleDelete(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="table-pagination">
              <el-pagination
                background
                layout="total, prev, pager, next, jumper"
                :total="filteredTableData.length"
                :page-size="pageSize"
                @current-change="handlePageChange"
              >
              </el-pagination>
            </div>
          </el-card>
        </div>

        <!-- 视图：未实现功能 (Placeholder) -->
        <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
          <el-icon class="text-6xl mb-4"><FolderOpened /></el-icon>
          <p class="text-lg">该模块功能开发中...</p>
          <p class="text-sm mt-2">当前仅演示 [工作台] 与 [库存列表] 功能</p>
          <el-button type="primary" class="mt-6" @click="activeMenu = 'stock-list'"
            >返回库存列表</el-button
          >
        </div>
      </el-main>
    </el-container>
  </el-container>

  <!-- 弹窗：新增/编辑商品 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
    <el-form :model="formData" label-width="80px" ref="formRef" @submit.prevent>
      <el-form-item label="商品名称" required>
        <el-input
          v-model="formData.name"
          placeholder="请输入商品名称"
          @keyup.enter="saveData"
        ></el-input>
      </el-form-item>
      <el-form-item label="SKU编号" required>
        <el-input
          v-model="formData.sku"
          placeholder="例如: SKU-001"
          @keyup.enter="saveData"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品分类" required>
        <el-select v-model="formData.category" placeholder="请选择" class="w-full">
          <el-option label="电子产品" value="电子产品"></el-option>
          <el-option label="家居用品" value="家居用品"></el-option>
          <el-option label="办公耗材" value="办公耗材"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="初始库存" required>
        <el-input-number v-model="formData.stock" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="单价" required>
        <el-input v-model="formData.price" placeholder="0.00" @keyup.enter="saveData">
          <template #prefix>¥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="formData.status" active-text="上架" inactive-text="下架"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData" :loading="saving">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDashboard } from './composables/useDashboard';
import { useTable } from './composables/useTable';
import type { Product, FormData } from './types';

// 使用 Composables
const { statCards, alerts, chartPeriod } = useDashboard();
const {
  tableData,
  paginatedData,
  loading,
  searchQuery,
  searchCategory,
  currentPage,
  pageSize,
  handleSearch,
  resetSearch,
  handleDelete,
  handlePageChange,
} = useTable();

// UI 状态
const isCollapse = ref(false);
const activeMenu = ref('dashboard');
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const saving = ref(false);

// 表单���据
const formData = ref<FormData>({
  name: '',
  sku: '',
  category: '',
  stock: 0,
  price: '',
  status: true,
});

// 计算属性
const currentBreadcrumb = computed(() => {
  const breadcrumbMap: Record<string, string> = {
    dashboard: '工作台',
    'stock-list': '库存列表',
    'stock-check': '库存盘点',
    inbound: '入库管理',
    outbound: '出库管理',
    settings: '系统设置',
  };
  return breadcrumbMap[activeMenu.value] || '首页';
});

const dialogTitle = computed(() =>
  dialogType.value === 'add' ? '新增商品' : '编辑商品'
);

// 防抖搜索
let searchTimer: NodeJS.Timeout;
const debounceSearch = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    handleSearch();
  }, 500);
};

// 切换侧边栏
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

// 菜单选择
const handleMenuSelect = (key: string) => {
  activeMenu.value = key;
};

// 打开对话框
const openDialog = (type: 'add' | 'edit', row?: Product) => {
  dialogType.value = type;
  if (type === 'edit' && row) {
    formData.value = {
      id: row.id,
      name: row.name,
      sku: row.sku,
      category: row.category,
      stock: row.stock,
      price: row.price,
      status: row.status,
    };
  } else {
    formData.value = {
      name: '',
      sku: '',
      category: '',
      stock: 0,
      price: '',
      status: true,
    };
  }
  dialogVisible.value = true;
};

// 保存数据
const saveData = async () => {
  // 表单验证
  if (!formData.value.name.trim()) {
    ElMessage.error('请输入商品名称');
    return;
  }
  if (!formData.value.sku.trim()) {
    ElMessage.error('请输入SKU编号');
    return;
  }
  if (!formData.value.category) {
    ElMessage.error('请选择商品分类');
    return;
  }
  if (!formData.value.price) {
    ElMessage.error('请输入单价');
    return;
  }

  saving.value = true;
  try {
    // 模拟 API 请求
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (dialogType.value === 'add') {
      // 新增
      const newProduct: Product = {
        id: Math.max(...tableData.value.map((p) => p.id), 0) + 1,
        name: formData.value.name,
        sku: formData.value.sku,
        category: formData.value.category,
        price: Number(formData.value.price),
        stock: formData.value.stock,
        status: formData.value.status,
        image: 'https://via.placeholder.com/40',
      };
      tableData.value.push(newProduct);
      ElMessage.success('新增商品成功');
    } else {
      // 编辑
      const index = tableData.value.findIndex((p) => p.id === formData.value.id);
      if (index !== -1) {
        tableData.value[index] = {
          ...tableData.value[index],
          name: formData.value.name,
          sku: formData.value.sku,
          category: formData.value.category,
          price: Number(formData.value.price),
          stock: formData.value.stock,
          status: formData.value.status,
        };
        ElMessage.success('编辑商品成功');
      }
    }

    dialogVisible.value = false;
  } finally {
    saving.value = false;
  }
};

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success('退出登录成功');
      // 这里可以调用退出登录 API
    })
    .catch(() => {
      // 用户取消
    });
};

// 监听搜索条件变化时重置分页
watch([searchQuery, searchCategory], () => {
  currentPage.value = 1;
});

onMounted(() => {
  // 页面初始化逻辑
  console.log('Dashboard 组件���加载');
});
</script>