import api from '../api/index.js'

export const getContents = (moduleId) => api.get(`/modules/${moduleId}/contents`)

export const createContent = (moduleId, data) => api.post(`/modules/${moduleId}/contents`, data)

export const updateContent = (id, data) => api.put(`/contents/${id}`, data)

export const deleteContent = (id) => api.delete(`/contents/${id}`)
