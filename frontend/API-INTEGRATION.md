# Tshwane Bus Service - Frontend API Integration Guide

## For the C# ASP.NET Backend Team

This document outlines all the API endpoints the frontend expects. 
The frontend is built with React + Vite and communicates with the backend via RESTful JSON APIs.

---

## Base URL
```
http://localhost:5000/api
```
Configured in `src/services/api.js` - change `API_BASE_URL` if needed.

---

## Database Schema (MySQL)

```sql
CREATE TABLE User (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE BusCard (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT UNIQUE NOT NULL,
    CardNumber VARCHAR(16) UNIQUE NOT NULL,
    Balance DECIMAL(10, 2) DEFAULT 50.00,
    CONSTRAINT FK_User_BusCard FOREIGN KEY (UserId) REFERENCES User(Id) ON DELETE CASCADE
);

CREATE TABLE Transaction (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    BusCardId INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Type ENUM('Load', 'Trip') NOT NULL,
    TransactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Description VARCHAR(255),
    CONSTRAINT FK_BusCard_Transaction FOREIGN KEY (BusCardId) REFERENCES BusCard(Id) ON DELETE CASCADE
);
```

---

## API Endpoints Required

### 1. POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userpassword123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "fullName": "Dlamini John",
    "email": "user@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

---

### 2. POST /api/auth/register
Register a new user and create their BusCard.

**Request Body:**
```json
{
  "fullName": "Dlamini John",
  "email": "user@example.com",
  "cardNumber": "1234567890123456",
  "password": "userpassword123"
}
```

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "fullName": "Dlamini John",
    "email": "user@example.com"
  },
  "busCard": {
    "id": 1,
    "cardNumber": "1234567890123456",
    "balance": 50.00
  }
}
```

**Error Response (409):**
```json
{
  "message": "Email already exists"
}
```

---

### 3. GET /api/user/profile
Get the current user's profile. Requires JWT Bearer token.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Success Response (200):**
```json
{
  "id": 1,
  "fullName": "Dlamini John",
  "email": "user@example.com",
  "createdAt": "2024-05-20T10:15:00"
}
```

---

### 4. GET /api/card/balance
Get the current user's bus card balance. Requires JWT Bearer token.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Success Response (200):**
```json
{
  "id": 1,
  "cardNumber": "1234567890123456",
  "balance": 250.00
}
```

---

### 5. POST /api/card/load-funds
Load funds onto the user's bus card. Requires JWT Bearer token.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Request Body:**
```json
{
  "amount": 100.00
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "cardNumber": "1234567890123456",
  "balance": 350.00,
  "transaction": {
    "id": 1,
    "amount": 100.00,
    "type": "Load",
    "transactionDate": "2024-05-20T10:15:00"
  }
}
```

---

### 6. GET /api/transactions?page=1&limit=20
Get all transactions for the current user's bus card. Requires JWT Bearer token.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Query Parameters:**
- `page` (int, default: 1) - Page number
- `limit` (int, default: 20) - Items per page

**Success Response (200):**
```json
{
  "transactions": [
    {
      "id": 1,
      "busCardId": 1,
      "amount": 100.00,
      "type": "Load",
      "transactionDate": "2024-05-20T10:15:00",
      "description": "Loaded funds via card"
    },
    {
      "id": 2,
      "busCardId": 1,
      "amount": 15.00,
      "type": "Trip",
      "transactionDate": "2024-05-20T11:30:00",
      "description": "Bus ride - Route A"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20
}
```

---

## CORS Configuration (C# Startup.cs / Program.cs)

The frontend runs on `http://localhost:3000` (or similar). Enable CORS:

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:3001", 
                               "http://localhost:3002", "http://localhost:3003",
                               "http://localhost:3004", "http://localhost:3005")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

app.UseCors("AllowFrontend");
```

---

## JWT Token Configuration

The frontend expects a JWT token with at minimum the user's ID and email encoded.

```csharp
// Example JWT claims
var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Email, user.Email),
    new Claim(ClaimTypes.Name, user.FullName)
};
```

---

## Frontend Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login form → POST /api/auth/login
│   │   ├── Register.jsx       # Registration form → POST /api/auth/register
│   │   ├── Verify.jsx         # OTP method selection
│   │   ├── OtpInput.jsx       # OTP code entry
│   │   ├── Success.jsx        # Account created success
│   │   ├── Dashboard.jsx      # Main dashboard → GET /api/card/balance
│   │   ├── Transactions.jsx   # Transaction history → GET /api/transactions
│   │   └── LoadFunds.jsx      # Load funds → POST /api/card/load-funds
│   ├── services/
│   │   └── api.js             # All API calls, auth handling, helpers
│   ├── App.jsx                # Routes
│   ├── main.jsx               # Entry point
│   └── index.css              # All styles
├── public/                    # Static assets (images)
└── package.json               # Dependencies
```

---

## Testing the Integration

1. Backend team creates the C# controllers matching the endpoints above
2. Run backend on `http://localhost:5000`
3. Run frontend with `npm run dev` (starts on port 3000)
4. Open `http://localhost:3000` in browser
5. Test the full flow: Register → Login → Dashboard → Load Funds → Transactions