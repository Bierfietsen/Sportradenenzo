import axios from 'axios'
import { getAuthToken, setAuthToken } from './auth'

// Every request carries the auth token from localStorage
axios.interceptors.request.use((config) => {
  config.headers.authorization = getAuthToken() ?? null
  return config
})

/**
 * Installs the response interceptor that keeps the auth state in sync and
 * handles 401/404/498 responses. Returns a cleanup function.
 *
 * handlers: { onAuthenticated(token), onUnauthorized(), onNotFound(message) }
 */
export function installResponseInterceptor({ onAuthenticated, onUnauthorized, onNotFound }) {
  const id = axios.interceptors.response.use(
    (response) => {
      const token = response.headers.authorization || getAuthToken()
      if (token) onAuthenticated(token)
      return response
    },
    (error) => {
      const { response, config } = error
      switch (response?.status) {
        case 401: // no (valid) token
          onUnauthorized()
          break
        case 404:
          onNotFound(response.data)
          break
        case 498: // access token refreshed by the server: store it and retry once
          if (!config._retried) {
            const token = response.headers.authorization
            setAuthToken(token)
            return axios({ ...config, _retried: true, headers: { ...config.headers, authorization: token } })
          }
          break
        default:
          console.error(error)
      }
      return Promise.reject(error)
    }
  )
  return () => axios.interceptors.response.eject(id)
}
