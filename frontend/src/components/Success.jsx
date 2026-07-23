import React from 'react'
import { useNavigate } from 'react-router-dom'

function Success() {
  const navigate = useNavigate()

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/Logo.jpeg" alt="City of Tshwane" />
        </div>

        <div className="success-section">
          <div className="success-icon">✓</div>
          <h1>Account created successfully!</h1>
          <p>Welcome to Tshwane Bus Service.</p>
          <p className="success-desc">you can now access all features and enjoy a seamless travel experience</p>
          <button className="btn-green" onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>
            Go to Home
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

export default Success