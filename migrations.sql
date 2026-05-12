-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  plan VARCHAR(50) DEFAULT 'agent',
  status VARCHAR(50) DEFAULT 'trial',
  trial_ends_date TIMESTAMP,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  prospect_name VARCHAR(255),
  prospect_email VARCHAR(255),
  prospect_phone VARCHAR(20),
  type VARCHAR(50),
  channel VARCHAR(50),
  classification VARCHAR(50),
  score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id),
  score INTEGER,
  classification VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_conversation ON scores(conversation_id);

CREATE TABLE IF NOT EXISTS email_integrations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  smtp_host VARCHAR(255),
  smtp_port INTEGER DEFAULT 587,
  imap_host VARCHAR(255),
  imap_port INTEGER DEFAULT 993,
  provider VARCHAR(50) DEFAULT 'custom',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  liked TEXT NOT NULL,
  improved TEXT NOT NULL,
  recommend VARCHAR(100),
  reviewer_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_code VARCHAR(6);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_code_expires TIMESTAMP;

-- Table leads
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  type VARCHAR(50),
  budget VARCHAR(100),
  financing VARCHAR(50),
  delay VARCHAR(50),
  city VARCHAR(100),
  surface VARCHAR(50),
  rooms VARCHAR(10),
  criteria TEXT,
  channel VARCHAR(50) DEFAULT 'email',
  score VARCHAR(20) DEFAULT 'moyen',
  stage VARCHAR(50) DEFAULT 'nouveau',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table questionnaire tokens
CREATE TABLE IF NOT EXISTS questionnaire_tokens (
  token VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(id),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
