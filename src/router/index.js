import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'
import { isLoggedIn } from '../utils/auth.js'

const routes = [
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/statistics/dashboard',
    children: [
      // ── 统计概览 ──────────────────────────────────────
      {
        path: 'statistics/dashboard',
        component: () => import('../views/statistics/Dashboard.vue'),
        meta: { title: '统计概览' },
      },
      // ── 物资管理 ──────────────────────────────────────
      {
        path: 'goods/list',
        component: () => import('../views/goods/List.vue'),
        meta: { title: '物资列表' },
      },
      // ── 库存管理 ──────────────────────────────────────
      {
        path: 'inventory/list',
        component: () => import('../views/inventory/List.vue'),
        meta: { title: '库存列表' },
      },
      {
        path: 'inventory/inbound',
        component: () => import('../views/inventory/Inbound.vue'),
        meta: { title: '入库管理' },
      },
      {
        path: 'inventory/outbound',
        component: () => import('../views/inventory/Outbound.vue'),
        meta: { title: '出库管理' },
      },
      {
        path: 'inventory/stock-check',
        component: () => import('../views/inventory/StockCheck.vue'),
        meta: { title: '库存盘点' },
      },
      // ── 系统页面 ──────────────────────────────────────
      {
        path: 'settings',
        component: () => import('../views/Settings.vue'),
        meta: { title: '系统设置' },
      },
      {
        path: 'personal-center',
        component: () => import('../views/PersonalCenter.vue'),
        meta: { title: '个人中心' },
      },
    ],
  },
  { path: '/', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const loggedIn = isLoggedIn()
  if (!loggedIn && to.path !== '/login') {
    next('/login')
  } else if (loggedIn && to.path === '/login') {
    next('/home')
  } else {
    next()
  }
})

export default router