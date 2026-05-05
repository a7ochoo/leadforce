# LeadForce - Setup Guide Complet

## 📍 LOCALISATION DE TON OUTIL

**Chemin complet:** `/home/claude/leadforce/`

### Structure du Projet

```
/home/claude/leadforce/
│
├── 📂 frontend/                    # React App
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── pages/                  # Dashboard, Settings, Reports, etc
│   │   ├── components/             # LeadCard, Onboarding, etc
│   │   └── styles/                 # Tous les CSS
│   └── package.json
│
├── 🔧 Backend Files (Racine)
│   ├── server.js                   # Express principal
│   ├── package.json                # Dépendances backend
│   ├── .env.example                # Config template
│   ├── database.sql                # Schema PostgreSQL
│   │
│   ├── 🤖 AI & Services
│   │   ├── chatbot.js              # Claude AI logic
│   │   ├── emailService.js         # Emails
│   │   ├── messageProcessor.js     # Message routing
│   │   └── scheduler.js            # Jobs planning
│   │
│   ├── 🔌 Integrations
│   │   ├── whatsappService.js      # WhatsApp API
│   │   ├── gmailService.js         # Gmail API
│   │   ├── stripeService.js        # Stripe logic
│   │   ├── stripeRoutes.js         # Stripe endpoints
│   │   └── queue.js                # Bull queue
│   │
│   ├── 🛣️ Routes
│   │   ├── integrationRoutes.js    # Integration API
│   │   └── adminRoutes.js          # Admin API
│   │
│   └── ⚙️ Config & Deployment
│       ├── vercel.json             # Vercel config
│       └── .gitignore
│
└── 📚 Documentation
    ├── README.md                   # Features & setup
    ├── QUICK_START.md              # Démarrer en 5 min
    ├── DEPLOYMENT.md               # Guide déploiement
    ├── TESTING.md                  # Test cases
    ├── LAUNCH_CHECKLIST.md         # Avant lancement
    ├── PITCH_DECK.md               # Pitch investors
    ├── PROJECT_SUMMARY.md          # Vue d'ensemble
    ├── GO_TO_MARKET.md             # Stratégie commerciale
    ├── FOUNDER_PROFILE.md          # Ton profil
    └── FOUNDER_DEVELOPMENT.md      # Plan développement
```

---

## 🚀 COMMENT ACCÉDER À TON OUTIL

### Option 1: Accès Fichiers Localement

**Sur ton ordinateur:**

```bash
# Option A: Via terminal
cd /home/claude/leadforce
ls -la

# Option B: Via file explorer
# Windows: C:\Users\[user]\... (ou le chemin équivalent)
# Mac/Linux: Open folder /home/claude/leadforce
```

### Option 2: Accès via GitHub (Futur)

```bash
# Clone repository
git clone https://github.com/leadforce/leadforce.git
cd leadforce

# Install & setup (voir plus bas)
```

### Option 3: Accès en Ligne (Après Deploy sur Vercel)

```
Frontend: https://leadforce.vercel.app
Backend API: https://leadforce-api.vercel.app
Admin: https://leadforce.vercel.app/admin
```

---

## ⚙️ CONFIGURATION COMPLÈTE (ÉTAPE PAR ÉTAPE)

### ÉTAPE 1: Installation Locale (5 minutes)

```bash
# 1. Aller au dossier
cd /home/claude/leadforce

# 2. Installer dépendances backend
npm install

# 3. Installer dépendances frontend
cd frontend
npm install
cd ..
```

**Vérifier:**
```bash
npm --version    # Should be v18+
node --version   # Should be v18+
```

### ÉTAPE 2: Configurer la Base de Données (5 minutes)

```bash
# 1. Créer la DB PostgreSQL
createdb leadforce

# 2. Importer le schema
psql leadforce < database.sql

# 3. Vérifier les tables
psql leadforce
\dt

# Output devrait afficher:
# users | agencies | conversations | scores | etc...
```

**Connection string:**
```
postgresql://localhost:5432/leadforce
```

### ÉTAPE 3: Configurer les Variables d'Environnement (10 minutes)

```bash
# 1. Copier template
cp .env.example .env

# 2. Éditer .env avec tes valeurs
nano .env  # ou utilise ton éditeur préféré

# 3. Voici les valeurs à configurer:
```

**Remplissage de .env:**

