import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCardBalance, getStoredUser, logoutUser } from '../services/api'
import { HomeIcon, TransactionsIcon, TapToPayIcon, CardIcon, ProfileIcon, CheckIcon } from './Icons'

// NOTE: There is no backend endpoint to record a trip/fare deduction yet
// (CardController only exposes GET /balance and POST /load-funds).
// This simulates the tap locally so the flow can be demoed; the balance
// deducted here will NOT be reflected in the database or in Transaction
// History until a "POST /api/card/pay-fare" style endpoint is added.
function TapToPay() {
  const navigate = useNavigate()
  const [isPaying, setIsPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  const storedUser = getStoredUser()
  const [userName] = useState(storedUser?.fullName || localStorage.getItem('userName') || 'User')
  const [cardNumber, setCardNumber] = useState(localStorage.getItem('cardNumber') || '23246859026752')
  const [balance, setBalance] = useState(localStorage.getItem('balance') || '0.00')
  const fare = 15.00

  useEffect(() => {
    const syncCard = async () => {
      try {
        const response = await getCardBalance()
        setCardNumber(response.cardNumber)
        setBalance(response.balance.toString())
        localStorage.setItem('cardNumber', response.cardNumber)
        localStorage.setItem('balance', response.balance.toString())
      } catch (error) {
        console.error('Unable to sync card details:', error)
      }
    }

    syncCard()
  }, [])

  const formatCardNumber = (num) => {
    return num.replace(/(.{4})/g, '$1 ').trim()
  }

  const handleTapToPay = () => {
    setIsPaying(true)

    setTimeout(() => {
      const currentBalance = parseFloat(localStorage.getItem('balance') || balance)
      if (currentBalance >= fare) {
        const newBalance = currentBalance - fare
        localStorage.setItem('balance', newBalance.toString())
        setBalance(newBalance.toString())
        setPaid(true)
        setIsPaying(false)
      } else {
        alert('Insufficient balance. Please load funds.')
        setIsPaying(false)
      }
    }, 2000)
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  if (paid) {
    return (
      <div className="dash-page">
        <div className="dash-container">
          <div className="dash-top">
            <div className="dash-logo">
              <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
            </div>
            <button onClick={handleLogout} className="dash-logout-btn">
              Logout
            </button>
          </div>

          <div className="success-section" style={{ paddingTop: '40px' }}>
            <div className="success-icon"><CheckIcon /></div>
            <h1>Payment successful!</h1>
            <p>Bus Ride - R{fare.toFixed(2)}</p>
            <p className="success-desc">Tap your card again for your next ride</p>
          </div>

          <div className="payment-details-card">
            <h3>Payment details</h3>
            <div className="payment-detail-row">
              <span className="payment-detail-label">Amount Paid</span>
              <span className="payment-detail-value">R{fare.toFixed(2)}</span>
            </div>
            <div className="payment-detail-row">
              <span className="payment-detail-label">Payment Method</span>
              <span className="payment-detail-value">NFC Tap</span>
            </div>
            <div className="payment-detail-row">
              <span className="payment-detail-label">Remaining Balance</span>
              <span className="payment-detail-value">R{parseFloat(localStorage.getItem('balance') || '0.00').toFixed(2)}</span>
            </div>
          </div>

          <button className="btn-green" onClick={() => { setPaid(false); navigate('/tap-to-pay') }} style={{ margin: '0 20px', width: 'auto' }}>
            Tap Again
          </button>
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

  return (
    <div className="dash-page">
      <div className="dash-container">
        <div className="dash-top">
          <div className="dash-logo">
            <img src="/Logo.jpeg" alt="Tshwane Bus Service" />
          </div>
          <button onClick={handleLogout} className="dash-logout-btn">
            Logout
          </button>
        </div>

        <div className="tap-to-pay-content">
          <h1>Tap to Pay</h1>

          <div className="card-display" style={{ padding: '10px 0' }}>
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

          <div className="nfc-reader">
            <div className={`nfc-icon ${isPaying ? 'nfc-pulsing' : ''}`}>
              <img src="/3.jpg" alt="NFC" className={`icon-lg ${isPaying ? 'nfc-pulsing' : ''}`} />
            </div>
            <p>{isPaying ? 'Processing payment...' : 'Hold your device near the NFC reader'}</p>
          </div>

          <div className="payment-amount">
            <span>Fare: R{fare.toFixed(2)}</span>
            <span className="tap-balance">Balance: R{parseFloat(balance).toFixed(2)}</span>
          </div>

          <button
            className="btn-green btn-green-lg"
            onClick={handleTapToPay}
            disabled={isPaying}
            style={{ opacity: isPaying ? 0.6 : 1 }}
          >
            {isPaying ? 'Processing...' : 'Complete Payment'}
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

export default TapToPay
