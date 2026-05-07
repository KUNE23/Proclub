import api from '../api/index.js'

export const getModules   = (courseId)    => api.get(`/courses/${courseId}/modules`)

export const createModule = (courseId, data) => api.post(`/courses/${courseId}/modules`, data)

export const updateModule = (id, data)    => api.put(`/modules/${id}`, data)

export const deleteModule = (id)          => api.delete(`/modules/${id}`)
