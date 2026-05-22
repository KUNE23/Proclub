import api from '../api'

export const getNearestUpcomingEvent = () => {
  return api.get('/upcoming-events/nearest')
}

export const getUpcomingEvents = () => {
  return api.get('/admin/upcoming-events')
}

export const createUpcomingEvent = (payload) => {
  return api.post('/admin/upcoming-events', payload)
}

export const updateUpcomingEvent = (id, payload) => {
  return api.put(`/admin/upcoming-events/${id}`, payload)
}

export const deleteUpcomingEvent = (id) => {
  return api.delete(`/admin/upcoming-events/${id}`)
}
