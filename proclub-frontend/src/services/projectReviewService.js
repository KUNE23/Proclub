import api from '../api/index.js'

export const getProjectReviews = (params) => api.get('/admin/projects', { params })

export const reviewProjectSubmission = (id, status) => api.put(`/projects/${id}/review`, { status })

export const getProjectRequirements = (courseId) => api.get(`/courses/${courseId}/project-requirements`)

export const createProjectRequirement = (courseId, data) => api.post(`/courses/${courseId}/project-requirements`, data)

export const updateProjectRequirement = (id, data) => api.put(`/project-requirements/${id}`, data)

export const deleteProjectRequirement = (id) => api.delete(`/project-requirements/${id}`)

export const submitProjectRepository = (data) => api.post('/projects', data)
