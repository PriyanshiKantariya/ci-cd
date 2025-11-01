const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use a secure secret
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory token blacklist (for simplicity)
let tokenBlacklist = new Set();

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Auth Service is running', timestamp: new Date().toISOString() });
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Get user from user service
    const userResponse = await axios.post(`${USER_SERVICE_URL}/internal/users/by-email`, {
      email: email
    });
    
    const user = userResponse.data;
    
    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token validation endpoint
app.get('/auth/validate', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.json({
      valid: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name
      }
    });
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    console.error('Token validation error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint (adds token to blacklist)
app.post('/auth/logout', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(400).json({ error: 'No token provided' });
    }
    
    // Add token to blacklist
    tokenBlacklist.add(token);
    
    res.json({ message: 'Logout successful' });
    
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token (can be used by other services)
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Protected route example
app.get('/auth/me', verifyToken, (req, res) => {
  res.json({
    user: {
      userId: req.user.userId,
      email: req.user.email,
      name: req.user.name
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});