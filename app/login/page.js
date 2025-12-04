"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login, setAuthToken, me } from '../../services'
import { useUser } from '../../context/UserContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { setUser } = useUser()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await login({ username, password })
      if (res && res.token) setAuthToken(res.token)

      // After successful login, call /me to fetch user details and set in context
      try {
        const userData = await me()
        setUser(userData)
      } catch (uErr) {
        console.error('Failed to fetch /me after login', uErr)
      }

      // Redirect to home
      router.push('/')
    } catch (err) {
      console.error('Login error:', err)
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            type="text"
            style={{ padding: 8, fontSize: 16 }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            style={{ padding: 8, fontSize: 16 }}
          />
        </label>

        <div>
          <button type="submit" disabled={loading} style={{ padding: '8px 12px', fontSize: 16 }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p style={{ marginTop: 16, color: '#6b7280' }}>Submits credentials to the API and logs the response to the console.</p>
    </main>
  )
}
