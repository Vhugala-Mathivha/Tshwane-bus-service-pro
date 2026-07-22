import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName') || 'User'
  const balance = localStorage.getItem('balance') || '250.00'
  const cardNumber = localStorage.getItem('cardNumber') || '255588773327'

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
            <span className="info-value">User@gmail.com</span>
          </div>
          <div className="info-item">
            <span className="info-label">ID NUmberr</span>
            <span className="info-value">000131152084</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date Joined</span>
            <span className="info-value">20 May 2026</span>
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