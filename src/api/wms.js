import axios from 'axios'

const BASE_URL = '/api/wms'

export const productApi = {
  getList: (params) => axios.get(`${BASE_URL}/products`, { params }),
  create: (data) => axios.post(`${BASE_URL}/products`, data),
  update: (id, data) => axios.put(`${BASE_URL}/products/${id}`, data),
  remove: (id) => axios.delete(`${BASE_URL}/products/${id}`),
}

export const dashboardApi = {
  getStats: () => axios.get(`${BASE_URL}/dashboard/stats`),
  getAlerts: () => axios.get(`${BASE_URL}/dashboard/alerts`),
}
