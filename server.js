require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection (SQLite)
const db = new sqlite3.Database('./leadforce.db', (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ SQLite database connected');
  }
});

// Helper to run queries
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const dbRunInsert = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ==================== AUTH ENDPOINTS ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, plan } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const userId = uuidv4();
    const trialEndsDate = new Date();
    trialEndsDate.setDate(trialEndsDate.getDate() + 7);
    
    const sql = `
      INSERT INTO users (id, email, password_hash, first_name, last_name, plan, trial_ends_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'trial')
    `;
    
    await dbRunInsert(sql, [
      userId,
      email,
      hashedPassword,
      firstName,
      lastName,
      plan || 'agent',
      trialEndsDate.toISOString()
    ]);
    
    // Create JWT token
    const token = jwt.sign(
      { userId: userId, email: email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      user: {
        id: userId,
        email: email,
        plan: plan || 'agent',
        status: 'trial',
        trial_ends_date: trialEndsDate
      },
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await dbRun(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (result.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const user = result[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        status: user.status,
        trial_ends_date: user.trial_ends_date
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: err.message });
  }
});

// ==================== USER ENDPOINTS ====================

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const result = await dbRun(
      'SELECT id, email, first_name, last_name, plan, status, trial_ends_date FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==================== CONVERSATIONS ENDPOINTS ====================

// Get user's conversations
app.get('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const result = await dbRun(
      'SELECT * FROM conversations WHERE user_id = ? LIMIT 50',
      [req.user.userId]
    );
    
    res.json({
      conversations: result,
      total: result.length
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get conversation details
app.get('/api/conversations/:id', authenticateToken, async (req, res) => {
  try {
    const conversationResult = await dbRun(
      'SELECT * FROM conversations WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );
    
    if (conversationResult.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json({
      conversation: conversationResult[0],
      messages: [],
      score: null
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', async (req, res) => {
  try {
    await dbRun('SELECT 1');
    
    res.json({
      status: 'ok',
      timestamp: new Date(),
      database: 'connected'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 LeadForce server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💬 Webhooks listening`);
});

module.exports = app;
