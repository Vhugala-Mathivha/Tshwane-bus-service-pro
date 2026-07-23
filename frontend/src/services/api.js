/**
 * API Service for Tshwane Bus Service
 * Talks to the ASP.NET backend (AuthController, SignUpController,
 * CardController, TransactionsController, PaymentController, UserController).
 *
 * The backend does not issue JWTs (LoginResponseDto.Token is never set),
 * so "session" is just an email stored in localStorage, sent as a query
 * param on GET requests — matching how CardController/UserController/
 * TransactionsController actually read it server-side.
 */

// Base URL for the ASP.NET backend API.
// Override by creating a .env file with VITE_API_BASE_URL=http://localhost:XXXX/api
// (check your backend's launchSettings.json for the right port — e.g. 5013 or 7295).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5013/api';

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

    // Handle empty response body safely
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
 * Body: { email, password }
 * Response: { userId, fullName, email, cardNumber, balance }
 */
export async function loginUser(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem('user', JSON.stringify({
    id: data.userId,
    fullName: data.fullName,
    email: data.email,
  }));
  localStorage.setItem('userName', data.fullName);
  localStorage.setItem('userId', data.userId)
  localStorage.setItem('user_email', data.email);
  localStorage.setItem('isLoggedIn', 'true');
  if (data.cardNumber) {
    localStorage.setItem('cardNumber', data.cardNumber);
  }
  if (typeof data.balance !== 'undefined') {
    localStorage.setItem('balance', data.balance);
  }

  return data;
}

/**
 * POST /api/SignUp/register
 * First-time setup for a pre-seeded user: verifies card/name/email match, sets a password.
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

  // Keep the user "logged in" through the OTP step
  localStorage.setItem('user', JSON.stringify({ fullName: userData.fullName, email: data.email }));
  localStorage.setItem('userName', userData.fullName);
  localStorage.setItem('user_email', data.email);
  localStorage.setItem('cardNumber', userData.cardNumber);
  localStorage.setItem('isLoggedIn', 'true');

  return data;
}

/**
 * POST /api/SignUp/verify-otp
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
 * GET /api/user/profile?email=...
 * Response: { id, fullName, email, createdAt }
 */
export async function getUserProfile() {
  const email = localStorage.getItem('user_email');
  if (!email) throw new Error('User not logged in.');
  return apiRequest(`/user/profile?email=${encodeURIComponent(email)}`);
}

// ============================================================
// BUS CARD ENDPOINTS
// ============================================================

/**
 * GET /api/card/balance?email=...
 * Response: { cardNumber, balance }
 */
export async function getCardBalance() {
  const email = localStorage.getItem('user_email');
  if (!email) throw new Error('User not logged in.');
  return apiRequest(`/card/balance?email=${encodeURIComponent(email)}`);
}

/**
 * POST /api/card/load-funds
 * Body: { email, amount }
 * Response: { message, balance, cardNumber }
 */
export async function loadFundsDirect(amount) {
  const email = localStorage.getItem('user_email');
  if (!email) throw new Error('User not logged in.');

  const data = await apiRequest('/card/load-funds', {
    method: 'POST',
    body: JSON.stringify({ email, amount }),
  });

  localStorage.setItem('balance', data.balance);
  return data;
}

// ============================================================
// PAYSTACK PAYMENT ENDPOINTS
// ============================================================

/**
 * POST /api/payment/initialize
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
 * Response: { status, newBalance, cardNumber, amount }
 */
export async function verifyPaystackPayment(reference) {
  return apiRequest(`/payment/verify/${reference}`);
}

// ============================================================
// TAP TO PAY ENDPOINTS
// ============================================================
/**
 * POST /api/card/pay-fare
 * Body: { email, amount }
 * Response: { message, balance, cardNumber }
 */
export async function payFare(amount) {
  const email = localStorage.getItem('user_email');
  if (!email) throw new Error('User not logged in.');

  const data = await apiRequest('/card/pay-fare', {
    method: 'POST',
    body: JSON.stringify({ email, amount }),
  });

  if (typeof data.balance !== 'undefined') {
    localStorage.setItem('balance', data.balance.toString());
  }

  return data;
}
// ============================================================
// TRANSACTION ENDPOINTS
// ============================================================

/**
 * GET /api/transactions?email=...&page=1&limit=20
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

export function getStoredUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getUserName() {
  const storedUser = getStoredUser();
  return localStorage.getItem('userName') || storedUser?.fullName || 'User';
}

export function getStoredBalance() {
  return localStorage.getItem('balance') || '0.00';
}

export function getStoredCardNumber() {
  return localStorage.getItem('cardNumber') || '';
}

export function isAuthenticated() {
  return !!localStorage.getItem('isLoggedIn');
}

export function logoutUser() {
  localStorage.removeItem('user');
  localStorage.removeItem('userName');
  localStorage.removeItem('user_email');
  localStorage.removeItem('cardNumber');
  localStorage.removeItem('balance');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('pending_payment_reference');
  localStorage.removeItem('userId');
}

export function formatAmount(amount) {
  const num = parseFloat(amount);
  return `R ${num.toFixed(2)}`;
}

export function formatTransactionType(type) {
  return type === 'Load' ? 'Loaded Funds' : 'Bus Ride';
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options).replace(',', ' ~');
}

/**
 * POST /api/auth/forgot-password-id
 * Body: { idNumber }
 * Response: { message, email, userId, fullName, cardNumber, balance }
 */
export async function sendForgotPasswordOtpById(idNumber) {
  const data = await apiRequest('/auth/forgot-password-id', {
    method: 'POST',
    body: JSON.stringify({ idNumber }),
  });

  // Store user info in localStorage (matches your registration logic)
  if (data.email) localStorage.setItem('user_email', data.email);
  if (data.fullName) localStorage.setItem('userName', data.fullName);
  if (data.userId) localStorage.setItem('userId', data.userId);
  if (data.cardNumber) localStorage.setItem('cardNumber', data.cardNumber);
  if (typeof data.balance !== 'undefined') localStorage.setItem('balance', data.balance.toString());

  return data;
}