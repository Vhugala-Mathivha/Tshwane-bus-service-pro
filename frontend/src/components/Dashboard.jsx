import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const [balance] = useState(localStorage.getItem('balance') || '250.00')
  const [userName] = useState(localStorage.getItem('userName') || 'User')

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

        <div className="dash-greeting">
          <h1>Good morning, {userName}!</h1>
          <p>Here's what's happening with your account.</p>
        </div>

        <div className="balance-card">
          <div className="balance-label">Your Balance</div>
          <div className="balance-amount">R {parseFloat(balance).toFixed(2)}</div>
          <button className="btn-load-funds" onClick={() => navigate('/load-funds')}>+Load Funds</button>
        </div>
      </div>

      <div className="bottom-nav">
        <Link to="/dashboard" className="nav-item active">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </Link>
        <Link to="/transactions" className="nav-item">
          <span className="nav-icon">📋</span>
          <span className="nav-label">Transactions</span>
        </Link>
        <Link to="/tap-to-pay" className="nav-item">
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

export default Dashboard