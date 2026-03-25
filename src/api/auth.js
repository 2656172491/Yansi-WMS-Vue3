import request from '@/utils/request.js'

export function login(data) {
  return request.post('/auth/login', data)
}

export function logout() {
  return request.post('/auth/logout')
}
