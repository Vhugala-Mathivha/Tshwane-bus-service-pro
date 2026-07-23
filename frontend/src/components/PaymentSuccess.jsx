import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, TransactionsIcon, TapToPayIcon, CardIcon, ProfileIcon, CheckIcon,LogoutIcon } from './Icons'

function PaymentSuccess() {
  const location = useLocation()
  const { amount, method, reference, date } = location.state || {
    amount: '100.00',
    method: 'Card Payment',
    reference: '0555ht590333nnf',
    date: new Date().toLocaleString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-top">
          <div className="dash-logo">
            <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
          </div>
          <Link to="/dashboard" className="dash-back-btn">
            Back
          </Link>
          <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="dash-logout-btn">
            Logout
          </button>
        </div>

        <div className="success-section" style={{ paddingTop: '40px' }}>
          <div className="success-icon"><CheckIcon /></div>
          <h1>Payment successful!</h1>
        </div>

        <div className="payment-details-card">
          <h3>Payment details</h3>

          <div className="payment-detail-row">
            <span className="payment-detail-label">Amount Paid</span>
            <span className="payment-detail-value">R{amount}</span>
          </div>

          <div className="payment-detail-row">
            <span className="payment-detail-label">Payment Method</span>
            <span className="payment-detail-value">{method}</span>
          </div>

          <div className="payment-detail-row">
            <span className="payment-detail-label">Reference Number</span>
            <span className="payment-detail-value ref-number">{reference}</span>
          </div>

          <div className="payment-detail-row">
            <span className="payment-detail-label">Date and Time</span>
            <span className="payment-detail-value">{date}</span>
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <Link to="/dashboard" className="nav-item active">
          <span className="nav-icon"><HomeIcon active={true} /></span>
          <span className="nav-label">Home</span>
        </Link>
        <Link to="/transactions" className="nav-item">
          <span className="nav-icon"><TransactionsIcon /></span>
          <span className="nav-label">Transactions</span>
        </Link>
        <Link to="/tap-to-pay" className="nav-item">
          <span className="nav-icon"><TapToPayIcon /></span>
          <span className="nav-label">Tap to pay</span>
        </Link>
        <Link to="/card" className="nav-item">
          <span className="nav-icon"><CardIcon /></span>
          <span className="nav-label">Card</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <span className="nav-icon"><ProfileIcon /></span>
          <span className="nav-label">Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccess
