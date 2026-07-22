import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCardBalance, getStoredCardNumber, getStoredUser, getUserProfile, logoutUser } from '../services/api'

function Profile() {
  const navigate = useNavigate()
  const storedUser = getStoredUser()
  const [userName, setUserName] = useState(storedUser?.fullName || localStorage.getItem('userName') || 'User')
  const [email, setEmail] = useState(storedUser?.email || localStorage.getItem('user_email') || 'User@gmail.com')
  const [balance, setBalance] = useState(localStorage.getItem('balance') || '250.00')
  const [cardNumber, setCardNumber] = useState(getStoredCardNumber() || '255588773327')
  const [dateJoined, setDateJoined] = useState('')

  useEffect(() => {
    const syncProfile = async () => {
      try {
        // Fetch user profile with createdAt date
        const profile = await getUserProfile()
        if (profile.createdAt) {
          const joinedDate = new Date(profile.createdAt)
          const options = { day: 'numeric', month: 'long', year: 'numeric' }
          setDateJoined(joinedDate.toLocaleDateString('en-US', options))
        }
        
        // Fetch balance and card info
        const balanceResponse = await getCardBalance()
        setBalance(balanceResponse.balance.toString())
        setCardNumber(balanceResponse.cardNumber)
        setUserName(storedUser?.fullName || localStorage.getItem('userName') || 'User')
        setEmail(storedUser?.email || localStorage.getItem('user_email') || 'User@gmail.com')
        localStorage.setItem('balance', balanceResponse.balance.toString())
        localStorage.setItem('user_balance', balanceResponse.balance.toString())
        localStorage.setItem('cardNumber', balanceResponse.cardNumber)
        localStorage.setItem('user_card_number', balanceResponse.cardNumber)
      } catch (error) {
        console.error('Unable to sync profile:', error)
      }
    }

    syncProfile()
  }, [])

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

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">U</div>
          <div className="profile-title">
            <h2>Hi, {userName}!</h2>
            <p>Tshwane Bus Service User</p>
          </div>
        </div>

        {/* Account Overview */}
        <div className="account-overview">
          <h3>Account overview</h3>
          <div className="overview-item">
            <span className="overview-label">Balance</span>
            <span className="overview-value">R {parseFloat(balance).toFixed(2)}</span>
          </div>
          <div className="overview-item">
            <span className="overview-label">Card Number</span>
            <span className="overview-value">{cardNumber}</span>
          </div>
        </div>

        {/* Personal Information */}
        <div className="personal-info">
          <div className="section-header">
            <h3>Personal Information</h3>
            <Link to="#edit" className="edit-link" onClick={(e) => e.preventDefault()}>Edit</Link>
          </div>
          <div className="info-row">
            <span className="info-label">View and edit your details</span>
          </div>
          <div className="info-item">
            <span className="info-label">Full Name</span>
            <span className="info-value">{userName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email Address</span>
            <span className="info-value">{email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">ID NUmberr</span>
            <span className="info-value">000131152084</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date Joined</span>
            <span className="info-value">{dateJoined || 'Loading...'}</span>
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
        <Link to="/card" className="nav-item">
          <span className="nav-icon">💳</span>
          <span className="nav-label">Card</span>
        </Link>
        <Link to="/profile" className="nav-item active">
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default Profile