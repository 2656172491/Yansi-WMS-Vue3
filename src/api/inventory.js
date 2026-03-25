import request from '@/utils/request.js'

export function getInventoryList(params) {
  return request.get('/wms/inventory', { params })
}

export function createInbound(data) {
  return request.post('/wms/inventory/inbound', data)
}

export function createOutbound(data) {
  return request.post('/wms/inventory/outbound', data)
}
