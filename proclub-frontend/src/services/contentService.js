import api from '../api/index.js'

export const getContents = (lessonId) => api.get(`/lessons/${lessonId}`)

export const createContent = (moduleId, data) => api.post(`/modules/${moduleId}/lessons`, data)

export const updateContent = (id, data) => api.put(`/lessons/${id}`, data)

export const deleteContent = (id) => api.delete(`/lessons/${id}`)
