import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCardBalance, getStoredCardNumber, getStoredUser } from '../services/api'
import { HomeIcon, TransactionsIcon, TapToPayIcon, CardIcon, ProfileIcon} from './Icons'

function Card() {
  const storedUser = getStoredUser()
  const [userName, setUserName] = useState(storedUser?.fullName || localStorage.getItem('userName') || 'User')
  const [cardNumber, setCardNumber] = useState(getStoredCardNumber() || '23246859026752')

  useEffect(() => {
    const syncCard = async () => {
      try {
        const response = await getCardBalance()
        setCardNumber(response.cardNumber)
        setUserName(storedUser?.fullName || localStorage.getItem('userName') || 'User')
        localStorage.setItem('cardNumber', response.cardNumber)
      } catch (error) {
        console.error('Unable to sync card details:', error)
      }
    }

    syncCard()
  }, [])

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
          <Link to="/dashboard" className="dash-back-btn">
            Back
          </Link>
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
          <span className="nav-icon"><HomeIcon /></span>
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
        <Link to="/card" className="nav-item active">
          <span className="nav-icon"><CardIcon active={true} /></span>
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

export default Card
