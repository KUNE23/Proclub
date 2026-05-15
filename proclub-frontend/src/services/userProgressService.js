import api from '../api/index.js'

const BASE = '/admin/user-progress'

export const getUserProgress = (params = {}) =>
  api.get(BASE, { params })

export const getUserProgressDetail = (id) =>
  api.get(`${BASE}/${id}`)
