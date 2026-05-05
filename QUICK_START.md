# LeadForce - Quick Start Guide (5 min)

## 1️⃣ Clone & Install (2 min)

```bash
# Clone repository
git clone https://github.com/leadforce/leadforce.git
cd leadforce

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## 2️⃣ Setup Environment (1 min)

```bash
# Copy template
cp .env.example .env

# Edit with your values
nano .env  # or use your editor

# Required variables:
# - DATABASE_URL
# - CLAUDE_API_KEY
# - STRIPE_SECRET_KEY
# - JWT_SECRET
# - GMAIL_CLIENT_ID
# - GMAIL_CLIENT_SECRET
# - WHATSAPP_BUSINESS_TOKEN
```

## 3️⃣ Setup Database (1 min)

```bash
# Create database
createdb leadforce

# Run migrations
psql leadforce < database.sql

# Verify tables created
psql leadforce -c "\dt"
```

## 4️⃣ Start Backend & Frontend (1 min)

**Terminal 1 - Backend:**
```bash
npm run dev
# Server on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App on http://localhost:3000
```

## 5️⃣ Test It! (0 min)

- Go to http://localhost:3000
- Register: test@example.com / password123
- Complete onboarding
- Connect integrations (test mode)
- View dashboard

## 🔑 Test Credentials

```
Email: test@example.com
Password: test123456
Plan: agent
Trial: 7 days
```

## 📱 Feature Quick Links

| Feature | URL | What to do |
|---------|-----|-----------|
| Dashboard | /dashboard | View mock leads |
| Settings | /settings | Connect Gmail/WhatsApp |
| Reports | /reports | View daily stats |
| Pricing | /pricing | See plans |
| Admin | /admin | View global stats (admin only) |

## ⚠️ Common Issues

**"Database connection failed"**
```bash
# Check PostgreSQL running
psql postgres

# Check DATABASE_URL in .env
echo $DATABASE_URL
```

**"Port 3000 already in use"**
```bash
# Use different port
PORT=3001 npm run dev
```

**"Claude API key invalid"**
```bash
# Get key from https://console.anthropic.com
# Verify in .env: CLAUDE_API_KEY=sk-ant-...
```

**"Gmail OAuth redirect mismatch"**
```bash
# Add to Google Cloud console:
# http://localhost:3000/api/auth/gmail/callback
# https://your-domain.vercel.app/api/auth/gmail/callback
```

## 🚀 Deploy to Vercel (Optional)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and configure environment variables in dashboard
```

## 📚 Next Steps

1. Read **README.md** - Features & architecture
2. Check **DEPLOYMENT.md** - How to deploy
3. Run **TESTING.md** - Test all features
4. Review **LAUNCH_CHECKLIST.md** - Before going live
5. Read **PROJECT_SUMMARY.md** - Full overview

## 🤔 Questions?

- Check documentation files in root
- Email: support@leadforce.app
- GitHub: github.com/leadforce

## ✅ Launch Checklist

Before deploying to production:

- [ ] All API keys configured
- [ ] Database migrated
- [ ] Webhooks tested
- [ ] Trial system working
- [ ] Stripe checkout tested
- [ ] Email sending tested
- [ ] All 4 channels integrated
- [ ] Dashboard displays leads
- [ ] Reports generate correctly
- [ ] Admin stats show data

---

**You're ready to go! 🎉**

Now connect your integrations and start receiving leads!