```env
# DATABASE
DB_HOST=localhost
DB_PORT=5432
DB_NAME=leadforce
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your_random_secret_key_min_32_chars

# CLAUDE API (Obtenir sur https://console.anthropic.com)
CLAUDE_API_KEY=sk-ant-...

# STRIPE (Obtenir sur https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# GMAIL (Obtenir sur https://console.cloud.google.com)
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REDIRECT_URI=http://localhost:3000/api/auth/gmail/callback

# WHATSAPP (Obtenir sur https://developers.facebook.com)
WHATSAPP_BUSINESS_ACCOUNT_ID=...
WHATSAPP_BUSINESS_TOKEN=...
WHATSAPP_BUSINESS_PHONE_NUMBER_ID=...
WHATSAPP_BUSINESS_WEBHOOK_TOKEN=random_token_123

# EMAIL (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=app_password (Generate in Gmail)

# REDIS (Optional, for queue)
REDIS_HOST=localhost
REDIS_PORT=6379

# APP CONFIG
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# REACT
REACT_APP_API_URL=http://localhost:3000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

### ÉTAPE 4: Démarrer Backend & Frontend (2 minutes)

**Terminal 1 - Backend:**
```bash
cd /home/claude/leadforce
npm run dev

# Output:
# 🚀 LeadForce server running on port 3000
# 📧 Scheduler initialized
# 🔄 Queues ready
# 💬 Webhooks listening
```

**Terminal 2 - Frontend:**
```bash
cd /home/claude/leadforce/frontend
npm start

# Output:
# webpack compiled with 0 warnings
# Compiled successfully!
# On Your Network: http://localhost:3000
```

### ÉTAPE 5: Vérifier que ça Marche! (2 minutes)

Ouvre ton navigateur et visite:

```
http://localhost:3000
```

Tu devrais voir:
- ✅ Page de login
- ✅ Bouton "S'inscrire"
- ✅ Design LeadForce complet

---

## 🔌 CONFIGURATION DES APIS EXTERNES

### 1. Claude API (Obligatoire)

```bash
# 1. Aller sur https://console.anthropic.com
# 2. Créer une nouvelle clé API
# 3. Copier et coller dans .env:
CLAUDE_API_KEY=sk-ant-...

# 4. Vérifier que ça marche:
curl -H "Authorization: Bearer sk-ant-..." \
  https://api.anthropic.com/v1/messages
```

### 2. Stripe (Obligatoire pour Paiements)

```bash
# 1. Aller sur https://dashboard.stripe.com
# 2. Dashboard → API Keys → Copy Secret Key
# 3. Dans .env:
STRIPE_SECRET_KEY=sk_test_...

# 4. Créer les products:
# - Agent: 49€/month
# - Agence: 199€/month
# - Admin: 1€/month

# 5. Récupérer les Price IDs et les mettre dans stripeService.js

# 6. Configure webhook:
# Webhook URL: http://localhost:3000/api/webhooks/stripe
# Events: checkout.session.completed, customer.subscription.*
```

### 3. Gmail OAuth (Pour intégration Email)

```bash
# 1. Aller sur https://console.cloud.google.com
# 2. Créer un nouveau projet
# 3. Activer Gmail API
# 4. Créer OAuth 2.0 Client (Type: Web application)
# 5. Authorized redirect URIs:
#    - http://localhost:3000/api/auth/gmail/callback
#    - https://leadforce.vercel.app/api/auth/gmail/callback
# 6. Récupérer credentials et mettre dans .env:
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
```

### 4. WhatsApp Business (Pour intégration WhatsApp)

```bash
# 1. Aller sur https://developers.facebook.com
# 2. Créer une app
# 3. Ajouter WhatsApp Business API
# 4. Récupérer:
#    - Phone Number ID
#    - Access Token
#    - Webhook Token (créer toi-même)
# 5. Mettre dans .env:
WHATSAPP_BUSINESS_PHONE_NUMBER_ID=...
WHATSAPP_BUSINESS_TOKEN=...
WHATSAPP_BUSINESS_WEBHOOK_TOKEN=...

# 6. Configure webhook:
# Webhook URL: http://localhost:3000/api/webhooks/whatsapp
# Verify Token: Utilise WHATSAPP_BUSINESS_WEBHOOK_TOKEN
```

---

## ✅ CHECKLIST DE CONFIGURATION

```
Frontend:
☐ npm install (frontend)
☐ Fichiers React compilés
☐ App démarre sur localhost:3000

Backend:
☐ npm install (backend)
☐ Database créée et migratée
☐ Server démarre sur port 3000
☐ Scheduler initialisé
☐ Queues prêtes

Environnement:
☐ .env créé avec toutes les variables
☐ DB_HOST=localhost, DB_NAME=leadforce
☐ CLAUDE_API_KEY=sk-ant-...
☐ STRIPE_SECRET_KEY=sk_test_...
☐ GMAIL credentials configurés
☐ WHATSAPP credentials configurés
☐ JWT_SECRET defini

APIs Externes:
☐ Claude API tested
☐ Stripe keys validées
☐ Gmail OAuth configured
☐ WhatsApp webhook configured
☐ Email SMTP testée

