import request from '@/utils/request.js'

export function getGoodsList(params) {
  return request.get('/wms/products', { params })
}

export function createGoods(data) {
  return request.post('/wms/products', data)
}

export function updateGoods(id, data) {
  return request.put(`/wms/products/${id}`, data)
}

export function deleteGoods(id) {
  return request.delete(`/wms/products/${id}`)
}
