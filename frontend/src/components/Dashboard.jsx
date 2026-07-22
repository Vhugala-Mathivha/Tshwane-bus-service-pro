import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

function getTimeOfDayGreeting() {
  const currentHour = new Date().getHours()
  if (currentHour < 12) return 'Good Morning'
  if (currentHour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Logic: Initialize from localStorage, but update via State
  const [balance, setBalance] = useState(localStorage.getItem('balance') || '0.00')
  const [userName] = useState(localStorage.getItem('userName') || 'User')

  useEffect(() => {
    // 1. Check if we just arrived from Paystack (URL contains ?reference=...)
    const queryParams = new URLSearchParams(location.search);
    const reference = queryParams.get('reference');

    if (reference) {
      const verifyPaymentInDatabase = async () => {
        try {
          // Call your ASP.NET Core 9 Backend Verify Endpoint
          const response = await axios.get(`http://localhost:5013/api/payment/verify/${reference}`);
          
          if (response.data.status === "Success") {
            // 2. Update UI with the REAL balance from MySQL
            const newBalance = response.data.newBalance;
            setBalance(newBalance.toString());
            
            // 3. Keep localStorage in sync
            localStorage.setItem('balance', newBalance.toString());
            
            alert("Top-up Successful!");

            // 4. Clean the URL so it doesn't try to verify again on refresh
            navigate('/dashboard', { replace: true });
          }
        } catch (error) {
          console.error("Payment verification failed:", error);
          alert("We couldn't verify your payment. Please check your transaction history.");
        }
      };

      verifyPaymentInDatabase();
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userName')
    localStorage.removeItem('cardNumber')
    localStorage.removeItem('balance')
    localStorage.removeItem('user_email')
    navigate('/')
  }

  // --- NO CHANGES TO DESIGN BELOW THIS LINE ---
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
          <button className="btn-load-funds" onClick={() => navigate('/load-funds')}>+Load Funds</button>
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
        <Link to="/tap-to-pay" className="nav-item">
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

export default Dashboard