import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Custom hook to automatically log out user after 2 minutes of inactivity
 * Tracks: mouse movement, clicks, key presses
 */
export const useInactivityLogout = () => {
  const navigate = useNavigate()
  const inactivityTimer = useRef(null)
  const INACTIVITY_TIME = 2 * 60 * 1000 // 2 minutes in milliseconds

  const handleLogout = () => {
    console.log('User inactive for 2 minutes, logging out...')
    // Clear all user data from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('userName')
    localStorage.removeItem('user_email')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('cardNumber')
    localStorage.removeItem('user_card_number')
    localStorage.removeItem('balance')
    localStorage.removeItem('user_balance')
    localStorage.removeItem('pending_payment_reference')
    
    // Redirect to login
    navigate('/login')
    alert('Session expired due to inactivity. Please log in again.')
  }

  const resetInactivityTimer = () => {
    // Clear existing timer
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current)
    }

    // Check if user is still logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      return
    }

    // Set new timer
    inactivityTimer.current = setTimeout(() => {
      handleLogout()
    }, INACTIVITY_TIME)
  }

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      return
    }

    // Set initial timer
    resetInactivityTimer()

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

    const handleActivity = () => {
      resetInactivityTimer()
    }

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity)
    })

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current)
      }
    }
  }, [navigate])
}
