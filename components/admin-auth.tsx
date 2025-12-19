"use client"

import { useState } from "react"
import { Lock } from "lucide-react"

interface AdminAuthProps {
  children: React.ReactNode
}

export function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

  // Show password prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
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

