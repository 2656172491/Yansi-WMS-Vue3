# Yansi-WMS-Vue3
一个基于 **Vue 3 + Vite** 开发的仓库管理系统前端项目，用于实现物资管理、库存管理、出入库记录、统计分析等功能。

## 📊 项目统计
![文件数量](https://img.shields.io/github/directory-file-count/2656172491/Yansi-WMS-Vue3?label=文件总数)
![代码大小](https://img.shields.io/github/languages/code-size/2656172491/Yansi-WMS-Vue3?label=代码大小)
![Vue](https://img.shields.io/badge/Vue-3-%234FC08D?style=flat&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-%23646CFF?style=flat&logo=vite)
![最后更新](https://img.shields.io/github/last-commit/2656172491/Yansi-WMS-Vue3)

## 🚀 技术栈
- **框架**：Vue 3
- **构建工具**：Vite
- **UI 组件**：Element Plus
- **状态管理**：Pinia
- **网络请求**：Axios
- **路由**：Vue Router + 权限守卫

## ✨ 功能模块
- 用户登录 / 退出登录
- JWT Token 自动携带与过期处理
- 路由权限拦截控制
- 统计概览 & 数据可视化
- 物资信息管理
- 库存列表管理 & 库存盘点
- 入库管理 & 出库管理
- 个人中心
- 系统设置（用户、角色、仓库、操作日志等）

## 📁 项目结构
```
src/
├── api/          # 接口请求封装
├── components/   # 公共组件
├── router/       # 路由配置 + 全局守卫
├── store/        # Pinia 状态管理
├── utils/        # 工具类 & 请求拦截
├── views/        # 页面视图
└── App.vue
```

## 🖥️ 项目运行
```bash
# 安装依赖
npm install

# 启动开发服务
npm run dev
```

## 📦 项目打包
```bash
npm run build
```

## 📌 项目说明
本项目为 本人毕业设计，已完整实现：
登录鉴权、路由守卫、Axios 统一封装、Token 持久化、全局异常处理。
部分功能使用模拟数据演示，可快速对接真实后端接口。

---