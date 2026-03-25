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
        <template v-for="item in sidebarMenus" :key="item.index">
          <el-sub-menu v-if="item.children" :index="item.index">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>

            <el-menu-item
                v-for="child in item.children"
                :key="child.index"
                :index="child.index"
            >
              {{ child.title }}
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item v-else :index="item.index">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
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
                <el-dropdown-item @click="router.push('/personal-center')">个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区域 -->
      <el-main class="main-container">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import {
  Box,
  Odometer,
  Goods,
  Download,
  Upload,
  Setting, ArrowDown, Bell, MessageBox,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const sidebarMenus = [
  {
    index: 'dashboard',
    title: '工作台',
    icon: Odometer,
    path: '/statistics/dashboard',
  },
  {
    index: 'inventory',
    title: '库存管理',
    icon: MessageBox,
    children: [
      {
        index: 'stock-list',
        title: '库存列表',
        path: '/inventory/list',
      },
      {
        index: 'inbound',
        title: '入库管理',
        icon: Download,
        path: '/inventory/inbound',
      },
      {
        index: 'outbound',
        title: '出库管理',
        icon: Upload,
        path: '/inventory/outbound',
      },
      {
        index: 'stock-check',
        title: '库存盘点',
        path: '/inventory/stock-check',
      },
    ],
  },
  {
    index: 'goods',
    title: '物资管理',
    icon: Goods,
    path: '/goods/list',
  },
  {
    index: 'setting',
    title: '系统管理',
    icon: Setting,
    children: [
      {
        index: 'user-management',
        title: '用户管理',
        path: '/setting/users',
      },
      {
        index: 'role-management',
        title: '角色管理',
        path: '/setting/roles',
      },
      {
        index: 'warehouse-management',
        title: '仓库管理',
        path: '/setting/warehouses',
      },
      {
        index: 'setting-config',
        title: '系统参数',
        path: '/setting/config',
      },
      {
        index: 'log',
        title: '操作日志',
        path: '/setting/logs',
      },
    ],
  },
]

const menuRouteMap = {}

const buildMenuRouteMap = (menus) => {
  menus.forEach((item) => {
    if (item.path) menuRouteMap[item.index] = item.path
    if (item.children) buildMenuRouteMap(item.children)
  })
}

buildMenuRouteMap(sidebarMenus)

// 根据当前路由路径推导激活菜单项
const activeMenu = computed(() => {
  const path = route.path
  for (const [key, routePath] of Object.entries(menuRouteMap)) {
    if (path.startsWith(routePath)) return key
  }
  return 'dashboard'
})

const currentBreadcrumb = computed(() => route.meta?.title || '工作台')

// UI 状态
const isCollapse = ref(false)

const handleMenuSelect = (key) => {
  const target = menuRouteMap[key]
  if (target) router.push(target)
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