/**
 * Session management utilities for anonymous users
 */

/**
 * Generate a unique session ID
 * Uses crypto.randomUUID() if available, otherwise falls back to a timestamp-based ID
 */
export function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback for older browsers
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Get or create a session ID from localStorage
 * The session ID persists across page reloads for the same browser
 */
export function getOrCreateSessionId(): string {
  const SESSION_KEY = 'wyr_session_id'
  
  if (typeof window === 'undefined') {
    // Server-side rendering - return a temporary ID
    return generateSessionId()
  }
  
  try {
    // Try to get existing session ID
    let sessionId = localStorage.getItem(SESSION_KEY)
    
    if (!sessionId) {
      // Create new session ID
      sessionId = generateSessionId()
      localStorage.setItem(SESSION_KEY, sessionId)
    }
    
    return sessionId
  } catch (error) {
    // localStorage might not be available (private browsing, etc.)
    console.warn('Could not access localStorage for session ID:', error)
    return generateSessionId()
  }
}

