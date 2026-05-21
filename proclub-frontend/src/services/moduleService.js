import api from '../api/index.js'

export const getModules = (courseId) => api.get(`/courses/${courseId}/modules`)

export const createModule = (courseId, data) => api.post(`/courses/${courseId}/modules`, data)

export const updateModule = (id, data) => api.put(`/modules/${id}`, data)

export const deleteModule = (id) => api.delete(`/modules/${id}`)

export const getLessons = (moduleId) => api.get(`/modules/${moduleId}/lessons`)

export const getLesson = (id) => api.get(`/lessons/${id}`)

export const createLesson = (moduleId, data) => api.post(`/modules/${moduleId}/lessons`, data)

export const updateLesson = (id, data) => api.put(`/lessons/${id}`, data)

export const deleteLesson = (id) => api.delete(`/lessons/${id}`)

export const completeLesson = (id) => api.post(`/lessons/${id}/progress`)
