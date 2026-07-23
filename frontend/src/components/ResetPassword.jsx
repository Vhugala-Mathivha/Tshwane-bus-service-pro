import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { resetPassword } from '../services/api'

function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || localStorage.getItem('forgot_password_email')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
      return
    }
  }, [email, navigate])

  const handleReset = async () => {
    if (!password) {
      setError('Please enter a new password.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setLoading(true)

    try {
      await resetPassword(email, password, confirmPassword)
      setSuccess(true)
      localStorage.removeItem('forgot_password_email')
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
          </div>
          <div className="success-section">
            <div className="success-icon">✓</div>
            <h1>Password Reset Successfully!</h1>
            <p>Your password has been changed.</p>
            <p className="success-desc">You will be redirected to the login page shortly.</p>
            <Link to="/login" className="btn-green" style={{textDecoration: 'none', display: 'inline-block', marginTop: '20px', padding: '12px 40px'}}>
              Go to Login
            </Link>
          </div>
          <div className="bus-bottom">
            <div className="bus-bottom-bg"></div>
            <img src="/Bus.png" alt="Bus" className="bus-bottom-img" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/forgot-password-otp" className="back-btn">←</Link>
        <div className="auth-logo">
          <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
        </div>
        <div className="auth-header">
          <h1>Forgot Password?</h1>
          <p>Choose a new password for your account.</p>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <label>Create a password</label>
            <input
              type="password"
              className={`form-input ${error ? 'input-error' : ''}`}
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
            />
          </div>

          <div className="form-group">
            <label>Confirm your password</label>
            <input
              type="password"
              className={`form-input ${error ? 'input-error' : ''}`}
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError('')
              }}
            />
          </div>

          {error && <div className="api-error">{error}</div>}

          <button className="btn-green" onClick={handleReset} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset'}
          </button>
        </div>

        <div className="bus-bottom">
          <div className="bus-bottom-bg"></div>
          <img src="/Bus.png" alt="Bus" className="bus-bottom-img" />
        </div>
      </div>
    </div>
  )
}

export default ResetPassword