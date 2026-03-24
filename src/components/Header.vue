<template>
  <el-header class="header-container">
    <div class="flex items-center">
      <el-icon
        class="cursor-pointer text-xl text-gray-600 hover:text-blue-500 mr-4"
        @click="emit('toggleCollapse')"
      >
        <component :is="collapse ? 'Expand' : 'Fold'" />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ breadcrumb }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="flex items-center gap-4">
      <el-badge :value="alertCount" class="item cursor-pointer">
        <el-icon class="text-xl text-gray-600"><Bell /></el-icon>
      </el-badge>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link flex items-center cursor-pointer text-gray-700">
          <el-avatar
            :size="32"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            class="mr-2"
          />
          {{ displayName }}
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="router.push('/home/personal-center')">个人中心</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/store/index.js'

const props = defineProps({
  collapse: { type: Boolean, default: false },
  breadcrumb: { type: String, default: '' },
  alertCount: { type: Number, default: 0 },
})

const emit = defineEmits(['toggleCollapse'])

const router = useRouter()
const authStore = useAuthStore()

const displayName = computed(() => authStore.realName || '管理员')

const handleLogout = () => {
  ElMessageBox.confirm('确定退出登录？', '提示', { type: 'warning' })
    .then(async () => {
      await authStore.logout()
      ElMessage.success('退出成功')
      router.push('/login')
    })
    .catch(() => {})
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}
</style>
