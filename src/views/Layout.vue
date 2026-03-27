<template>
  <el-container style="height: 100vh">
    <!-- 侧边栏 -->
    <el-aside width="auto" style="background-color: #304156">
      <div class="logo-container" v-if="!isCollapse" @click="router.push('/')">
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
          unique-opened="true"
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
            <el-breadcrumb-item>{{ currentBreadcrumb }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="flex items-center gap-4">
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

      <!-- 底部备案信息 -->
      <el-footer class="footer-container">
        <span>© 2026 Yansi WMS · 仓库管理系统</span>
        <span>备案号：粤ICP备XXXXXXXX号 &nbsp;·&nbsp; v1.0.0</span>
      </el-footer>
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
  Setting, ArrowDown
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
    icon: Box,
    children: [
      {
        index: 'stock-list',
        title: '库存列表',
        path: '/inventory/list',
      },
      {
        index: 'inbound',
        title: '入库管理',
        path: '/inventory/inbound',
      },
      {
        index: 'outbound',
        title: '出库管理',
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

// 建立菜单 index => path 的映射表
const menuRouteMap = {}
const buildMenuRouteMap = (menus) => {
  menus.forEach((item) => {
    if (item.path) menuRouteMap[item.path] = item.index
    if (item.children) buildMenuRouteMap(item.children)
  })
}
buildMenuRouteMap(sidebarMenus)

// 计算当前激活的菜单 —— 修复完成
const activeMenu = computed(() => {
  const path = route.path
  if (menuRouteMap[path]) return menuRouteMap[path]

  // 次级菜单匹配 /setting、/inventory 等
  for (const pathKey of Object.keys(menuRouteMap)) {
    if (path.startsWith(pathKey)) return menuRouteMap[pathKey]
  }

  // 不在菜单里的页面：个人中心 / 404 等 → 不高亮任何菜单
  return ''
})

// 面包屑
const currentBreadcrumb = computed(() => route.meta?.title || '页面')

// UI 状态
const isCollapse = ref(false)

const handleMenuSelect = (key) => {
  const path = Object.keys(menuRouteMap).find(p => menuRouteMap[p] === key)
  if (path) router.push(path)
}

const handleLogout = () => {
  ElMessageBox.confirm('确定退出登录？', '提示', { type: 'warning' })
      .then(() => {
        ElMessage.success('退出成功')
        router.push('/login')
      })
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
.footer-container {
  height: auto !important;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background-color: #fff;
  border-top: 1px solid #ebeef5;
  color: #909399;
  font-size: 12px;
}
</style>