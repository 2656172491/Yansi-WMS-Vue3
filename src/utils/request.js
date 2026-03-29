import axios from 'axios'
import { ElMessage } from "element-plus";
import router from '@/router'
import { useUserStore } from '@/store/user.js'

const service = axios.create({
    baseURL: '/api',
    timeout: 10000
})

const TOKEN_LIVE_TIME = 6 * 60 * 60 * 1000 // 6小时过期

// 请求拦截器（你写的是对的）
service.interceptors.request.use((config) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (token) {
        const now = Date.now()
        const loginTime = parseInt(userStore.loginDate)

        // 过期判断
        if (now - loginTime > TOKEN_LIVE_TIME) {
            userStore.logout()
            ElMessage.error('登录已过期')
            router.push('/login')
            return Promise.reject()
        }

        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// ===================== 这里是重点！你之前没写！=====================
// 响应拦截器（必须完整写）
service.interceptors.response.use(
    (response) => {
        const res = response.data

        // 🔥【关键】后端成功：code == 200
        if (res.code === 200) {
            // 直接返回数据，页面只用拿 res.data
            return res
        }

        // 🔥 后端失败：其他状态码
        ElMessage.error(res.message || '请求失败')
        return Promise.reject(new Error(res.message || 'Error'))
    },
    (error) => {
        // HTTP 状态码错误（404、500、401、403）
        ElMessage.error(error.message || '网络异常/服务器错误')

        // 🔥 自动处理 token 过期/未授权
        if (error.response?.status === 401) {
            const userStore = useUserStore()
            userStore.logout()
            router.push('/login')
        }

        return Promise.reject(error)
    }
)
// =================================================================

export default service