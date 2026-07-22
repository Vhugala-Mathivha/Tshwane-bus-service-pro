import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cardNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Surname and Name is required'
    } else if (formData.fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Please enter both your Surname and Name'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email must contain an @ symbol'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required'
    } else if (formData.cardNumber.trim().length < 10) {
      newErrors.cardNumber = 'Please enter a valid card number'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      await registerUser(formData)
      navigate('/dashboard')
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: error.message }))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/login" className="back-btn">←</Link>

        <div className="auth-header register-header-text">
          <h1>Create your account</h1>
          <p>Register to start using Tshwane Bus Service</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name <span className="required">*</span></label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g. Dlamini John"
              value={formData.fullName}
              onChange={handleChange}
              className={`form-input ${errors.fullName ? 'input-error' : ''}`}
            />
            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address <span className="required">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'input-error' : ''}`}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber">Card Number <span className="required">*</span></label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              placeholder="enter your card number"
              value={formData.cardNumber}
              onChange={handleChange}
              className={`form-input ${errors.cardNumber ? 'input-error' : ''}`}
            />
            {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password <span className="required">*</span></label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password (8+ characters)"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'input-error' : ''}`}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              I agree to the{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()}>
                Terms and Conditions
              </a>
              <span className="required">*</span>
            </label>
            {errors.agreeTerms && <div className="error-message">{errors.agreeTerms}</div>}
          </div>

          {errors.general && <div className="error-message">{errors.general}</div>}

          <button type="submit" className="btn-green">
            Register
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>

        <div className="bus-bottom">
          <div className="bus-bottom-bg"></div>
          <img src="/Bus.png" alt="Tshwane Bus" className="bus-bottom-img" />
        </div>
      </div>
    </div>
  )
}

export default Register