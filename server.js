require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database connection (PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('❌ Database connection failed:', err.message);
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database error:', err);
  } else {
    console.log('✅ PostgreSQL database connected');
  }
});

// Helper to run queries
const dbRun = async (sql, params = []) => {
  try {
    const result = await pool.query(sql, params);
    return result.rows || [];
  } catch (err) {
    console.error('DB Error:', err);
    throw err;
  }
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

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, plan } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const trialEndsDate = new Date();
    trialEndsDate.setDate(trialEndsDate.getDate() + 7);
    
    const result = await dbRun(
      'INSERT INTO users (id, email, password_hash, first_name, last_name, plan, trial_ends_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, plan, status, trial_ends_date',
      [userId, email, hashedPassword, firstName, lastName, plan || 'agent', trialEndsDate, 'trial']
    );
    
    const token = jwt.sign(
      { userId: result[0].id, email: result[0].email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      user: result[0],
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await dbRun(
      'SELECT * FROM users WHERE email = $1',
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

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const result = await dbRun(
      'SELECT id, email, first_name, last_name, plan, status, trial_ends_date FROM users WHERE id = $1',
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

app.get('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const result = await dbRun(
      'SELECT * FROM conversations WHERE user_id = $1 LIMIT 50',
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

app.get('/api/conversations/:id', authenticateToken, async (req, res) => {
  try {
    const conversationResult = await dbRun(
      'SELECT * FROM conversations WHERE id = $1 AND user_id = $2',
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

// ==================== STRIPE ENDPOINTS ====================

app.post('/api/stripe/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { plan } = req.body;
    
    const plans = {
      agent: { name: 'Agent Solo', price: 4900 },
      agence: { name: 'Agence', price: 19900 }
    };

    if (!plans[plan]) {
      return res.status(400).json({ error: 'Plan invalide' });
    }

    const planInfo = plans[plan];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `LeadForce - ${planInfo.name}`,
            description: 'Qualification automatique de leads immobiliers'
          },
          unit_amount: planInfo.price,
          recurring: {
            interval: 'month',
            interval_count: 1
          }
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/pricing`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.userId,
        plan: plan
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
    );

    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;
      
      await dbRun(
        'UPDATE users SET plan = $1, status = $2 WHERE id = $3',
        [subscription.metadata.plan, 'active', userId]
      );
      
      console.log('✅ Subscription created/updated for user:', userId);
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;
      
      await dbRun(
        'UPDATE users SET plan = $1, status = $2 WHERE id = $3',
        ['agent', 'trial', userId]
      );
      
      console.log('✅ Subscription canceled for user:', userId);
    }

    res.json({received: true});
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/stripe/billing-portal', authenticateToken, async (req, res) => {
  try {
    const userResult = await dbRun(
      'SELECT stripe_customer_id FROM users WHERE id = $1',
      [req.user.userId]
    );

    let customerId = userResult[0]?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: { userId: req.user.userId }
      });
      
      customerId = customer.id;
      
      await dbRun(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, req.user.userId]
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/dashboard`
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Billing portal error:', err);
    res.status(400).json({ error: err.message });
  }
});
app.get('/api/setup', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (id VARCHAR(36) PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, first_name VARCHAR(100), last_name VARCHAR(100), plan VARCHAR(50) DEFAULT 'agent', status VARCHAR(50) DEFAULT 'trial', trial_ends_date TIMESTAMP, stripe_customer_id VARCHAR(255), verify_code VARCHAR(6), verify_code_expires TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS conversations (id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36) NOT NULL REFERENCES users(id), prospect_name VARCHAR(255), prospect_email VARCHAR(255), prospect_phone VARCHAR(20), type VARCHAR(50), channel VARCHAR(50), classification VARCHAR(50), score INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS scores (id VARCHAR(36) PRIMARY KEY, conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id), score INTEGER, classification VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS email_integrations (id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36) UNIQUE NOT NULL REFERENCES users(id), email VARCHAR(255) NOT NULL, password_hash TEXT NOT NULL, smtp_host VARCHAR(255), smtp_port INTEGER DEFAULT 587, imap_host VARCHAR(255), imap_port INTEGER DEFAULT 993, provider VARCHAR(50) DEFAULT 'custom', active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS reviews (id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36) NOT NULL REFERENCES users(id), rating INTEGER NOT NULL, liked TEXT NOT NULL, improved TEXT NOT NULL, recommend VARCHAR(100), reviewer_name VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS leads (id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36) REFERENCES users(id), first_name VARCHAR(100), last_name VARCHAR(100), email VARCHAR(255), phone VARCHAR(20), type VARCHAR(50), budget VARCHAR(100), financing VARCHAR(50), delay VARCHAR(50), city VARCHAR(100), surface VARCHAR(50), rooms VARCHAR(10), criteria TEXT, channel VARCHAR(50) DEFAULT 'email', score VARCHAR(20) DEFAULT 'moyen', stage VARCHAR(50) DEFAULT 'nouveau', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS questionnaire_tokens (token VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36) REFERENCES users(id), expires_at TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
    `);
    res.json({ success: true, message: 'Tables created!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ==================== HEALTH CHECK ====================

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    
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

// ==================== EMAIL INTEGRATION ENDPOINTS ====================

// Save email integration config
app.post('/api/integrations/email', authenticateToken, async (req, res) => {
  try {
    const { email, password, smtpHost, smtpPort, imapHost, imapPort, provider } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Test SMTP connection
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: smtpHost || getSmtpHost(email),
      port: smtpPort || 587,
      secure: false,
      auth: { user: email, pass: password },
      tls: { rejectUnauthorized: false }
    });

    await transporter.verify();

    // Save to DB (encrypt password in production)
    await dbRun(
      `INSERT INTO email_integrations (id, user_id, email, password_hash, smtp_host, smtp_port, imap_host, imap_port, provider, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
       ON CONFLICT (user_id) DO UPDATE SET
       email=$3, password_hash=$4, smtp_host=$5, smtp_port=$6, imap_host=$7, imap_port=$8, provider=$9, active=true`,
      [require('uuid').v4(), req.user.userId, email, password, 
       smtpHost || getSmtpHost(email), smtpPort || 587,
       imapHost || getImapHost(email), imapPort || 993, provider || detectProvider(email)]
    );

    res.json({ success: true, message: 'Email connecté avec succès!' });
  } catch (err) {
    console.error('Email integration error:', err);
    res.status(400).json({ error: 'Connexion impossible. Vérifiez vos identifiants.' });
  }
});

// Get email integration status
app.get('/api/integrations/email', authenticateToken, async (req, res) => {
  try {
    const result = await dbRun(
      'SELECT email, provider, active, created_at FROM email_integrations WHERE user_id = $1',
      [req.user.userId]
    );
    
    if (result.length === 0) {
      return res.json({ connected: false });
    }
    
    res.json({ connected: true, ...result[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete email integration
app.delete('/api/integrations/email', authenticateToken, async (req, res) => {
  try {
    await dbRun('DELETE FROM email_integrations WHERE user_id = $1', [req.user.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Helper functions
function detectProvider(email) {
  if (email.includes('@gmail.com')) return 'gmail';
  if (email.includes('@outlook.com') || email.includes('@hotmail.com') || email.includes('@live.com')) return 'outlook';
  if (email.includes('@yahoo.com') || email.includes('@yahoo.fr')) return 'yahoo';
  return 'custom';
}

function getSmtpHost(email) {
  const provider = detectProvider(email);
  const hosts = {
    gmail: 'smtp.gmail.com',
    outlook: 'smtp-mail.outlook.com',
    yahoo: 'smtp.mail.yahoo.com',
    custom: 'smtp.' + email.split('@')[1]
  };
  return hosts[provider];
}

function getImapHost(email) {
  const provider = detectProvider(email);
  const hosts = {
    gmail: 'imap.gmail.com',
    outlook: 'outlook.office365.com',
    yahoo: 'imap.mail.yahoo.com',
    custom: 'imap.' + email.split('@')[1]
  };
  return hosts[provider];
}

// ==================== REVIEWS ENDPOINTS ====================

app.post('/api/reviews/submit', authenticateToken, async (req, res) => {
  try {
    const { rating, liked, improved, recommend, name } = req.body;

    if (!rating || !liked || !improved) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }

    if (liked.length < 50 || improved.length < 50) {
      return res.status(400).json({ error: 'Vos réponses doivent faire au moins 50 caractères' });
    }

    // Save review
    await dbRun(
      `INSERT INTO reviews (id, user_id, rating, liked, improved, recommend, reviewer_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [require('uuid').v4(), req.user.userId, rating, liked, improved, recommend || '', name || '']
    );

    // Extend trial by 30 days
    await dbRun(
      `UPDATE users SET trial_ends_date = NOW() + INTERVAL '30 days', status = 'trial'
       WHERE id = $1`,
      [req.user.userId]
    );

    // Update user in response
    const userResult = await dbRun(
      'SELECT id, email, plan, status, trial_ends_date FROM users WHERE id = $1',
      [req.user.userId]
    );

    res.json({ success: true, message: '1 mois gratuit activé!', user: userResult[0] });
  } catch (err) {
    console.error('Review error:', err);
    res.status(400).json({ error: err.message });
  }
});

// ==================== ADMIN ENDPOINTS ====================

const ADMIN_EMAIL = 'ahmedyoussef.berred@gmail.com';

const isAdmin = (req, res, next) => {
  if (req.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Accès refusé' });
  }
  next();
};

app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await dbRun('SELECT id, email, first_name, last_name, plan, status, trial_ends_date, created_at FROM users ORDER BY created_at DESC');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/reviews', authenticateToken, isAdmin, async (req, res) => {
  try {
    const reviews = await dbRun('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await dbRun('SELECT plan, status FROM users');
    const reviews = await dbRun('SELECT rating FROM reviews');
    
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const trialUsers = users.filter(u => u.status === 'trial').length;
    const agentUsers = users.filter(u => u.plan === 'agent' && u.status === 'active').length;
    const agenceUsers = users.filter(u => u.plan === 'agence' && u.status === 'active').length;
    const mrr = (agentUsers * 4900) + (agenceUsers * 19900);
    const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

    res.json({ totalUsers, activeUsers, trialUsers, mrr, avgRating: avgRating.toFixed(1), totalReviews: reviews.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
