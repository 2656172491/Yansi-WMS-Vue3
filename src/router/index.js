import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'
import { isLoggedIn } from '../utils/auth.js'
import Home from "@/views/Home.vue";

const routes = [
  { path: '/login', component: Login },

  {
    path: '/',
    component: Layout,
    redirect: '/home', // 默认首页
    children: [
      {
        path: 'home',
        component: Home,
        meta: { title: '首页' },
      },
      // ==========================
      // 1. 统计概览（一级目录）
      // ==========================
      {
        path: '/statistics',
        meta: { title: '统计概览' },
        redirect: '/statistics/dashboard',
        children: [
          {
            path: 'dashboard', // 简写，不用写全路径
            component: () => import('../views/statistics/Dashboard.vue'),
            meta: { title: '工作台' },
          },
        ]
      },

      // ==========================
      // 2. 物资管理（一级目录）
      // ==========================
      {
        path: '/goods',
        meta: { title: '物资管理' },
        redirect: '/goods/list',
        children: [
          {
            path: 'list',
            component: () => import('../views/goods/List.vue'),
            meta: { title: '物资列表' },
          },
        ]
      },

      // ==========================
      // 3. 库存管理（一级目录）
      // ==========================
      {
        path: '/inventory',
        meta: { title: '库存管理' },
        redirect: '/inventory/list',
        children: [
          {
            path: 'list',
            component: () => import('../views/inventory/List.vue'),
            meta: { title: '库存列表' },
          },
          {
            path: 'stock-check',
            component: () => import('../views/inventory/StockCheck.vue'),
            meta: { title: '库存盘点' },
          },
          {
            path: 'inbound',
            component: () => import('../views/inventory/Inbound.vue'),
            meta: { title: '入库管理' },
          },
          {
            path: 'outbound',
            component: () => import('../views/inventory/Outbound.vue'),
            meta: { title: '出库管理' },
          },
        ]
      },

      // ==========================
      // 4. 系统设置（一级目录）
      // ==========================
      {
        path: '/setting',
        meta: { title: '系统设置' },
        redirect: '/setting/users',
        children: [
          {
            path: 'users',
            component: () => import('../views/setting/Users.vue'),
            meta: { title: '用户管理' },
          },
          {
            path: 'roles',
            component: () => import('../views/setting/Roles.vue'),
            meta: { title: '角色管理' },
          },
          {
            path: 'warehouses',
            component: () => import('../views/setting/Warehouses.vue'),
            meta: { title: '仓库管理' },
          },
          {
            path: 'config',
            component: () => import('../views/setting/Config.vue'),
            meta: { title: '系统参数' },
          },
          {
            path: 'logs',
            component: () => import('../views/setting/Logs.vue'),
            meta: { title: '操作日志' },
          },
        ]
      },

      // ==========================
      // 5. 个人中心（单级）
      // ==========================
      {
        path: '/personal-center',
        component: () => import('../views/PersonalCenter.vue'),
        meta: { title: '个人中心' },
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const loggedIn = isLoggedIn()
  if (!loggedIn && to.path !== '/login') next('/login')
  else if (loggedIn && to.path === '/login') next('/')
  else next()
})

export default router