Test Initial:
☐ Frontend charge (localhost:3000)
☐ Backend répond (/api/health)
☐ Database connectée
☐ Claude API fonctionne
☐ Stripe keys validées
```

---

## 🧪 TEST RAPIDE (2 minutes)

### Tester le Backend

```bash
# Terminal 3 (avec backend + DB en cours)

# 1. Health check
curl http://localhost:3000/api/health
# Output: {"status":"ok","timestamp":"..."}

# 2. Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"test123456",
    "firstName":"Ahmed",
    "lastName":"Test"
  }'
# Output: {"token":"eyJhbGc...","user":{...}}

# 3. Get profile
TOKEN="..." # From register response
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/user/profile
# Output: {"id":"...","email":"test@example.com",...}
```

### Tester le Frontend

```bash
# 1. Va sur http://localhost:3000
# 2. Clique sur "S'inscrire"
# 3. Remplis:
#    - Email: test@example.com
#    - Password: test123456
#    - Prénom: Ahmed
#    - Nom: Test
# 4. Clique "S'inscrire"
# 5. Tu devrais voir le Dashboard!
```

---

## 🐛 TROUBLESHOOTING

### Erreur: "Port 3000 already in use"
```bash
# Solution 1: Kill le processus
lsof -i :3000
kill -9 <PID>

# Solution 2: Utilise un autre port
PORT=3001 npm run dev
```

### Erreur: "Database connection refused"
```bash
# Check PostgreSQL est démarré
pg_isready

# Vérifier connection string
echo $DATABASE_URL

# Recréer la DB
dropdb leadforce
createdb leadforce
psql leadforce < database.sql
```

### Erreur: "Claude API key invalid"
```bash
# Vérifier la clé
echo $CLAUDE_API_KEY

# Tester manuellement
curl https://api.anthropic.com/v1/models \
  -H "Authorization: Bearer sk-ant-..."
```

### Erreur: "Can't find module..."
```bash
# Réinstaller dépendances
rm -rf node_modules
npm install

# Frontend aussi
cd frontend
rm -rf node_modules
npm install
cd ..
```

### Frontend ne voit pas le Backend
```bash
# Vérifier .env.local existe dans frontend:
cd frontend
echo "REACT_APP_API_URL=http://localhost:3000" > .env.local

# Redémarrer frontend
npm start
```

---

## 📝 FICHIERS IMPORTANTS À CONNAÎTRE

### Configuration
- **.env** - Variables d'environnement (à créer)
- **.env.example** - Template (déjà créé)
- **vercel.json** - Config Vercel (pour deploy)
- **package.json** - Dépendances Node

### Backend Principal
- **server.js** - Express server + routes (IMPORTANT!)
- **database.sql** - Schema PostgreSQL
- **chatbot.js** - Claude AI logic

### Documentation
- **QUICK_START.md** - Démarrer rapidement ⭐
- **README.md** - Features + overview
- **DEPLOYMENT.md** - Deploy sur Vercel
- **TESTING.md** - Test cases
- **LAUNCH_CHECKLIST.md** - Avant lancement

---

## 🎯 NEXT STEPS

Après configuration:

1. **Créer un compte test**
   - Va sur http://localhost:3000
   - S'inscrire avec test@example.com
   - Vérifier le dashboard charge

2. **Tester les intégrations**
   - Settings → Connecter Gmail
   - Settings → Connecter WhatsApp
   - Vérifier connections fonctionne

3. **Tester Stripe**
   - Settings → Pricing
   - Clique "Commencer gratuitement"
   - Utilise carte test Stripe

4. **Tester les leads**
   - Simuler réception message
   - Vérifier chatbot répond
   - Vérifier score généré

5. **Vérifier rapports**
   - Aller dans Reports
   - Vérifier stats s'affichent
   - Vérifier daily report email arrive

---

## 💡 TIPS

**Pour développement:**
```bash
# Mode watch (auto-reload)
npm run dev

# Vérifier les logs
tail -f logs/server.log
```

**Pour testing:**
```bash
# Run tests
npm test

# Coverage
npm run test:coverage
```

**Pour cleaning:**
```bash
# Supprimer tous les fichiers générés
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf .env
```

---

## 🚀 READY?

Tu es maintenant prêt à:
1. ✅ Accéder à ton outil (http://localhost:3000)
2. ✅ Le configurer (variables + APIs)
3. ✅ Le tester localement
4. ✅ Le déployer sur Vercel
5. ✅ L'utiliser avec tes premiers agents!

**Commence par QUICK_START.md pour un démarrage rapide! 🚀**

---

**Créé pour Ahmed Youssef Berred**
**LeadForce v1.0.0**
**Mai 2026**
