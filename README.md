<<<<<<< HEAD
# LeadForce 🚀

**Qualification automatique de leads immobiliers en temps réel**

LeadForce utilise Claude AI pour qualifier automatiquement vos leads immobiliers, scorer les prospects et générer des rapports quotidiens.

## Features ✨

- ✅ Réception automatique des messages (WhatsApp + Gmail)
- ✅ Classification intelligente (répondeur vs demandeur)
- ✅ Chatbot conversationnel avec questions dynamiques
- ✅ Scoring automatique (BON/MOYEN/FAIBLE)
- ✅ Envoi de formulaire Google Forms automatique
- ✅ Email notifications en temps réel
- ✅ Rapport quotidien à 18h
- ✅ Dashboard agent (liste des leads + filtres)
- ✅ Dashboard admin (stats globales)
- ✅ Onboarding tutoriel interactif
- ✅ Stripe integration (trial 7j + subscription)
- ✅ Multi-agent support (agent solo + agence)

## Tech Stack 🛠️

**Backend:**
- Node.js + Express
- PostgreSQL
- Claude API (Anthropic)
- Stripe
- Gmail API + Google Pub/Sub
- WhatsApp Business API

**Frontend:**
- React (TBD - Jour 4-5)
- Tailwind CSS

**Infrastructure:**
- Vercel (deployment)
- Redis (queue)
- Bull (job queue)

## Setup 📦

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Redis (optional, for queue)

### Installation

1. **Clone et install**
```bash
cd leadforce
npm install
```

2. **Setup Database**
```bash
# Create PostgreSQL database
createdb leadforce

# Run migrations
psql leadforce < database.sql
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your keys
```

4. **Required API Keys**
- Claude API (https://console.anthropic.com/)
- Stripe (https://dashboard.stripe.com/)
- Gmail API (https://console.cloud.google.com/)
- WhatsApp Business API (https://www.facebook.com/business/)

5. **Start server**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints 📡

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/integrations` - Get connected channels

### Conversations (Leads)
- `GET /api/conversations` - List leads with filters
- `GET /api/conversations/:id` - Get lead details

### Webhooks
- `POST /api/webhooks/whatsapp` - WhatsApp messages
- `POST /api/webhooks/gmail` - Gmail notifications

### Stripe
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/webhooks/stripe` - Stripe webhooks

## Pricing 💰

| Plan | Price | Features |
|------|-------|----------|
| Agent | 49€/month | 1 agent, all 4 channels, unlimited scoring |
| Agence | 199€/month | 5 agents included, +20€/extra agent |
| Admin | 1€/month | Full access + global stats |

**Trial:** 7 days free for all plans

## Architecture 📊

```
User/Agent
    ↓
Dashboard (React)
    ↓
API Routes (Express)
    ↓
Database (PostgreSQL)
    ↓
Services:
  - Chatbot (Claude)
  - Scoring Engine
  - Email Service
  - Stripe Service
    ↓
Webhooks (WhatsApp + Gmail)
```

## Development Roadmap 🗓️

**Jour 1-2:** Backend + Infra ✅ (in progress)
**Jour 2-3:** Webhooks + API integrations
**Jour 3-4:** Chatbot + Scoring
**Jour 4-5:** Frontend + Dashboard
**Jour 5-6:** Emails + Onboarding
**Jour 6-7:** Stripe + Testing + Deployment

## File Structure 📁

```
leadforce/
├── server.js              # Main Express server
├── chatbot.js            # Claude AI chatbot
├── emailService.js       # Email notifications
├── stripeService.js      # Stripe integration
├── database.sql          # PostgreSQL schema
├── package.json          # Dependencies
├── .env.example          # Environment template
└── README.md             # This file
```

## Testing 🧪

### Manual Testing
1. Create a test user
2. Connect Gmail/WhatsApp
3. Send test messages
4. Check lead scoring
5. Verify email notifications

### API Testing
```bash
# Test health
curl http://localhost:3000/api/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass","plan":"agent"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}'
```

## Deployment 🚀

### Vercel
```bash
vercel deploy
```

### Environment variables (production)
Update all secrets in Vercel dashboard:
- CLAUDE_API_KEY
- STRIPE_SECRET_KEY
- DATABASE_URL (use Vercel Postgres)
- JWT_SECRET (use strong random string)
- etc.

## Support & Contact 📧

- Email: support@leadforce.app
- GitHub: github.com/leadforce
- Website: leadforce.app

## License 📜

MIT License - See LICENSE file

---

**LeadForce © 2025 - Built with ❤️ for real estate agents**
=======
# leadforce
AI-powered lead qualification for real estate
>>>>>>> ccd0bf34528ded56a0d5c719d8de2dfe537311cb
