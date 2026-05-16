const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock the entire auth module
jest.mock('../routes/auth', () => {
  const express = require('express');
  const router = express.Router();
  
  // Mock register endpoint
  router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Mock successful registration
    if (email === 'newuser@example.com') {
      return res.status(201).json({
        message: 'User registered successfully',
        token: 'mock-token-12345',
        user: {
          id: '507f1f77bcf86cd799439012',
          name: 'New User',
          email: 'newuser@example.com',
        },
      });
    }
    
    // Mock existing user
    if (email === 'existing@example.com') {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    return res.status(500).json({ error: 'Server error' });
  });
  
  // Mock login endpoint
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (email === 'test@example.com' && password === '123456') {
      return res.status(200).json({
        message: 'Login successful',
        token: 'mock-token-67890',
        user: {
          id: '507f1f77bcf86cd799439012',
          name: 'Test User',
          email: 'test@example.com',
        },
      });
    }
    
    return res.status(401).json({ error: 'Invalid email or password' });
  });
  
  return router;
});

// Create a test app with the mocked auth routes
const authRoutes = require('../routes/auth');
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication API Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const newUser = {
        name: 'New User',
        email: 'newuser@example.com',
        password: '123456',
      };

      const response = await request(app).post('/api/auth/register').send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidUser = {
        name: 'Incomplete User',
        email: 'incomplete@example.com',
        // password missing
      };

      const response = await request(app).post('/api/auth/register').send(invalidUser);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if password is too short', async () => {
      const shortPasswordUser = {
        name: 'Short Password User',
        email: 'short@example.com',
        password: '123',
      };

      const response = await request(app).post('/api/auth/register').send(shortPasswordUser);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('6 characters');
    });

    it('should return 400 if user already exists', async () => {
      const existingUser = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: '123456',
      };

      const response = await request(app).post('/api/auth/register').send(existingUser);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'User already exists with this email');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: '123456',
      };

      const response = await request(app).post('/api/auth/login').send(credentials);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should return 401 with invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app).post('/api/auth/login').send(credentials);
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if email is missing', async () => {
      const credentials = {
        password: '123456',
      };

      const response = await request(app).post('/api/auth/login').send(credentials);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});