const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (for simplicity)
let users = [];

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'User Service is running', timestamp: new Date().toISOString() });
});

// Get all users
app.get('/users', (req, res) => {
  // Return users without passwords
  const safeUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }));
  res.json(safeUsers);
});

// Get user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Return user without password
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
  res.json(safeUser);
});

// Create new user
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  
  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }
  
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password, // In production, this should be hashed
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Return user without password
  const safeUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt
  };
  
  res.status(201).json(safeUser);
});

// Update user
app.put('/users/:id', (req, res) => {
  const { name, email } = req.body;
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Update user (only name and email, not password)
  if (name) users[userIndex].name = name;
  if (email) {
    // Check if new email is already taken by another user
    const emailTaken = users.find(u => u.email === email && u.id !== req.params.id);
    if (emailTaken) {
      return res.status(409).json({ error: 'Email already taken by another user' });
    }
    users[userIndex].email = email;
  }
  
  // Return updated user without password
  const safeUser = {
    id: users[userIndex].id,
    name: users[userIndex].name,
    email: users[userIndex].email,
    createdAt: users[userIndex].createdAt
  };
  
  res.json(safeUser);
});

// Delete user
app.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

// Internal endpoint for auth service to get user by email (including password)
app.post('/internal/users/by-email', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user); // Return full user object including password for auth service
});

// Start server
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});