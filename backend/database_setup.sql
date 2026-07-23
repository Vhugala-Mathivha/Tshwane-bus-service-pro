-- Tshwane Bus Service Database Setup Script
-- Run this script in MySQL to create the database and tables

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tshwane_bus_db;
USE tshwane_bus_db;

-- Create User table
CREATE TABLE IF NOT EXISTS User (
    Id VARCHAR(13) PRIMARY KEY,
    FullName VARCHAR(150) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create BusCard table
CREATE TABLE IF NOT EXISTS BusCard (
    CardNumber VARCHAR(20) PRIMARY KEY,
    UserId VARCHAR(13) UNIQUE NOT NULL,
    Balance DECIMAL(10,2) DEFAULT 0.00,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES User(Id) ON DELETE CASCADE
);

-- Create Transaction table
CREATE TABLE IF NOT EXISTS Transaction (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CardNumber VARCHAR(20) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Type ENUM('Load', 'Trip') NOT NULL,
    Description TEXT,
    TransactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CardNumber) REFERENCES BusCard(CardNumber) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_user_email ON User(Email);
CREATE INDEX idx_buscard_userid ON BusCard(UserId);
CREATE INDEX idx_transaction_cardnumber ON Transaction(CardNumber);
CREATE INDEX idx_transaction_date ON Transaction(TransactionDate);

-- Insert a test user (password: "password123")
-- This is hashed using BCrypt - you can use this for testing
INSERT INTO User (Id, FullName, Email, PasswordHash, CreatedAt)
VALUES ('1234567890123', 'Test User', 'test@example.com', '$2a$11$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiAYMyzJ/Ii2', NOW())
ON DUPLICATE KEY UPDATE Email = Email;

-- Insert a test bus card for the test user
INSERT INTO BusCard (CardNumber, UserId, Balance, CreatedAt)
VALUES ('TBS123456789', '1234567890123', 250.00, NOW())
ON DUPLICATE KEY UPDATE CardNumber = CardNumber;

-- Insert a test transaction
INSERT INTO Transaction (CardNumber, Amount, Type, Description, TransactionDate)
VALUES ('TBS123456789', 250.00, 'Load', 'Initial balance', NOW());

-- Display the created data
SELECT * FROM User;
SELECT * FROM BusCard;
SELECT * FROM Transaction;