'use client'

import { useState, useEffect } from 'react'
import AuthForm from '@/components/AuthForm'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUserId = localStorage.getItem('sleepTrackerUserId')
    if (savedUserId) {
      setUserId(savedUserId)
    }
    setLoading(false)
  }, [])

  const handleAuthSuccess = (id: string) => {
    setUserId(id)
    localStorage.setItem('sleepTrackerUserId', id)
  }

  const handleLogout = () => {
    setUserId(null)
    localStorage.removeItem('sleepTrackerUserId')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (userId) {
    return <Dashboard userId={userId} onLogout={handleLogout} />
  }

  return <AuthForm onAuthSuccess={handleAuthSuccess} />
}
