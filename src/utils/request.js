import axios from 'axios'
import { ElMessage } from "element-plus"
import router from '@/router'

const service = axios.create({
    baseURL: '/api',
    timeout: 10000
})

const TOKEN_LIVE_TIME = 6 * 60 * 60 * 1000 // 6小时过期

// ✅ 请求拦截器（稳定、不报错、自动带token）
service.interceptors.request.use((config) => {
    // 1. 从本地拿 user（永远能拿到）
    const userStr = localStorage.getItem('user')
    if (!userStr) return config

    const user = JSON.parse(userStr)
    const token = user.token
    const loginTime = user.loginDate

    // 2. 过期判断
    if (token && loginTime) {
        const now = Date.now()
        if (now - loginTime > TOKEN_LIVE_TIME) {
            localStorage.removeItem('user')
            ElMessage.error('登录已过期')
            router.push('/login')
            return Promise.reject('登录过期')
        }

        // ✅ 自动把 token 放入请求头
        config.headers.Authorization = token
    }

    return config
})

// ✅ 响应拦截器（按code=200判断）
service.interceptors.response.use(
    (response) => {
        const res = response.data

        // 后端成功
        if (res.code === 200) {
            return res
        }

        // 后端失败
        ElMessage.error(res.message || '请求失败')
        return Promise.reject(res)
    },
    (error) => {
        ElMessage.error(error.message || '网络异常')

        // 401 未授权 / token过期
        if (error.response?.status === 401) {
            localStorage.removeItem('user')
            router.push('/login')
        }

        return Promise.reject(error)
    }
)

export default service