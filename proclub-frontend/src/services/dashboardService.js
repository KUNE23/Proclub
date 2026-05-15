import api from '../api'

export const getDashboardAnalytics = async () => {
  return await api.get('/admin/dashboard')
}

export const getMemberDashboard = async () => {
  const response = await api.get('/member/dashboard')
  return response.data
}