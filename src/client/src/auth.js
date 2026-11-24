import { jwtDecode } from 'jwt-decode'

const TOKEN_KEY = 'authToken'

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY)

export const setAuthToken = (token) => localStorage.setItem(TOKEN_KEY, token)

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.clear()
}

export function decodeToken(token = getAuthToken()) {
  if (!token) return null
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

export const tokenIsAdmin = (token) => Boolean(decodeToken(token)?.admin)

// The original four poule members have the lowest account ids
export function isFabFourMember() {
  const payload = decodeToken()
  return payload ? payload.account_id <= 5 : false
}
