import api from '../api/index.js'

export const getNotifications = (params = {}) => api.get('/notifications', { params })

export const markNotificationAsRead = (id) => api.patch(`/notifications/${id}/read`)

export const markAllNotificationsAsRead = () => api.patch('/notifications/read-all')
