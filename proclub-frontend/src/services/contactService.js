import api from '../api/index.js'

export const sendContactMessage = (payload) => api.post('/contacts', payload)

export const getContactMessages = (params = {}) => api.get('/admin/contacts', { params })

export const updateContactMessage = (id, payload) => api.patch(`/admin/contacts/${id}`, payload)

export const deleteContactMessage = (id) => api.delete(`/admin/contacts/${id}`)
