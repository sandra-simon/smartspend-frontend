import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api

/*
 * React StrictMode intentionally re-runs effects in development. Share
 * identical in-flight GET requests so this does not create duplicate
 * network calls for the same endpoint and query parameters.
 */
const inFlightGetRequests = new Map<string, Promise<AxiosResponse<unknown>>>()
const originalGet = api.get.bind(api)

api.get = ((url: string, config?: AxiosRequestConfig) => {
  const token = localStorage.getItem('access_token') ?? ''
  const params = JSON.stringify(config?.params ?? {})
  const key = `${url}|${params}|${token}`

  const existingRequest = inFlightGetRequests.get(key)
  if (existingRequest) {
    return existingRequest
  }

  const request = originalGet<unknown>(url, config)
  inFlightGetRequests.set(key, request)

  const clearRequest = () => {
    if (inFlightGetRequests.get(key) === request) {
      inFlightGetRequests.delete(key)
    }
  }
  request.then(clearRequest, clearRequest)

  return request
}) as typeof api.get
