import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'
import { isLoggedIn } from '@/utils/auth.js'

const routes = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Layout,
    redirect: '/goods/list',
    children: [
      {
        path: 'goods/list',
        component: () => import('../views/goods/List.vue'),
        meta: { title: '物资管理' },
      },
      {
        path: 'goods/add',
        component: () => import('../views/goods/AddEdit.vue'),
        meta: { title: '新增物资' },
      },
      {
        path: 'goods/edit/:id',
        component: () => import('../views/goods/AddEdit.vue'),
        meta: { title: '编辑物资' },
      },
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
        path: 'statistics/dashboard',
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
  { path: '/:pathMatch(.*)*', redirect: '/login' },
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
    next('/goods/list')
  } else {
    next()
  }
})

export default router
