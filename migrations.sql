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

CREATE TABLE IF NOT EXISTS scores (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id),
  score INTEGER,
  classification VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);