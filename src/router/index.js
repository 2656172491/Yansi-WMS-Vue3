import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home,
        meta: { title: '首页', module: '首页' },
      },
      {
        path: 'statistics/dashboard',
        name: 'statistics-dashboard',
        component: () => import('@/views/statistics/Dashboard.vue'),
        meta: { title: '工作台', module: '统计概览' },
      },
      {
        path: 'inventory/list',
        name: 'inventory-list',
        component: () => import('@/views/inventory/List.vue'),
        meta: { title: '库存列表', module: '库存管理' },
      },
      {
        path: 'inventory/inbound',
        name: 'inventory-inbound',
        component: () => import('@/views/inventory/Inbound.vue'),
        meta: { title: '入库管理', module: '库存管理' },
      },
      {
        path: 'inventory/outbound',
        name: 'inventory-outbound',
        component: () => import('@/views/inventory/Outbound.vue'),
        meta: { title: '出库管理', module: '库存管理' },
      },
      {
        path: 'setting/users',
        name: 'setting-users',
        component: () => import('@/views/setting/Users.vue'),
        meta: { title: '用户管理', module: '系统设置' },
      },
      {
        path: 'setting/roles',
        name: 'setting-roles',
        component: () => import('@/views/setting/Roles.vue'),
        meta: { title: '角色管理', module: '系统设置' },
      },
      {
        path: 'setting/warehouses',
        name: 'setting-warehouses',
        component: () => import('@/views/setting/Warehouses.vue'),
        meta: { title: '仓库管理', module: '系统设置' },
      },
      {
        path: 'setting/goods',
        name: 'setting-goods',
        component: () => import('@/views/setting/goods/List.vue'),
        meta: { title: '物资管理', module: '系统设置' },
      },
      {
        path: 'setting/logs',
        name: 'setting-logs',
        component: () => import('@/views/setting/Logs.vue'),
        meta: { title: '操作日志', module: '系统设置' },
      },
      {
        path: 'personal-center',
        name: 'personal-center',
        component: () => import('@/views/PersonalCenter.vue'),
        meta: { title: '个人中心', hidden: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面不存在', hidden: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// ✅ 正确写法：在守卫内部导入 useUserStore
router.beforeEach((to) => {
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  const token = user ? user.token : null

  // 已登录访问登录页 → 跳首页
  if (token && to.path === '/login') {
    return '/'
  }

  // 未登录访问非登录页 → 去登录
  if (!token && to.path !== '/login') {
    return '/login'
  }

  return true
})


export default router