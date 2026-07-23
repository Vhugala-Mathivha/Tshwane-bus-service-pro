import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { verifyForgotPasswordOtp } from '../services/api'

function ForgotPasswordOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || localStorage.getItem('forgot_password_email')
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendButton, setResendButton] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
      return
    }
    localStorage.setItem('forgot_password_email', email)
  }, [email, navigate])

  const handleChange = (index, value) => {
    if (isNaN(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleVerify = async () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP.')
      return
    }
    setError('')
    setLoading(true)

    try {
      await verifyForgotPasswordOtp(email, otpCode)
      navigate('/reset-password', { state: { email } })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendButton(false)
    setError('')
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    // User can go back to the ID page and re-submit
    navigate('/forgot-password')
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
          <p>Enter the One Time Password (OTP) sent to your email.</p>
        </div>

        <div className="auth-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className="otp-box"
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          {error && <div className="api-error">{error}</div>}

          <button className="btn-green" onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          <div className="otp-resend">
            Didn't receive an OTP?{' '}
            <span style={{color: '#228B22', fontWeight: 600, cursor: 'pointer'}} onClick={handleResend}>
              Request another OTP
            </span>
          </div>
        </div>

        <div className="bus-bottom">
          <div className="bus-bottom-bg"></div>
          <img src="/Bus.png" alt="Bus" className="bus-bottom-img" />
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordOtp