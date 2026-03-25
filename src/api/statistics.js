import request from '@/utils/request.js'

export function getStats() {
  return request.get('/wms/dashboard/stats')
}

export function getAlerts() {
  return request.get('/wms/dashboard/alerts')
}
