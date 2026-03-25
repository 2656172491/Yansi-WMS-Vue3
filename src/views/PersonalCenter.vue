<!-- 个人中心 -->
<template>
  <div class="personal-center">
    <el-row :gutter="20">
      <!-- 左侧：用户信息摘要卡片 -->
      <el-col :xs="24" :sm="24" :md="7" :lg="6">
        <el-card shadow="never" class="profile-card">
          <div class="profile-header">
            <el-avatar
              :size="88"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              class="profile-avatar"
            />
            <div class="profile-upload-btn">
              <el-button size="small" plain @click="handleAvatarUpload">
                <el-icon class="mr-1"><Camera /></el-icon>更换头像
              </el-button>
            </div>
            <h3 class="profile-name">{{ userInfo.name }}</h3>
            <el-tag type="success" size="small">{{ userInfo.role }}</el-tag>
          </div>
          <el-divider />
          <div class="profile-info-list">
            <div class="profile-info-item">
              <el-icon class="info-icon"><User /></el-icon>
              <div class="info-content">
                <span class="info-label">工号</span>
                <span class="info-value">{{ userInfo.employeeId }}</span>
              </div>
            </div>
            <div class="profile-info-item">
              <el-icon class="info-icon"><OfficeBuilding /></el-icon>
              <div class="info-content">
                <span class="info-label">部门</span>
                <span class="info-value">{{ userInfo.department }}</span>
              </div>
            </div>
            <div class="profile-info-item">
              <el-icon class="info-icon"><Phone /></el-icon>
              <div class="info-content">
                <span class="info-label">手机</span>
                <span class="info-value">{{ userInfo.phone }}</span>
              </div>
            </div>
            <div class="profile-info-item">
              <el-icon class="info-icon"><Message /></el-icon>
              <div class="info-content">
                <span class="info-label">邮箱</span>
                <span class="info-value">{{ userInfo.email }}</span>
              </div>
            </div>
            <div class="profile-info-item">
              <el-icon class="info-icon"><Clock /></el-icon>
              <div class="info-content">
                <span class="info-label">上次登录</span>
                <span class="info-value">{{ userInfo.lastLogin }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：表单区域 -->
      <el-col :xs="24" :sm="24" :md="17" :lg="18">
        <!-- 个人信息 -->
        <el-card shadow="never" class="mb-5">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><EditPen /></el-icon>
              <span class="font-bold">个人信息</span>
            </div>
          </template>
          <el-form
            ref="infoFormRef"
            :model="infoForm"
            :rules="infoRules"
            label-width="80px"
            class="form-content"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="infoForm.name" placeholder="请输入姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="infoForm.phone" placeholder="请输入手机号" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="infoForm.email" placeholder="请输入邮箱" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门" prop="department">
                  <el-select v-model="infoForm.department" placeholder="请选择部门" style="width: 100%">
                    <el-option label="仓储部" value="仓储部" />
                    <el-option label="运营部" value="运营部" />
                    <el-option label="技术部" value="技术部" />
                    <el-option label="管理部" value="管理部" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="个人简介" prop="bio">
                  <el-input
                    v-model="infoForm.bio"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入个人简介"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div class="form-actions">
              <el-button type="primary" :loading="infoSaving" @click="savePersonalInfo">
                保存修改
              </el-button>
              <el-button @click="resetInfoForm">重置</el-button>
            </div>
          </el-form>
        </el-card>

        <!-- 修改密码 -->
        <el-card shadow="never" class="mb-5">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><Lock /></el-icon>
              <span class="font-bold">修改密码</span>
            </div>
          </template>
          <el-form
            ref="pwdFormRef"
            :model="pwdForm"
            :rules="pwdRules"
            label-width="100px"
            class="form-content"
          >
            <el-row :gutter="20">
              <el-col :span="16">
                <el-form-item label="当前密码" prop="oldPassword">
                  <el-input
                    v-model="pwdForm.oldPassword"
                    type="password"
                    placeholder="请输入当前密码"
                    show-password
                  />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="pwdForm.newPassword"
                    type="password"
                    placeholder="请输入新密码（至少6位）"
                    show-password
                  />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="确认新密码" prop="confirmPassword">
                  <el-input
                    v-model="pwdForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    show-password
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div class="form-actions form-actions--pwd">
              <el-button type="primary" :loading="pwdSaving" @click="changePassword">
                确认修改
              </el-button>
              <el-button @click="resetPwdForm">取消</el-button>
            </div>
          </el-form>
        </el-card>

        <!-- 安全设置 -->
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><Shield /></el-icon>
              <span class="font-bold">安全设置</span>
            </div>
          </template>
          <div class="security-list">
            <div class="security-item" v-for="item in securitySettings" :key="item.key">
              <div class="security-info">
                <div class="security-title">{{ item.title }}</div>
                <div class="security-desc">{{ item.desc }}</div>
              </div>
              <el-switch
                v-model="item.enabled"
                :active-color="item.activeColor || '#409EFF'"
                @change="handleSecurityToggle(item)"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  User,
  Phone,
  Message,
  OfficeBuilding,
  Clock,
  EditPen,
  Lock,
  Camera,
} from '@element-plus/icons-vue'

