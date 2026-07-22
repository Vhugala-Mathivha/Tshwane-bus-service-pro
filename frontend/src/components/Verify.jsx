import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Verify() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('email')

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/Logo.jpeg" alt="City of Tshwane" />
        </div>

        <div className="auth-header">
          <h1>Verify your account</h1>
          <p>Please check your One Time Password (OTP) on your emails.</p>
        </div>

        <div className="auth-form">
          <div className={`verify-option ${method === 'email' ? 'selected' : ''}`} onClick={() => setMethod('email')}>
            <div className="verify-radio">
              <div className={`radio-circle ${method === 'email' ? 'active' : ''}`}></div>
            </div>
            <div className="verify-info">
              <div className="verify-label">Email</div>
              <div className="verify-desc">We'll send the otp to your email address</div>
            </div>
          </div>

          <button className="btn-green" onClick={() => navigate('/otp')} style={{ marginTop: '12px' }}>
            Register
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <a href="/login" className="auth-link" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Sign in</a>
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

export default Verify