<template>
  <el-aside width="auto" style="background-color: #304156">
    <div class="logo-container">
      <el-icon class="logo-icon"><Box /></el-icon>
      <span v-if="!collapse" class="logo-text">言寺 WMS</span>
    </div>

    <el-menu
      :default-active="activeMenu"
      class="aside-menu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :collapse="collapse"
      @select="handleMenuSelect"
    >
      <template v-for="item in menus" :key="item.index">
        <el-sub-menu v-if="item.children" :index="item.index">
          <template #title>
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item v-for="child in item.children" :key="child.index" :index="child.index">
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
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Box, Odometer, Goods, Download, Upload, List, Setting } from '@element-plus/icons-vue'

const props = defineProps({
  collapse: { type: Boolean, default: false },
})

const router = useRouter()
const route = useRoute()

const menus = [
  {
    index: 'statistics',
    title: '统计概览',
    icon: Odometer,
    path: '/home/statistics/dashboard',
  },
  {
    index: 'goods',
    title: '物资管理',
    icon: Goods,
    children: [
      { index: 'goods-list', title: '物资列表', path: '/home/goods/list' },
    ],
  },
  {
    index: 'inventory',
    title: '库存管理',
    icon: List,
    children: [
      { index: 'inv-list',     title: '库存列表', path: '/home/inventory/list'     },
      { index: 'inv-inbound',  title: '入库管理', path: '/home/inventory/inbound'  },
      { index: 'inv-outbound', title: '出库管理', path: '/home/inventory/outbound' },
      { index: 'stock-check',  title: '库存盘点', path: '/home/inventory/stock-check' },
    ],
  },
  {
    index: 'settings',
    title: '系统设置',
    icon: Setting,
    path: '/home/settings',
  },
]

// 路径 -> 菜单 index 映射
const routeMenuMap = {}
const buildMap = (items) => {
  items.forEach((item) => {
    if (item.path) routeMenuMap[item.path] = item.index
    if (item.children) buildMap(item.children)
  })
}
buildMap(menus)

// 菜单 index -> 路径映射
const menuRouteMap = {}
const buildRouteMap = (items) => {
  items.forEach((item) => {
    if (item.path) menuRouteMap[item.index] = item.path
    if (item.children) buildRouteMap(item.children)
  })
}
buildRouteMap(menus)

const activeMenu = computed(() => {
  const path = route.path
  for (const [routePath, menuIndex] of Object.entries(routeMenuMap)) {
    if (path.startsWith(routePath)) return menuIndex
  }
  return 'statistics'
})

const handleMenuSelect = (key) => {
  const target = menuRouteMap[key]
  if (target) router.push(target)
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
  overflow: hidden;
  white-space: nowrap;
}
.logo-icon {
  font-size: 24px;
  flex-shrink: 0;
}
.logo-text {
  margin-left: 8px;
}
.aside-menu {
  border-right: none;
}
</style>
