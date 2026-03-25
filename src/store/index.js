import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getToken, setToken, removeToken } from '@/utils/auth.js'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '')

  function login(newToken) {
    token.value = newToken
    setToken(newToken)
  }

  function logout() {
    token.value = ''
    removeToken()
  }

  return { token, login, logout }
})
