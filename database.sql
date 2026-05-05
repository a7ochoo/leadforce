-- SQLite Database Schema for LeadForce

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  plan TEXT DEFAULT 'agent',
  status TEXT DEFAULT 'trial',
  trial_ends_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  prospect_name TEXT,
  prospect_email TEXT,
  prospect_phone TEXT,
  type TEXT,
  channel TEXT,
  classification TEXT,
  score INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS scores (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  score INTEGER,
  classification TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

CREATE TABLE IF NOT EXISTS user_integrations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  channel TEXT,
  is_connected INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS daily_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  report_date DATE,
  total_leads INTEGER,
  bon_leads INTEGER,
  moyen_leads INTEGER,
  faible_leads INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_conversation ON scores(conversation_id);
CREATE INDEX IF NOT EXISTS idx_integrations_user ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user ON daily_reports(user_id);