// 使用自定义 Shield 图标（el-plus 无内置 Shield，用 Unlock 替代）
import { Unlock as Shield } from '@element-plus/icons-vue'

// ===================== 用户信息（展示卡片用） =====================
const userInfo = reactive({
  name: '管理员',
  role: '超级管理员',
  employeeId: 'WMS-001',
  department: '管理部',
  phone: '138****8888',
  email: 'admin@yansi-wms.com',
  lastLogin: '2025-03-24 08:30:00',
})

// ===================== 个人信息表单 =====================
const infoFormRef = ref(null)
const infoSaving = ref(false)

const infoForm = reactive({
  name: '管理员',
  phone: '13888888888',
  email: 'admin@yansi-wms.com',
  department: '管理部',
  bio: '负责仓储系统管理及日常运营工作。',
})

const infoRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
}

const savePersonalInfo = async () => {
  const valid = await infoFormRef.value?.validate().catch(() => false)
  if (!valid) return
  infoSaving.value = true
  // 模拟接口请求
  setTimeout(() => {
    userInfo.name = infoForm.name
    // 去除非数字字符后再脱敏展示
    const digits = infoForm.phone.replace(/\D/g, '')
    userInfo.phone = digits.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    userInfo.email = infoForm.email
    userInfo.department = infoForm.department
    infoSaving.value = false
    ElMessage.success('个人信息已保存')
  }, 800)
}

const resetInfoForm = () => {
  infoFormRef.value?.resetFields()
}

// ===================== 修改密码表单 =====================
const pwdFormRef = ref(null)
const pwdSaving = ref(false)

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const validateConfirmPwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== pwdForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const pwdRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPwd, trigger: 'blur' },
  ],
}

const changePassword = async () => {
  const valid = await pwdFormRef.value?.validate().catch(() => false)
  if (!valid) return
  pwdSaving.value = true
  setTimeout(() => {
    pwdSaving.value = false
    ElMessage.success('密码修改成功，请重新登录')
    resetPwdForm()
  }, 800)
}

const resetPwdForm = () => {
  pwdFormRef.value?.resetFields()
}

// ===================== 安全设置 =====================
const securitySettings = reactive([
  {
    key: 'loginVerify',
    title: '登录验证',
    desc: '登录时需要进行手机短信或邮箱验证',
    enabled: true,
    activeColor: '#409EFF',
  },
  {
    key: 'notifications',
    title: '系统通知',
    desc: '开启后将接收库存预警、系统消息等通知',
    enabled: true,
    activeColor: '#67C23A',
  },
  {
    key: 'darkMode',
    title: '深色模式',
    desc: '切换界面为深色主题（实验性功能）',
    enabled: false,
    activeColor: '#909399',
  },
  {
    key: 'operationLog',
    title: '操作日志',
    desc: '记录账号的所有操作行为以便审计',
    enabled: true,
    activeColor: '#E6A23C',
  },
])

const handleSecurityToggle = (item) => {
  ElMessage.success(`${item.title}已${item.enabled ? '开启' : '关闭'}`)
}

// ===================== 头像上传（占位） =====================
const handleAvatarUpload = () => {
  ElMessage.info('头像上传功能即将上线')
}
</script>

<style scoped>
.personal-center {
  padding-bottom: 20px;
}

/* 个人信息卡片 */
.profile-card {
  text-align: center;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 4px;
}

.profile-avatar {
  margin-bottom: 12px;
  border: 3px solid #e4e7ed;
}

.profile-upload-btn {
  margin-bottom: 10px;
}

.profile-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}

.profile-info-list {
  text-align: left;
}

.profile-info-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #f5f7fa;
}

.profile-info-item:last-child {
  border-bottom: none;
}

.info-icon {
  font-size: 16px;
  color: #409eff;
  margin-right: 10px;
  margin-top: 2px;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.info-value {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
  word-break: break-all;
}

/* 卡片标题 */
.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-icon {
  font-size: 16px;
  color: #409eff;
}

/* 表单 */
.form-content {
  padding-top: 8px;
}

.form-actions {
  display: flex;
  gap: 10px;
  padding-left: 80px;
  margin-top: 4px;
}

.form-actions--pwd {
  padding-left: 100px;
}

/* 安全设置 */
.security-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f7fa;
}

.security-item:last-child {
  border-bottom: none;
}

.security-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.security-desc {
  font-size: 12px;
  color: #909399;
}

/* 间距 */
.mb-5 {
  margin-bottom: 20px;
}
</style>
