const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/'

export const API_BASE_URL = apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

export const assetUrl = (path) => {
  if (!path) return ''
  if (/^(https?:|data:)/i.test(path)) return path
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}
