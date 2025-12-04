"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { me as apiMe } from '../services'

const UserContext = createContext({
  user: null,
  setUser: () => {},
  loading: false,
  refresh: async () => {}
})

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  async function refresh() {
    setLoading(true)
    try {
      const data = await apiMe()
      setUser(data)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // try to populate user on client mount (if cookie/token present)
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading, refresh }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}

export default UserContext
