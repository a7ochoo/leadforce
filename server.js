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
