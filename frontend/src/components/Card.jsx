import React from 'react'
import { Link } from 'react-router-dom'

function Card() {
  const userName = localStorage.getItem('userName') || 'User'
  const cardNumber = localStorage.getItem('cardNumber') || '23246859026752'

  // Format card number with spaces every 4 digits
  const formatCardNumber = (num) => {
    return num.replace(/(.{4})/g, '$1 ').trim()
  }

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-top">
          <div className="dash-logo">
            <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
          </div>
          <Link to="/dashboard" className="dash-back-btn">← Back</Link>
        </div>

        <div className="card-display">
          <div className="physical-card">
            <div className="card-top">
              <span className="card-number">{formatCardNumber(cardNumber)}</span>
            </div>
            <div className="card-bottom">
              <div className="card-holder">
                <span className="card-label">Card Holder</span>
                <span className="card-value">{userName}</span>
              </div>
              <div className="card-expiry">
                <span className="card-label">Valid Thru</span>
                <span className="card-value">05/30</span>
              </div>
            </div>
          </div>
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
        <Link to="#tap" className="nav-item" onClick={(e) => e.preventDefault()}>
          <span className="nav-icon">📱</span>
          <span className="nav-label">Tap to pay</span>
        </Link>
        <Link to="/card" className="nav-item active">
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

export default Card