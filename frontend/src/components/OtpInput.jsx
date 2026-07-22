import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function OtpInput() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])

  const handleChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
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

          <div className="otp-resend">
            Didnt recieve an OTP? <a href="#resend" onClick={(e) => e.preventDefault()}>Resend OTP</a>
          </div>

          <button className="btn-green" onClick={() => navigate('/success')}>
            Verify
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