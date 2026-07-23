import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendForgotPasswordOtpById } from '../services/api'

function ForgotPassword() {
  const navigate = useNavigate()
  const [idNumber, setIdNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!idNumber.trim()) {
      newErrors.idNumber = 'ID Number is required'
    } else if (idNumber.trim().length !== 13 || !/^\d+$/.test(idNumber.trim())) {
      newErrors.idNumber = 'Please enter a valid 13-digit SA ID number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      await sendForgotPasswordOtpById(idNumber.trim())
      
      // Navigate to OTP verification page
      navigate('/verify')
    } catch (error) {
      setErrors({ general: error.message || 'No account found with this ID Number.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/Logo.jpeg" alt="City of Tshwane" />
        </div>

        <div className="auth-header">
          <h1>Forgot Password</h1>
          <p>Enter your ID Number to continue</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label htmlFor="idNumber">ID Number</label>
            <input
              id="idNumber"
              type="text"
              maxLength={13}
              placeholder="e.g. 9501015000088"
              value={idNumber}
              onChange={(e) => {
                setIdNumber(e.target.value)
                if (errors.idNumber) setErrors({ ...errors, idNumber: '' })
              }}
              className={`form-input ${errors.idNumber ? 'input-error' : ''}`}
            />
            {errors.idNumber && <div className="error-message">{errors.idNumber}</div>}
          </div>

          {errors.general && <div className="error-message" style={{ marginBottom: '12px' }}>{errors.general}</div>}

          <button type="submit" className="btn-green" disabled={loading}>
            {loading ? 'Verifying...' : 'Continue'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remembered your password?{' '}
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