/**
 * useAuth.js — 认证相关 composable
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/authStore'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const username = computed(() => authStore.username)
  const roles = computed(() => authStore.roles)
  const userInfo = computed(() => authStore.userInfo)

  /**
   * 登录
   * @param {{ username: string, password: string, remember?: boolean }} credentials
   */
  const login = async (credentials) => {
    await authStore.doLogin(credentials)
    ElMessage.success('登录成功')
    router.push('/home/dashboard')
  }

  /** 登出 */
  const logout = async () => {
    await authStore.doLogout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }

  /**
   * 检查是否拥有某个权限
   * @param {string} perm
   * @returns {boolean}
   */
  const hasPermission = (perm) => authStore.hasPermission(perm)

  /** 加载当前用户信息 */
  const loadUserInfo = () => authStore.fetchUserInfo()

  /** 加载权限列表 */
  const loadPermissions = () => authStore.fetchPermissions()

  return {
    isLoggedIn,
    username,
    roles,
    userInfo,
    login,
    logout,
    hasPermission,
    loadUserInfo,
    loadPermissions,
  }
}
