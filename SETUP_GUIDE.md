# Tshwane Bus Service - Database Setup & Login Guide

## Prerequisites
- MySQL Server installed and running on localhost:3306
- .NET 9.0 SDK installed
- Node.js and npm installed (for frontend)

## Step 1: Configure MySQL Password

1. Open `backend/appsettings.json`
2. Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password:

```json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;port=3306;database=tshwane_bus_db;user=root;password="
}
```

## Step 2: Create Database and Tables

1. Open MySQL Command Line Client or MySQL Workbench
2. Run the SQL script located at `backend/database_setup.sql`:

```bash
mysql -u root -p < backend/database_setup.sql
```

Or copy and paste the contents of `backend/database_setup.sql` into MySQL Workbench and execute it.

This will:
- Create the `tshwane_bus_db` database
- Create User, BusCard, and Transaction tables
- Insert a test user for login testing

## Step 3: Start the Backend Server

1. Open a terminal in the `backend` folder
2. Run the following commands:

```bash
cd backend
dotnet restore
dotnet run
```

The server should start on `https://localhost:5001` or `http://localhost:5000`

You should see: `Database connection successful!` in the console output

## Step 4: Start the Frontend

1. Open a new terminal in the `frontend` folder
2. Run the following commands:

```bash
cd frontend
npm install
npm run dev
```

The frontend should start on `http://localhost:5173` (or another port if 5173 is busy)

## Step 5: Test the Login

### Option 1: Use the Test User
- **Email**: `test@example.com`
- **Password**: `password123`

### Option 2: Register a New User
1. Go to `http://localhost:5173/register`
2. Fill in the registration form with your details
3. Complete the OTP verification
4. You'll be redirected to the dashboard

## Step 6: Verify Login Works

1. Go to `http://localhost:5173/login`
2. Enter your email and password
3. Click "Sign in"
4. You should be redirected to the dashboard with your balance displayed

## Troubleshooting

### Database Connection Error
- Ensure MySQL service is running: `net start MySQL` (Windows) or `sudo systemctl start mysql` (Linux)
- Verify the connection string password in `appsettings.json` is correct
- Check that MySQL is listening on port 3306

### Backend Won't Start
- Ensure you have .NET 9.0 SDK installed: `dotnet --version`
- Run `dotnet restore` to restore NuGet packages
- Check the console for specific error messages

### Frontend Can't Connect to Backend
- Ensure the backend is running on port 5000/5001
- Check `frontend/vite.config.js` for proxy configuration
- Verify CORS is enabled in `backend/Program.cs`

### Login Fails
- Ensure the database tables were created successfully
- Verify the test user was inserted: `SELECT * FROM User;`
- Check that passwords are hashed with BCrypt (minimum 10 rounds)

## Database Schema

### User Table
- Id (VARCHAR 13) - Primary Key
- FullName (VARCHAR 150)
- Email (VARCHAR 150) - Unique
- PasswordHash (VARCHAR 255)
- CreatedAt (DATETIME)

### BusCard Table
- CardNumber (VARCHAR 20) - Primary Key
- UserId (VARCHAR 13) - Unique, Foreign Key to User
- Balance (DECIMAL 10,2)
- CreatedAt (DATETIME)

### Transaction Table
- Id (INT) - Auto Increment Primary Key
- CardNumber (VARCHAR 20) - Foreign Key to BusCard
- Amount (DECIMAL 10,2)
- Type (ENUM: 'Load' or 'Trip')
- Description (TEXT)
- TransactionDate (DATETIME)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/SignUp/register` - Register new user
- `POST /api/SignUp/verify-otp` - Verify OTP

### User
- `GET /api/user/profile?email={email}` - Get user profile

### Bus Card
- `GET /api/card/balance?email={email}` - Get card balance
- `POST /api/card/load-funds` - Load funds to card

### Transactions
- `GET /api/transactions?email={email}` - Get transaction history

## Security Notes

- Passwords are hashed using BCrypt (never stored in plain text)
- Email is used as the unique identifier for login
- JWT tokens are not currently implemented (session-based via localStorage)
- CORS is configured to allow all origins (restrict in production)

## Next Steps

1. Implement JWT authentication for better security
2. Add password reset functionality
3. Add email notifications for transactions
4. Implement rate limiting on login attempts
5. Add input validation and sanitization
6. Set up HTTPS in production
7. Configure proper CORS origins for production