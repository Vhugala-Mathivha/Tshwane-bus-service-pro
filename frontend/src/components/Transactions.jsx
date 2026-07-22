import React from 'react'
import { Link } from 'react-router-dom'

const transactions = [
  { type: 'Load', date: '20 May 2024 ~ 10:15', amount: '+R16.00', status: 'success', positive: true },
  { type: 'Trip', date: '20 May 2024 ~ 10:15', amount: '-R15.00', status: 'success', positive: false },
  { type: 'Load', date: '20 May 2024 ~ 10:15', amount: '+R50.00', status: 'success', positive: true },
  { type: 'Load', date: '20 May 2024 ~ 10:15', amount: '+R100.00', status: 'success', positive: true },
  { type: 'Trip', date: '20 May 2024 ~ 10:15', amount: '-R50.00', status: 'success', positive: false },
]

function Transactions() {
  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-top">
          <div className="dash-logo">
            <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
          </div>
          <Link to="/dashboard" className="dash-back-btn">← Back</Link>
        </div>

        <div className="transactions-header">
          <div className="transactions-title-row">
            <h1>Transaction History</h1>
            <Link to="#view-more" className="view-more" onClick={(e) => e.preventDefault()}>View More {'>'}</Link>
          </div>
          <p className="transactions-month">This month</p>
        </div>

        <div className="transactions-list">
          {transactions.map((txn, index) => (
            <div className="transaction-item" key={index}>
              <div className="txn-left">
                <div className="txn-icon">{txn.positive ? '📥' : '📤'}</div>
                <div className="txn-info">
                  <div className="txn-type">{txn.type === 'Load' ? 'Loaded Funds' : 'Bus Ride'}</div>
                  <div className="txn-date">{txn.date}</div>
                </div>
              </div>
              <div className="txn-right">
                <div className={`txn-amount ${txn.positive ? 'positive' : 'negative'}`}>{txn.amount}</div>
                <div className="txn-status">{txn.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bottom-nav">
        <Link to="/dashboard" className="nav-item">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </Link>
        <Link to="/transactions" className="nav-item active">
          <span className="nav-icon">📋</span>
          <span className="nav-label">Transactions</span>
        </Link>
        <Link to="#tap" className="nav-item" onClick={(e) => e.preventDefault()}>
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

export default Transactions