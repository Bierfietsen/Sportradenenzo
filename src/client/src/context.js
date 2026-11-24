import { createContext, useContext } from 'react'

// { isLoggedIn, isAdmin, loading, login(token), logout() }
export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

// { race_id, racename, currentStageLink, setRace(race) }
export const RaceContext = createContext(null)
export const useRace = () => useContext(RaceContext)
