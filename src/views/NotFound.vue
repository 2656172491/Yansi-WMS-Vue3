<template>
  <div class="not-found-page">
    <el-card class="not-found-card" shadow="never">
      <div class="content">
        <div class="left">
          <el-icon class="error-icon"><WarningFilled /></el-icon>
          <div class="code">404</div>
          <div class="title">页面不存在</div>
          <div class="desc">
            你访问的页面可能已被删除、重命名，或者暂时不可用。
          </div>

          <div class="actions">
            <el-button type="primary" @click="goHome">返回首页</el-button>
            <el-button @click="goBack">返回上一页</el-button>
          </div>
        </div>

        <div class="right">
          <div class="illustration">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="box">
              <el-icon><Box /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Box, WarningFilled } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/home')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fb 0%, #eaf2ff 100%);
  padding: 24px;
  box-sizing: border-box;
}

.not-found-card {
  width: 100%;
  max-width: 920px;
  border-radius: 20px;
  border: none;
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 24px;
}

.left {
  flex: 1;
}

.error-icon {
  font-size: 52px;
  color: #f56c6c;
  margin-bottom: 12px;
}

.code {
  font-size: 72px;
  line-height: 1;
  font-weight: 800;
  color: #303133;
  margin-bottom: 12px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 12px;
}

.desc {
  font-size: 15px;
  color: #606266;
  line-height: 1.8;
  margin-bottom: 24px;
  max-width: 460px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.illustration {
  position: relative;
  width: 320px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.25;
}

.circle-1 {
  width: 220px;
  height: 220px;
  background: #409eff;
  top: 20px;
  left: 50px;
}

.circle-2 {
  width: 140px;
  height: 140px;
  background: #67c23a;
  bottom: 30px;
  right: 40px;
}

.box {
  position: relative;
  z-index: 2;
  width: 120px;
  height: 120px;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(64, 158, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409eff;
  font-size: 48px;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
    text-align: center;
  }

  .desc {
    margin-left: auto;
    margin-right: auto;
  }

  .actions {
    justify-content: center;
  }

  .illustration {
    width: 240px;
    height: 240px;
  }

  .code {
    font-size: 60px;
  }

  .title {
    font-size: 24px;
  }
}
</style>