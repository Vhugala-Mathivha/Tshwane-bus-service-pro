import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setSubmitted(true)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/Logo.jpeg" alt="City of Tshwane" />
        </div>

        <div className="auth-header">
          <h1>Reset</h1>
          <p>Forgot Password?</p>
        </div>

        {submitted ? (
          <div className="success-section">
            <div className="success-icon">✓</div>
            <p>
              Instructions have been sent to <strong>{email}</strong>.
            </p>
            <p className="success-desc">Please check your email to reset your password.</p>
          </div>
        ) : (
          <>
            <p className="otp-sub">
              No worries! Enter your Email address and we'll send
              instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit} noValidate className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: '' })
                  }}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <button type="submit" className="btn-green">
                Send Instructions
              </button>
            </form>
          </>
        )}

        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>

        <div className="bus-bottom">
          <div className="bus-bottom-bg"></div>
          <img src="/Bus.png" alt="Tshwane Bus" className="bus-bottom-img" />
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword