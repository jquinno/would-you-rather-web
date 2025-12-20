"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Lock, ArrowLeft } from "lucide-react"

interface AdminAuthProps {
  children: React.ReactNode
}

const ADMIN_AUTH_KEY = "admin_authenticated"

export function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Check for existing authentication on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem(ADMIN_AUTH_KEY)
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setIsChecking(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        sessionStorage.setItem(ADMIN_AUTH_KEY, "true")
        setIsAuthenticated(true)
        setPassword("")
      } else {
        setError(data.error || "Invalid password")
        setPassword("")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  // Show password prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-gray-300" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white text-center mb-2">Admin Access</h1>
            <p className="text-gray-400 text-center mb-8">Enter password to continue</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg">
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!password.trim() || isLoading}
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors duration-200"
              >
                {isLoading ? "Verifying..." : "Access Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Show admin content if authenticated
  return <>{children}</>
}

