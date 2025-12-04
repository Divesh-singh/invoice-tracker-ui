"use client"

import Link from 'next/link'
import { useUser } from '../context/UserContext'
import { logout } from '../services'

export default function Header() {
  const { user, setUser } = useUser()

  const displayName = user?.user ? `${user?.user?.first_name} ${user?.user?.last_name}` : 'Guest'

  async function handleLogout() {
    // Clear local user state immediately so UI updates
    setUser(null)
    try {
      await logout()
    } catch (err) {
      console.error('Logout error:', err)
      // fallback redirect
      if (typeof window !== 'undefined') window.location.href = '/login'
    }
  }

  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', textDecoration: 'none' }}>
          Invoice Tracker
        </Link>

        <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/users" style={{ color: '#374151', textDecoration: 'none' }}>Users</Link>
          <Link href="/bills" style={{ color: '#374151', textDecoration: 'none' }}>Bills</Link>
          <Link href="/reports" style={{ color: '#374151', textDecoration: 'none' }}>Reports</Link>
        </nav>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#374151' }}>
        <span>{displayName}</span>
        {
            user?.user && (
                <button onClick={handleLogout} style={{ padding: '6px 10px', fontSize: 14 }}>
          Logout
        </button>
            )
        }
      </div>
    </header>
  )
}