
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        userInfo: null,  // 头像、昵称、权限……全放这
        loginDate: null,
    }),

    actions: {
        // 登录
        login({ token, userInfo }) {
            this.token = token
            this.userInfo = userInfo
            this.loginDate = Date.now()
        },

        // 退出登录
        logout() {
            this.token = ''
            this.userInfo = null
            this.loginDate = null
        }
    },

    // 👇 关键：开启持久化
    // 自动存 localStorage，自动读，自动同步
    persist: true
})