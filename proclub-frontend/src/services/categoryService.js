import api from '../api/index.js'

const BASE = '/categories'

export const getCategories = () => api.get(BASE)

export const createCategory = (data) => api.post(BASE, data)

export const updateCategory = (id, data) => api.put(`${BASE}/${id}`, data)

