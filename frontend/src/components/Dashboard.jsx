import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getCardBalance, getUserName, logoutUser, verifyPaystackPayment } from '../services/api'
import { HomeIcon, TransactionsIcon, TapToPayIcon, CardIcon, ProfileIcon, LoadFundsIcon } from './Icons'

function getTimeOfDayGreeting() {
  const currentHour = new Date().getHours()
  if (currentHour < 12) return 'Good Morning'
  if (currentHour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const [balance, setBalance] = useState(localStorage.getItem('balance') || '0.00')
  const [userName] = useState(getUserName())
  const [paymentStatus, setPaymentStatus] = useState('')

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const paystackReference = queryParams.get('reference') || queryParams.get('trxref')
    const pendingReference = localStorage.getItem('pending_payment_reference')

    const handlePaystackCallback = async (reference) => {
      try {
        const result = await verifyPaystackPayment(reference)
        if (result.status === 'Success') {
          localStorage.setItem('balance', result.newBalance.toString())
          localStorage.setItem('cardNumber', result.cardNumber)
          localStorage.removeItem('pending_payment_reference')
          window.history.replaceState({}, document.title, '/dashboard')

          const now = new Date()
          const dateStr = now.toLocaleDateString('en-US', {
            day: 'numeric', month: 'long', year: 'numeric',
          }) + '  *  ' + now.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: false,
          })

          navigate('/payment-success', {
            state: {
              amount: parseFloat(result.amount).toFixed(2),
              method: 'Paystack',
              reference,
              date: dateStr,
            },
          })
          return
        }
      } catch (error) {
        console.error('Payment verification failed:', error)
        setPaymentStatus('Payment verification failed. Please contact support.')
      }
      localStorage.removeItem('pending_payment_reference')
      window.history.replaceState({}, document.title, '/dashboard')
    }

    const syncBalance = async () => {
      try {
        const response = await getCardBalance()
        setBalance(response.balance.toString())
        localStorage.setItem('balance', response.balance.toString())
        localStorage.setItem('cardNumber', response.cardNumber)
      } catch (error) {
        console.error('Failed to load current balance:', error)
      }
    }

    if (paystackReference) {
      handlePaystackCallback(paystackReference)
    } else if (pendingReference) {
      handlePaystackCallback(pendingReference)
    } else {
      syncBalance()
    }
  }, [location.search])

  const handleLogout = () => {
    logoutUser()
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
          <h1>{getTimeOfDayGreeting()}, {userName}!</h1>
          <p>Here's what's happening with your account.</p>
        </div>

        <div className="balance-card">
          <div className="balance-label">Your Balance</div>
          <div className="balance-amount">R {parseFloat(balance).toFixed(2)}</div>
          <button className="btn-load-funds" onClick={() => navigate('/load-funds')}>
            <LoadFundsIcon /> Load Funds
          </button>
        </div>

        {paymentStatus && (
          <div className="payment-status status-error">{paymentStatus}</div>
        )}
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

export default Dashboard
