import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'

const routes = [
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/workbench',
    children: [
      {
        path: 'workbench',
        component: () => import('../views/workbench/Workbench.vue'),
        meta: { title: '工作台' },
      },
      {
        path: 'inventory/stock-list',
        component: () => import('../views/inventory/StockList.vue'),
        meta: { title: '库存列表' },
      },
      {
        path: 'inventory/stock-check',
        component: () => import('../views/inventory/StockCheck.vue'),
        meta: { title: '库存盘点' },
      },
      {
        path: 'inbound',
        component: () => import('../views/Inbound.vue'),
        meta: { title: '入库管理' },
      },
      {
        path: 'outbound',
        component: () => import('../views/Outbound.vue'),
        meta: { title: '出库管理' },
      },
      {
        path: 'statistics',
        component: () => import('../views/statistics/Dashboard.vue'),
        meta: { title: '统计分析' },
      },
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
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token')
  if (!isLoggedIn && to.path !== '/login') {
    next('/login')
  } else if (isLoggedIn && to.path === '/login') {
    next('/home/workbench')
  } else {
    next()
  }
})

export default router