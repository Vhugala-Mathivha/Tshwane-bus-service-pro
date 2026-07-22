import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function LoadFunds() {
  const navigate = useNavigate()
  const [selectedAmount, setSelectedAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('R 150.00')
  const [balance] = useState(localStorage.getItem('balance') || '250.00')
  const amounts = ['R50', 'R100', 'R200', 'R500']

  const handlePayNow = () => {
    const amount = selectedAmount 
      ? parseFloat(selectedAmount.replace('R', ''))
      : parseFloat(customAmount.replace('R', '').trim())

    if (isNaN(amount) || amount <= 0) return

    // Update balance locally and navigate back to dashboard
    const currentBalance = parseFloat(localStorage.getItem('balance') || '250.00')
    const newBalance = currentBalance + amount
    localStorage.setItem('balance', newBalance.toString())
    navigate('/dashboard')
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

        <div className="load-funds">
          <h1>Load Funds</h1>

          <div className="load-balance-card">
            <div className="load-balance-label">Currrent Balance</div>
            <div className="load-balance-amount">R{parseFloat(balance).toFixed(2)}</div>
          </div>

          <div className="load-section">
            <div className="load-section-label">Amount</div>
            <div className="amount-options">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  className={`amount-btn ${selectedAmount === amt ? 'active' : ''}`}
                  onClick={() => setSelectedAmount(amt)}
                >
                  {amt}
                </button>
              ))}
            </div>

            <div className="other-amount">
              <span className="other-amount-label">other Amount</span>
              <div className="custom-amount-input">
                <input
                  type="text"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount('')
                  }}
                />
              </div>
            </div>

            <div className="card-payment-section">
              <span className="card-payment-label">Card Payment</span>
              <div className="card-payment-icons">
                <span>💳</span>
                <span>💳</span>
                <span>💳</span>
              </div>
            </div>

            <button className="btn-green" onClick={handlePayNow}>
              Pay Now
            </button>
          </div>
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
        <Link to="#tap" className="nav-item" onClick={(e) => e.preventDefault()}>
          <span className="nav-icon">📱</span>
          <span className="nav-label">Tap to pay</span>
        </Link>
        <Link to="#card" className="nav-item" onClick={(e) => e.preventDefault()}>
          <span className="nav-icon">💳</span>
          <span className="nav-label">Card</span>
        </Link>
        <Link to="#profile" className="nav-item" onClick={(e) => e.preventDefault()}>
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default LoadFunds