import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCardBalance, initializePaystackPayment } from '../services/api'
import { HomeIcon, TransactionsIcon, TapToPayIcon, CardIcon, ProfileIcon, VisaIcon, MastercardIcon, BackIcon } from './Icons'

function LoadFunds() {
  const navigate = useNavigate()
  const [selectedAmount, setSelectedAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('') // 1. Initialise as empty string so it doesn't conflict
  const [loading, setLoading] = useState(false)
  const amounts = ['R50', 'R100', 'R200', 'R500']

  const [balance, setBalance] = useState(localStorage.getItem('balance') || '0.00')

  useEffect(() => {
    const syncBalance = async () => {
      try {
        const response = await getCardBalance()
        setBalance(response.balance.toString())
        localStorage.setItem('balance', response.balance.toString())
      } catch (error) {
        console.error('Unable to load balance:', error)
      }
    }

    syncBalance()
  }, [])

  const handlePayNow = async () => {
    // 2. Fallback check: Read either selected predefined value or the custom input value
    const amountStr = selectedAmount || customAmount;
    const amount = parseFloat(amountStr.replace('R', '').trim())

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setLoading(true)

    try {
      const email = localStorage.getItem('user_email')
      const cardNumber = localStorage.getItem('cardNumber')

      if (!email || !cardNumber) {
        alert('User information not found. Please login again.')
        navigate('/login')
        return
      }

      const response = await initializePaystackPayment(email, amount, cardNumber)

      if (response.authorization_url) {
        localStorage.setItem('pending_payment_reference', response.reference)
        window.location.href = response.authorization_url
      } else {
        alert('Failed to initialize payment. Please try again.')
      }
    } catch (error) {
      console.error('Payment initialization error:', error)
      alert(error.message || 'Unable to process payment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-top">
          <div className="dash-logo">
            <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
          </div>
          <Link to="/dashboard" className="dash-back-btn">
            <BackIcon /> Back
          </Link>
        </div>

        <div className="load-funds">
          <h1>Load Funds</h1>

          <div className="load-balance-card">
            <div className="load-balance-label">Current Balance</div>
            <div className="load-balance-amount">R{parseFloat(balance).toFixed(2)}</div>
          </div>

          <div className="load-section">
            <div className="load-section-label">Amount</div>
            <div className="amount-options">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  className={`amount-btn ${selectedAmount === amt ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedAmount(amt)
                    setCustomAmount('') // 3. Clears custom input when predefined value is clicked
                  }}
                >
                  {amt}
                </button>
              ))}
            </div>

            <div className="other-amount">
              <span className="other-amount-label">Other Amount</span>
              <div className="custom-amount-input">
                <input
                  type="text"
                  placeholder="R 0.00" // 4. Added placeholder for a cleaner visual look
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount('') // 5. Deselects predefined buttons when typing custom value
                  }}
                />
              </div>
            </div>

            <div className="card-payment-section">
              <span className="card-payment-label">Card Payment</span>
              <div className="card-payment-icons">
                <VisaIcon />
                <MastercardIcon />
              </div>
            </div>

            <button className="btn-green" onClick={handlePayNow} disabled={loading}>
              {loading ? 'Redirecting to Paystack...' : 'Pay Now'}
            </button>
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

export default LoadFunds
