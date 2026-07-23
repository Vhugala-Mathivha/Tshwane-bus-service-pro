import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import Verify from './components/Verify'
import OtpInput from './components/OtpInput'
import Success from './components/Success'
import Dashboard from './components/Dashboard'
import Card from './components/Card'
import Profile from './components/Profile'
import Transactions from './components/Transactions'
import LoadFunds from './components/LoadFunds'
import TapToPay from './components/TapToPay'
import ForgotPassword from './components/ForgotPassword'
import ForgotPasswordOtp from './components/ForgotPasswordOtp'
import ResetPassword from './components/ResetPassword'
import BusMap from './components/BusMap'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/otp" element={<OtpInput />} />
      <Route path="/success" element={<Success />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/card" element={<Card />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/load-funds" element={<LoadFunds />} />
      <Route path="/tap-to-pay" element={<TapToPay />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password-otp" element={<ForgotPasswordOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/busmap" element={<BusMap />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App