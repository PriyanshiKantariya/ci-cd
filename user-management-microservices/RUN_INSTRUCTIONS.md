# How to Run the User Management Microservices

## Prerequisites
- Node.js (version 14 or higher)
- npm

## Steps to Run

### Method 1: Run Services Separately (Recommended for development)

1. **Open PowerShell and navigate to the project directory:**
   ```powershell
   cd c:\Users\priya\Downloads\ci-cd\user-management-microservices
   ```

2. **Install dependencies for User Service:**
   ```powershell
   cd user-service
   npm install
   ```

3. **Install dependencies for Auth Service:**
   ```powershell
   cd ..\auth-service
   npm install
   ```

4. **Start User Service (Terminal 1):**
   ```powershell
   cd ..\user-service
   npm start
   ```
   The User Service will start on http://localhost:3001

5. **Start Auth Service (Terminal 2 - Open new PowerShell window):**
   ```powershell
   cd c:\Users\priya\Downloads\ci-cd\user-management-microservices\auth-service
   npm start
   ```
   The Auth Service will start on http://localhost:3002

### Method 2: Using Docker Compose (if you have Docker installed)

1. **Navigate to project directory:**
   ```powershell
   cd c:\Users\priya\Downloads\ci-cd\user-management-microservices
   ```

2. **Start both services:**
   ```powershell
   docker-compose up --build
   ```

## Verify Services are Running

### Check Health Endpoints:
- User Service: http://localhost:3001/health
- Auth Service: http://localhost:3002/health

### Test the API:

1. **Create a user:**
   ```powershell
   curl -X POST http://localhost:3001/users -H "Content-Type: application/json" -d '{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}'
   ```

2. **Login to get token:**
   ```powershell
   curl -X POST http://localhost:3002/auth/login -H "Content-Type: application/json" -d '{\"email\":\"john@example.com\",\"password\":\"password123\"}'
   ```

3. **Get all users:**
   ```powershell
   curl http://localhost:3001/users
   ```

## Services Overview

- **User Service (Port 3001):** Manages user data (CRUD operations)
- **Auth Service (Port 3002):** Handles authentication and JWT tokens

## Stopping the Services

- If running separately: Press `Ctrl+C` in each terminal
- If using Docker: Press `Ctrl+C` or run `docker-compose down`