import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCardBalance, getStoredCardNumber, getStoredUser, processTapToPayPayment } from '../services/api'
import { HomeIcon, TransactionsIcon, TapToPayIcon, CardIcon, ProfileIcon } from './Icons'

function TapToPay() {
  const navigate = useNavigate()
  const [isScanning, setIsScanning] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const storedUser = getStoredUser()
  const [userName, setUserName] = useState(storedUser?.fullName || localStorage.getItem('userName') || 'User')
  const [cardNumber, setCardNumber] = useState(getStoredCardNumber() || '23246859026752')
  const [balance, setBalance] = useState(localStorage.getItem('balance') || '0.00')

  useEffect(() => {
    const syncCard = async () => {
      try {
        const response = await getCardBalance()
        setCardNumber(response.cardNumber)
        setBalance(response.balance.toString())
        setUserName(storedUser?.fullName || localStorage.getItem('userName') || 'User')
        localStorage.setItem('cardNumber', response.cardNumber)
        localStorage.setItem('user_card_number', response.cardNumber)
        localStorage.setItem('balance', response.balance.toString())
        localStorage.setItem('user_balance', response.balance.toString())
      } catch (error) {
        console.error('Unable to sync card details:', error)
      }
    }

    syncCard()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userName')
    localStorage.removeItem('cardNumber')
    localStorage.removeItem('balance')
    navigate('/')
  }

  const handleTapToPay = async () => {
    if (parseFloat(balance) < 15) {
      alert('Insufficient balance. Please load funds first.')
      return
    }

    setIsScanning(true)

    // Simulate tapping animation for 1.5 seconds
    setTimeout(async () => {
      try {
        const email = localStorage.getItem('user_email')
        const result = await processTapToPayPayment(email, 15.00)
        
        setIsScanning(false)
        setPaymentSuccess(true)
        setPaymentDetails(result)
        
        // Update local balance
        setBalance(result.newBalance.toString())
        localStorage.setItem('balance', result.newBalance.toString())
        localStorage.setItem('user_balance', result.newBalance.toString())
      } catch (error) {
        setIsScanning(false)
        alert('Payment failed: ' + error.message)
      }
    }, 1500)
  }

  const handleDone = () => {
    setPaymentSuccess(false)
    setPaymentDetails(null)
    navigate('/transactions')
  }

  // Format card number with spaces every 4 digits
  const formatCardNumber = (num) => {
    return num.replace(/(.{4})/g, '$1 ').trim()
  }

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    return date.toLocaleDateString('en-US', options).replace(',', ' ~')
  }

  // Success Page
  if (paymentSuccess && paymentDetails) {
    return (
      <div className="dash-page">
        <div className="dash-container">
          <div className="dash-top">
            <div className="dash-logo">
              <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
            </div>
            <button onClick={handleLogout} className="dash-logout-btn">Logout</button>
          </div>

          <div className="success-section">
            <div className="success-icon">✓</div>
            <h1>Payment Successful!</h1>
            <p>Your payment has been processed successfully.</p>

            <div className="payment-receipt">
              <div className="receipt-item">
                <span className="receipt-label">Transaction ID</span>
                <span className="receipt-value">#{paymentDetails.transactionId}</span>
              </div>
              <div className="receipt-item">
                <span className="receipt-label">Amount Paid</span>
                <span className="receipt-value">R {parseFloat(paymentDetails.amount).toFixed(2)}</span>
              </div>
              <div className="receipt-item">
                <span className="receipt-label">Card Number</span>
                <span className="receipt-value">{formatCardNumber(paymentDetails.cardNumber)}</span>
              </div>
              <div className="receipt-item">
                <span className="receipt-label">Date & Time</span>
                <span className="receipt-value">{formatDate(paymentDetails.transactionDate)}</span>
              </div>
              <div className="receipt-item">
                <span className="receipt-label">Description</span>
                <span className="receipt-value">{paymentDetails.description}</span>
              </div>
              <div className="receipt-item receipt-total">
                <span className="receipt-label">New Balance</span>
                <span className="receipt-value">R {parseFloat(paymentDetails.newBalance).toFixed(2)}</span>
              </div>
            </div>

            <button className="btn-green" onClick={handleDone}>
              View Transactions
            </button>
          </div>
        </div>

        <div className="bottom-nav">
          <Link to="/dashboard" className="nav-item">
            <span className="nav-icon"><HomeIcon /></span>
            <span className="nav-label">Home</span>
          </Link>
          <Link to="/transactions" className="nav-item">
            <span className="nav-icon"><TransactionsIcon /></span>
            <span className="nav-label">Transactions</span>
          </Link>
          <Link to="/tap-to-pay" className="nav-item active">
            <span className="nav-icon"><TapToPayIcon active={true} /></span>
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

  // Normal Tap to Pay Page
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

          {/* Bus Card - same design as Card page */}
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

          <div className={`tap-nfc-icon${isScanning ? ' scanning' : ''}`} onClick={handleTapToPay} style={{ cursor: isScanning ? 'default' : 'pointer' }}>
            <TapToPayIcon active={isScanning} />
          </div>

          <div className="tap-balance">
            Current Balance: R {parseFloat(balance).toFixed(2)}
          </div>

          <div className="tap-hint">
            {isScanning ? 'Processing payment...' : 'Tap the NFC icon above to pay'}
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <Link to="/dashboard" className="nav-item">
          <span className="nav-icon"><HomeIcon /></span>
          <span className="nav-label">Home</span>
        </Link>
        <Link to="/transactions" className="nav-item">
          <span className="nav-icon"><TransactionsIcon /></span>
          <span className="nav-label">Transactions</span>
        </Link>
        <Link to="/tap-to-pay" className="nav-item active">
          <span className="nav-icon"><TapToPayIcon active={true} /></span>
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

export default TapToPay