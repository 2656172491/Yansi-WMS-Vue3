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
        // 直接返回后台的数据，不再返回整个 axios 包装对象
        return response.data
    },
    (error) => {
        ElMessage.error(error.message || '请求失败')
        return Promise.reject(error)
    }
)
// =================================================================

export default service