/**
 * API Service for Tshwane Bus Service
 * Designed to integrate with C# ASP.NET Backend
 * 
 * Database Schema:
 * - User: Id, FullName, Email, PasswordHash, CreatedAt
 * - BusCard: Id, UserId, CardNumber, Balance
 * - Transaction: Id, BusCardId, Amount, Type(Load|Trip), TransactionDate, Description
 */

// Base URL for the C# ASP.NET backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Helper function for making API requests
 */
async function apiRequest(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle empty response body
    const text = await response.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }
    
    if (!response.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
}

// ============================================================
// AUTH ENDPOINTS
// ============================================================

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 * Body: { email, password }
 * Response: { userId, fullName, email, cardNumber, balance }
 */
export async function loginUser(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  // Store auth data (backend returns: userId, fullName, email, cardNumber, balance)
  localStorage.setItem('user', JSON.stringify({ 
    id: data.userId, 
    fullName: data.fullName, 
    email: data.email 
  }));
  localStorage.setItem('userName', data.fullName);
  localStorage.setItem('user_email', data.email);
  localStorage.setItem('isLoggedIn', 'true');
  if (data.cardNumber) {
    localStorage.setItem('cardNumber', data.cardNumber);
    localStorage.setItem('user_card_number', data.cardNumber);
  }
  if (typeof data.balance !== 'undefined') {
    localStorage.setItem('balance', data.balance);
    localStorage.setItem('user_balance', data.balance);
  }
  
  return data;
}

/**
 * POST /api/SignUp/register
 * Register (first-time setup) - verify existing user details and create password
 * Body: { fullName, email, cardNumber, password, confirmPassword }
 * Response: { message, email }
 */
export async function registerUser(userData) {
  const data = await apiRequest('/SignUp/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: userData.fullName,
      email: userData.email,
      cardNumber: userData.cardNumber,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
    }),
  });
  
  // Store user info in localStorage so they're logged in after registration
  localStorage.setItem('user', JSON.stringify({ 
    fullName: userData.fullName, 
    email: data.email 
  }));
  localStorage.setItem('userName', userData.fullName);
  localStorage.setItem('user_email', data.email);
  localStorage.setItem('cardNumber', userData.cardNumber);
  localStorage.setItem('user_card_number', userData.cardNumber);
  localStorage.setItem('isLoggedIn', 'true');
  
  return data;
}

/**
 * POST /api/SignUp/verify-otp
 * Verify the OTP code sent to the user's email
 * Body: { email, otpCode }
 * Response: { message, email }
 */
export async function verifyOtp(email, otpCode) {
  return apiRequest('/SignUp/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otpCode }),
  });
}

// ============================================================
// USER ENDPOINTS
// ============================================================

/**
 * GET /api/user/profile?email=user@example.com
 * Get the current user's profile (includes createdAt date)
 * Response: { id, fullName, email, createdAt }
 */
export async function getUserProfile() {
  const email = localStorage.getItem('user_email');
  if (!email) throw new Error('User not logged in.');
  return apiRequest(`/user/profile?email=${encodeURIComponent(email)}`);
}

// ============================================================
// PAYSTACK PAYMENT ENDPOINTS
// ============================================================

/**
 * POST /api/payment/initialize
 * Initialize a Paystack payment transaction
 * Body: { email, amount, cardNumber }
 * Response: { status, authorization_url, reference }
 */
export async function initializePaystackPayment(email, amount, cardNumber) {
  return apiRequest('/payment/initialize', {
    method: 'POST',
    body: JSON.stringify({ email, amount, cardNumber }),
  });
}

/**
 * GET /api/payment/verify/{reference}
 * Verify a Paystack payment and update the database balance
 * Response: { status, newBalance, cardNumber, amount }
 */
export async function verifyPaystackPayment(reference) {
  return apiRequest(`/payment/verify/${reference}`);
}

// ============================================================
// BUS CARD ENDPOINTS
// ============================================================

/**
 * GET /api/card/balance?email=user@example.com
 * Get the current user's bus card balance
 * Response: { cardNumber, balance }
 */
export async function getCardBalance() {
  const email = localStorage.getItem('user_email');
  if (!email) throw new Error('User not logged in.');
  return apiRequest(`/card/balance?email=${encodeURIComponent(email)}`);
}

