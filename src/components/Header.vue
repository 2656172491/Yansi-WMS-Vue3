<template>
  <el-header class="header-container">
    <div class="flex items-center">
      <el-icon
        class="cursor-pointer text-xl text-gray-600 hover:text-blue-500 mr-4"
        @click="$emit('toggle-collapse')"
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
            <el-dropdown-item @click="handlePersonalCenter">个人中心</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Bell, ArrowDown } from '@element-plus/icons-vue'
import { removeToken } from '@/utils/auth.js'

defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-collapse'])

const route = useRoute()
const router = useRouter()

const currentBreadcrumb = computed(() => route.meta?.title || '首页')

const handlePersonalCenter = () => {
  router.push('/personal-center')
}

const handleLogout = () => {
  ElMessageBox.confirm('确定退出登录？', '提示', { type: 'warning' })
    .then(() => {
      removeToken()
      router.push('/login')
      ElMessage.success('退出成功')
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
