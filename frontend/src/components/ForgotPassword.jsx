import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPasswordLookup } from '../services/api'

function ForgotPassword() {
  const navigate = useNavigate()
  const [idNumber, setIdNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!idNumber.trim()) {
      setError('Please enter your ID Number.')
      return
    }
    if (idNumber.trim().length < 13) {
      setError('Please enter a valid 13-digit ID Number.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const result = await forgotPasswordLookup(idNumber.trim())
      if (result.email) {
        navigate('/forgot-password-otp', { state: { email: result.email } })
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/login" className="back-btn">←</Link>
        <div className="auth-logo">
          <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
        </div>
        <div className="auth-header">
          <h1>Forgot Password?</h1>
          <p>No worries! Enter your ID Number and we'll send instructions to reset your password on your Email.</p>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <label>ID Number</label>
            <input
              type="text"
              className={`form-input ${error ? 'input-error' : ''}`}
              placeholder="Enter your ID Number"
              value={idNumber}
              onChange={(e) => {
                setIdNumber(e.target.value)
                setError('')
              }}
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <button className="btn-green" onClick={handleContinue} disabled={loading}>
            {loading ? 'Sending...' : 'Continue'}
          </button>
        </div>

        <div className="auth-footer">
          <Link to="/login" className="auth-link">Back to Sign In</Link>
        </div>

        <div className="bus-bottom">
          <div className="bus-bottom-bg"></div>
          <img src="/Bus.png" alt="Bus" className="bus-bottom-img" />
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword