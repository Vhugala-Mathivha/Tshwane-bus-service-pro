import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function TapToPay() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userName')
    localStorage.removeItem('cardNumber')
    localStorage.removeItem('balance')
    navigate('/')
  }

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-top">
          <div className="dash-logo">
            <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
          </div>
          <button onClick={handleLogout} className="dash-logout-btn">Logout</button>
        </div>

        <div className="tap-to-pay-content">
          <h1>Tap to Pay</h1>

          <div className="nfc-reader">
            <div className="nfc-icon">📱</div>
            <p>Hold your device near the NFC reader</p>
          </div>

          <div className="payment-amount">
            <span>Fare: R15.00</span>
          </div>

          <button className="btn-green">Complete Payment</button>
        </div>
      </div>

      <div className="bottom-nav">
        <Link to="/dashboard" className="nav-item">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </Link>
        <Link to="/transactions" className="nav-item">
          <span className="nav-icon">📋</span>
          <span className="nav-label">Transactions</span>
        </Link>
        <Link to="/tap-to-pay" className="nav-item active">
          <span className="nav-icon">📱</span>
          <span className="nav-label">Tap to pay</span>
        </Link>
        <Link to="/card" className="nav-item">
          <span className="nav-icon">💳</span>
          <span className="nav-label">Card</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default TapToPay