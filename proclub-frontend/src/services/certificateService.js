import api from '../api/index.js'

export const getCertificateTemplate = () => api.get('/certificate-template')

export const saveCertificateTemplate = (data) => api.post('/certificate-template', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const getMyCertificates = () => api.get('/certificates/mine')

export const generateCertificate = (courseId) => api.post(`/certificates/generate/${courseId}`)

export const verifyCertificate = (code) => api.get(`/certificates/verify/${code}`)

export const certificateDownloadUrl = (code) => `${api.defaults.baseURL}certificates/${code}/download`
