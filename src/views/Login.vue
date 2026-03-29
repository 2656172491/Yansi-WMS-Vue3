<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>系统登录</h2>
        <!-- <p>欢迎使用管理系统</p> -->
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名/手机号"
            prefix-icon="User"
            size="large"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <div class="form-actions">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="isLoading"

            native-type="submit"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import {login} from "@/api/auth.js";
import * as auth from "@/api/auth.js";

const router = useRouter();

const loginFormRef = ref(null);
const isLoading = ref(false);

const loginForm = reactive({
  username: "",
  password: "",
  remember: false,
});

// 登录表单验证规则
const loginRules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "用户名长度在 3 到 20 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" },
  ],
});

const handleLogin = async () => {
    const valid = await loginFormRef.value.validate();
    if (!valid) return;
    isLoading.value = true;

    // 1. 调用登录接口
    const res = await login({
      username: loginForm.username,
      password: loginForm.password
    });

    if(res.data.code === 200) {
      // 2. 后端返回成功
      console.log("登录成功", res.data);

      // 3. 这里要存 token（必须加！）
      if (res.data.data) {
        // 假设后端返回的 token 在 res.data.data
        localStorage.setItem("token", res.data.data);
      }
      ElMessage.success("登录成功！");

      // 4. 获取用户信息并保存
      try {
        const res = await auth.getUserInfo("登录页")
        localStorage.setItem("userInfo", JSON.stringify(res.data.data))
      } catch (err) {
        console.log("获取用户信息失败", err)
      }

      // 5. 跳转页面 ✅ 关键！
      await router.push("/home"); // 或者 /home
    }else {
      console.error("登录失败", res.data.message);
      ElMessage.error("登录失败：" + (res.data.message));
    }

    isLoading.value = false;

};
</script>

<style>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px 30px;
  box-sizing: border-box;
}
.login-header {
  text-align: center;
  margin-bottom: 30px;
}
.login-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}
.login-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}
.login-form {
  width: 100%;
}
.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  background: #409eff;
  border: none;
}
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
}
.form-actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