/**
 * POST /api/card/load-funds
 * Load funds onto the user's bus card
 * Body: { email, amount }
 * Response: { message, balance, cardNumber }
 */
export async function loadFunds(amount) {
  const email = localStorage.getItem('user_email');
  if (!email) throw new Error('User not logged in.');
  
  const data = await apiRequest('/card/load-funds', {
    method: 'POST',
    body: JSON.stringify({ email, amount }),
  });
  
  // Update stored balance
  localStorage.setItem('balance', data.balance);
  localStorage.setItem('user_balance', data.balance);
  
  return data;
}

// ============================================================
// TAP TO PAY ENDPOINTS
// ============================================================

/**
 * POST /api/TapToPay/process-payment
 * Process a tap-to-pay transaction (deduct fare from balance)
 * Body: { email, amount }
 * Response: { success, newBalance, transactionId, message }
 */
export async function processTapToPayPayment(email, amount) {
  return apiRequest('/TapToPay/process-payment', {
    method: 'POST',
    body: JSON.stringify({ email, amount }),
  });
}

// ============================================================
// TRANSACTION ENDPOINTS
// ============================================================

/**
 * GET /api/transactions?email=user@example.com&page=1&limit=20
 * Get all transactions for the current user's bus card
 * Response: { transactions: [{ id, cardNumber, amount, type, transactionDate, description }], total, page, limit }
 */
export async function getTransactions(page = 1, limit = 20) {
  const email = localStorage.getItem('user_email');
  if (!email) throw new Error('User not logged in.');
  return apiRequest(`/transactions?email=${encodeURIComponent(email)}&page=${page}&limit=${limit}`);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get stored user data
 */
export function getStoredUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Get stored user name for greeting
 */
export function getUserName() {
  const storedUser = getStoredUser();
  return localStorage.getItem('userName') || storedUser?.fullName || 'User';
}

/**
 * Get stored card balance
 */
export function getStoredBalance() {
  return localStorage.getItem('balance') || localStorage.getItem('user_balance') || '250.00';
}

/**
 * Get stored card number
 */
export function getStoredCardNumber() {
  return localStorage.getItem('cardNumber') || localStorage.getItem('user_card_number') || '';
}

/**
 * Check if user is authenticated
 * Uses isLoggedIn flag since the backend doesn't use JWT tokens
 */
export function isAuthenticated() {
  return !!localStorage.getItem('isLoggedIn');
}

// ============================================================
// FORGOT PASSWORD ENDPOINTS
// ============================================================

/**
 * POST /api/ForgotPassword/lookup-id
 * Look up user by ID number and send OTP to email
 * Body: { idNumber }
 * Response: { message, email }
 */
export async function forgotPasswordLookup(idNumber) {
  return apiRequest('/ForgotPassword/lookup-id', {
    method: 'POST',
    body: JSON.stringify({ idNumber }),
  });
}

/**
 * POST /api/ForgotPassword/verify-otp
 * Verify OTP for password reset
 * Body: { email, otpCode }
 * Response: { message, email }
 */
export async function verifyForgotPasswordOtp(email, otpCode) {
  return apiRequest('/ForgotPassword/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otpCode }),
  });
}

/**
 * POST /api/ForgotPassword/reset-password
 * Reset password after OTP verification
 * Body: { email, password, confirmPassword }
 * Response: { message }
 */
export async function resetPassword(email, password, confirmPassword) {
  return apiRequest('/ForgotPassword/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, password, confirmPassword }),
  });
}

/**
 * Logout - clear stored auth data
 */
export function logoutUser() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('userName');
  localStorage.removeItem('user_email');
  localStorage.removeItem('cardNumber');
  localStorage.removeItem('user_card_number');
  localStorage.removeItem('balance');
  localStorage.removeItem('user_balance');
  localStorage.removeItem('isLoggedIn');
}

/**
 * Format amount for display (e.g., R 250.00)
 */
export function formatAmount(amount) {
  const num = parseFloat(amount);
  return `R ${num.toFixed(2)}`;
}

/**
 * Format transaction type for display
 */
export function formatTransactionType(type) {
  return type === 'Load' ? 'Loaded Funds' : 'Bus Ride';
}

/**
 * Format date for display
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options).replace(',', ' ~');
}