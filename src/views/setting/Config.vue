<template>
  <div class="config-page">
    <!-- 顶部说明 -->
    <el-card class="intro-card" shadow="never">
      <div class="intro-box">
        <div class="intro-left">
          <el-icon class="intro-icon"><Setting /></el-icon>
        </div>
        <div class="intro-right">
          <h2>系统参数</h2>
          <p>
            用于配置仓库管理系统的基础信息、业务规则、安全策略和通知设置。
            配置项通过 API 加载并保存，后端就绪后自动生效。
          </p>
        </div>
      </div>
    </el-card>

    <!-- 基础信息 -->
    <el-card class="section-card" shadow="never">
      <template #header>
        <div class="section-header">
          <span>基础信息</span>
        </div>
      </template>

      <el-form :model="formData" label-width="120px" class="config-form">
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="系统名称">
              <el-input v-model="formData.systemName" placeholder="请输入系统名称" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="系统简称">
              <el-input v-model="formData.systemShortName" placeholder="请输入系统简称" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="系统版本">
              <el-input v-model="formData.version" placeholder="请输入系统版本" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="联系电话">
              <el-input v-model="formData.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="联系邮箱">
              <el-input v-model="formData.email" placeholder="请输入联系邮箱" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="版权信息">
              <el-input v-model="formData.copyright" placeholder="请输入版权信息" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 仓库业务参数 -->
    <el-card class="section-card" shadow="never">
      <template #header>
        <div class="section-header">
          <span>仓库业务参数</span>
        </div>
      </template>

      <el-form :model="formData" label-width="160px" class="config-form">
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="默认仓库">
              <el-select v-model="formData.defaultWarehouse" placeholder="请选择默认仓库" style="width: 100%">
                <el-option label="主仓库" value="主仓库" />
                <el-option label="东区仓库" value="东区仓库" />
                <el-option label="备用仓库" value="备用仓库" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="库存预警阈值">
              <el-input-number v-model="formData.warningThreshold" :min="0" :max="100000" style="width: 100%" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="最小库存报警值">
              <el-input-number v-model="formData.minStockAlert" :min="0" :max="100000" style="width: 100%" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="数据保留天数">
              <el-input-number v-model="formData.dataRetentionDays" :min="1" :max="3650" style="width: 100%" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="盘点周期（天）">
              <el-input-number v-model="formData.checkCycleDays" :min="1" :max="365" style="width: 100%" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="允许负库存">
              <el-switch
                  v-model="formData.allowNegativeStock"
                  active-text="允许"
                  inactive-text="不允许"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="启用出入库审批">
              <el-switch
                  v-model="formData.enableApproval"
                  active-text="启用"
                  inactive-text="关闭"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="启用自动盘点提醒">
              <el-switch
                  v-model="formData.enableAutoCheckReminder"
                  active-text="启用"
                  inactive-text="关闭"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 安全设置 -->
    <el-card class="section-card" shadow="never">
      <template #header>
        <div class="section-header">
          <span>安全设置</span>
        </div>
      </template>

      <el-form :model="formData" label-width="160px" class="config-form">
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="登录失败次数限制">
              <el-input-number v-model="formData.loginFailLimit" :min="1" :max="20" style="width: 100%" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="密码有效期（天）">
              <el-input-number v-model="formData.passwordExpireDays" :min="1" :max="365" style="width: 100%" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="操作日志保留天数">
              <el-input-number v-model="formData.logRetentionDays" :min="1" :max="3650" style="width: 100%" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="启用二次验证">
              <el-switch
                  v-model="formData.enableTwoFactor"
                  active-text="启用"
                  inactive-text="关闭"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="密码复杂度要求">
              <el-select v-model="formData.passwordPolicy" style="width: 100%">
                <el-option label="简单" value="简单" />
                <el-option label="中等" value="中等" />
                <el-option label="强" value="强" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 通知设置 -->
    <el-card class="section-card" shadow="never">
      <template #header>
        <div class="section-header">
          <span>通知设置</span>
        </div>
      </template>

      <el-form :model="formData" label-width="160px" class="config-form">
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="站内通知">
              <el-switch
                  v-model="formData.notifyInApp"
                  active-text="启用"
                  inactive-text="关闭"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="邮件通知">
              <el-switch
                  v-model="formData.notifyEmail"
                  active-text="启用"
                  inactive-text="关闭"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="短信通知">
              <el-switch
                  v-model="formData.notifySms"
                  active-text="启用"
                  inactive-text="关闭"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-form-item label="通知接收人">
              <el-input v-model="formData.notifyReceiver" placeholder="请输入接收人姓名或账号" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <el-button @click="handleReset">恢复默认</el-button>
      <el-button type="primary" @click="handleSave">保存设置</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSystemConfig, saveSystemConfig, resetSystemConfig } from '@/api/config.js'

const defaultForm = {
  systemName: 'Yansi WMS',
  systemShortName: '仓库管理系统',
  version: 'v1.0.0',
  phone: '13800000000',
  email: 'admin@wms.com',
  copyright: '© 2026 Yansi WMS',
  defaultWarehouse: '主仓库',
  warningThreshold: 10,
  minStockAlert: 5,
  dataRetentionDays: 90,
  checkCycleDays: 7,
  allowNegativeStock: false,
  enableApproval: true,
  enableAutoCheckReminder: true,
  loginFailLimit: 5,
  passwordExpireDays: 90,
  logRetentionDays: 180,
  enableTwoFactor: false,
  passwordPolicy: '中等',
  notifyInApp: true,
  notifyEmail: false,
  notifySms: false,
  notifyReceiver: '管理员',
}

const formData = reactive({ ...defaultForm })

onMounted(() => {
  getSystemConfig().then((res) => {
    Object.assign(formData, res.data)
  }).catch(() => {
    ElMessage.error('加载系统配置失败')
  })
})

const handleSave = () => {
  saveSystemConfig({ ...formData }).then(() => {
    ElMessage.success('系统参数保存成功')
  }).catch(() => {
    ElMessage.error('保存失败，请重试')
  })
}

const handleReset = () => {
  ElMessageBox.confirm('确定恢复默认配置吗？', '提示', {
    type: 'warning',
  })
      .then(() => {
        resetSystemConfig().then((res) => {
          Object.assign(formData, res.data)
          ElMessage.success('已恢复默认配置')
        })
      })
      .catch(() => {})
}
</script>

<style scoped>
.config-page {
  padding: 20px;
  background: #f5f7fb;
  min-height: 100vh;
  box-sizing: border-box;
}

.intro-card,
.section-card {
  border-radius: 14px;
  margin-bottom: 16px;
}

.intro-box {
  display: flex;
  align-items: center;
  gap: 18px;
}

.intro-icon {
  font-size: 42px;
  color: #409eff;
}

.intro-right h2 {
  margin: 0 0 8px;
  color: #303133;
}

.intro-right p {
  margin: 0;
  color: #606266;
  line-height: 1.7;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: #303133;
}

.config-form {
  width: 100%;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .intro-box {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-bar {
    flex-direction: column;
  }
}
</style>