import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyOtp } from '../services/api'

function OtpInput() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef([])

  const handleChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
    if (error) setError('')
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleVerify = async () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.')
      return
    }

    const email = localStorage.getItem('user_email')
    if (!email) {
      setError('User email not found. Please register again.')
      return
    }

    setLoading(true)
    try {
      await verifyOtp(email, otpCode)
      navigate('/success')
    } catch (error) {
      setError(error.message || 'Invalid or expired OTP code.')
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
          <h1>Verify</h1>
          <p>Verify your account</p>
          <p className="otp-sub">Enter the One Time Password (OTP) sent to your email.</p>
        </div>

        <div className="auth-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-box"
              />
            ))}
          </div>

          {error && <div className="error-message" style={{ textAlign: 'center', marginBottom: '12px' }}>{error}</div>}

          <div className="otp-resend">
            Didnt recieve an OTP? <a href="#resend" onClick={(e) => e.preventDefault()}>Resend OTP</a>
          </div>

          <button className="btn-green" onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        <div className="bus-bottom">
          <div className="bus-bottom-bg"></div>
          <img src="/Bus.png" alt="Tshwane Bus" className="bus-bottom-img" />
        </div>
      </div>
    </div>
  )
}

export default OtpInput
