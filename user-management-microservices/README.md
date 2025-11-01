# User Management Microservices

A simple user management system built with Node.js microservices architecture.

## Services

### 1. User Service (Port 3001)
- Create users
- Get user by ID
- Get all users
- Update user
- Delete user

### 2. Auth Service (Port 3002)
- User login
- Token generation
- Token validation

## Quick Start

1. Install dependencies for both services:
```bash
cd user-service
npm install

cd ../auth-service
npm install
```

2. Start both services:
```bash
# Terminal 1 - User Service
cd user-service
npm start

# Terminal 2 - Auth Service
cd auth-service
npm start
```

## API Endpoints

### User Service (http://localhost:3001)
- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Auth Service (http://localhost:3002)
- `POST /auth/login` - Login user
- `GET /auth/validate` - Validate token

## Example Usage

### Create a user:
```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```