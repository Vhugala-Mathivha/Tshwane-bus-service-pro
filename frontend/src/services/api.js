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
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper function for making API requests
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'An error occurred');
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
 * Authenticate user and return JWT token
 * Body: { email, password }
 * Response: { token, user: { id, fullName, email } }
 */
export async function loginUser(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  // Store auth data
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('userName', data.user.fullName);
  
  return data;
}

/**
 * POST /api/auth/register
 * Register a new user and create a BusCard
 * Body: { fullName, email, cardNumber, password }
 * Response: { token, user: { id, fullName, email }, busCard: { id, cardNumber, balance } }
 */
export async function registerUser(userData) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: userData.fullName,
      email: userData.email,
      cardNumber: userData.cardNumber,
      password: userData.password,
    }),
  });
  
  // Store auth data
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('userName', data.user.fullName);
  localStorage.setItem('cardNumber', data.busCard.cardNumber);
  localStorage.setItem('balance', data.busCard.balance);
  
  return data;
}

// ============================================================
// USER ENDPOINTS
// ============================================================

/**
 * GET /api/user/profile
 * Get the current user's profile
 * Response: { id, fullName, email, createdAt }
 */
export async function getUserProfile() {
  return apiRequest('/user/profile');
}

// ============================================================
// BUS CARD ENDPOINTS
// ============================================================

/**
 * GET /api/card/balance
 * Get the current user's bus card balance
 * Response: { id, cardNumber, balance }
 */
export async function getCardBalance() {
  return apiRequest('/card/balance');
}

/**
 * POST /api/card/load-funds
 * Load funds onto the user's bus card
 * Body: { amount }
 * Response: { id, cardNumber, balance, transaction: { id, amount, type, transactionDate } }
 */
export async function loadFunds(amount) {
  const data = await apiRequest('/card/load-funds', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
  
  // Update stored balance
  localStorage.setItem('balance', data.balance);
  
  return data;
}

// ============================================================
// TRANSACTION ENDPOINTS
// ============================================================

/**
 * GET /api/transactions
 * Get all transactions for the current user's bus card
 * Query params: ?page=1&limit=20
 * Response: { transactions: [{ id, busCardId, amount, type, transactionDate, description }], total, page, limit }
 */
export async function getTransactions(page = 1, limit = 20) {
  return apiRequest(`/transactions?page=${page}&limit=${limit}`);
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
  return localStorage.getItem('userName') || 'User';
}

/**
 * Get stored card balance
 */
export function getStoredBalance() {
  return localStorage.getItem('balance') || '250.00';
}

/**
 * Get stored card number
 */
export function getStoredCardNumber() {
  return localStorage.getItem('cardNumber') || '';
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

/**
 * Logout - clear stored auth data
 */
export function logoutUser() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('userName');
  localStorage.removeItem('cardNumber');
  localStorage.removeItem('balance');
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