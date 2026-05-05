# LeadForce - Quick Access Guide 🚀

## 📍 LOCALISATION

```
/home/claude/leadforce/
```

---

## ⚡ DÉMARRER EN 30 SECONDES (Copy-Paste)

### 1. Ouvrir Terminal et aller au dossier

```bash
cd /home/claude/leadforce
```

### 2. Installer les dépendances

```bash
npm install && cd frontend && npm install && cd ..
```

### 3. Créer la base de données

```bash
createdb leadforce
psql leadforce < database.sql
```

### 4. Créer le fichier .env

```bash
cp .env.example .env
```

### 5. Éditer .env (Voir section CI-DESSOUS)

### 6. Terminal 1 - Démarrer le Backend

```bash
npm run dev
```

### 7. Terminal 2 - Démarrer le Frontend

```bash
cd frontend && npm start
```

### 8. Ouvrir dans le navigateur

```
http://localhost:3000
```

---

## 📋 VARIABLES .ENV (Copy-Paste)

Copie ceci dans ton fichier `.env` et remplis les valeurs:

```env
# DATABASE (Locale)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=leadforce
DB_USER=postgres
DB_PASSWORD=password

# API Keys à obtenir
CLAUDE_API_KEY=sk-ant-XXXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXX
JWT_SECRET=my_super_secret_key_min_32_characters_long

# GMAIL (https://console.cloud.google.com)
GMAIL_CLIENT_ID=XXXXXXXXXXXXX.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=XXXXXXXXXXXXX
GMAIL_REDIRECT_URI=http://localhost:3000/api/auth/gmail/callback

# WHATSAPP (https://developers.facebook.com)
WHATSAPP_BUSINESS_ACCOUNT_ID=XXXXXXXXXXXXX
WHATSAPP_BUSINESS_TOKEN=XXXXXXXXXXXXX
WHATSAPP_BUSINESS_PHONE_NUMBER_ID=XXXXXXXXXXXXX
WHATSAPP_BUSINESS_WEBHOOK_TOKEN=my_webhook_token_123

# EMAIL (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=app_password_from_gmail

# REDIS (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# APP
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# REACT
REACT_APP_API_URL=http://localhost:3000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXX
```

---

## 🔑 OÙ OBTENIR LES CLÉS API

### 1. CLAUDE API
```
https://console.anthropic.com
→ API Keys → Create New Key
→ Copier CLAUDE_API_KEY
```

### 2. STRIPE (Test Mode)
```
https://dashboard.stripe.com
→ Developers → API Keys
→ Copy Secret Key (starts with sk_test_)
→ Webhook: http://localhost:3000/api/webhooks/stripe
```

### 3. GMAIL OAUTH
```
https://console.cloud.google.com
→ Create Project → Search "Gmail API" → Enable
→ Credentials → Create OAuth 2.0 Client
→ Authorized redirect URIs:
   - http://localhost:3000/api/auth/gmail/callback
   - https://your-domain.vercel.app/api/auth/gmail/callback
```

### 4. WHATSAPP BUSINESS
```
https://developers.facebook.com
→ Create App → WhatsApp API
→ Get: Account ID, Phone Number ID, Access Token
→ Webhook: http://localhost:3000/api/webhooks/whatsapp
```

---

## 🧪 TESTER RAPIDEMENT

### Test Backend Health

```bash
# Dans Terminal 3 (backend doit tourner)
curl http://localhost:3000/api/health
```

**Output attendu:**
```json
{"status":"ok","timestamp":"...","database":"connected"}
```

### Test Register Utilisateur

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"test123456",
    "firstName":"Ahmed",
    "lastName":"Test"
  }'
```

### Test Conversation

```bash
# Avec le TOKEN obtenu de register
TOKEN="eyJhbGc..."

curl -X GET http://localhost:3000/api/conversations \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎯 FICHIERS À CONNAÎTRE

| Fichier | Localisation | Purpose |
|---------|--------------|---------|
| **server.js** | Racine | Express server principal |
| **database.sql** | Racine | Schema PostgreSQL |
| **chatbot.js** | Racine | Claude AI logic |
| **App.js** | frontend/src/ | React main component |
| **.env** | Racine | Variables (À CRÉER) |
| **QUICK_START.md** | Racine | 5-min guide ⭐ |
| **DEPLOYMENT.md** | Racine | Deploy sur Vercel |
| **README.md** | Racine | Features overview |

---

## 🔗 LIENS IMPORTANTS

```
Frontend: http://localhost:3000
Backend API: http://localhost:3000/api
Health Check: http://localhost:3000/api/health
Dashboard: http://localhost:3000/dashboard
Settings: http://localhost:3000/settings
Admin: http://localhost:3000/admin
```

---

## ⚠️ ERREURS COMMUNES

### "Port 3000 already in use"
```bash
lsof -i :3000
kill -9 <PID>
```

### "Database connection failed"
```bash
createdb leadforce
psql leadforce < database.sql
```

### "Module not found"
```bash
rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

### "API_KEY invalid"
```bash
# Vérifier dans .env
echo $CLAUDE_API_KEY

# Doit commencer par: sk-ant-
```

---

## 📱 ACCOUNT DE TEST

```
Email: test@example.com
Password: test123456
```

Après registration, tu verras:
- ✅ Onboarding tutorial
- ✅ Empty dashboard (en attente de leads)
- ✅ Settings pour connecter intégrations
- ✅ Pricing page

---

## 🚀 STRUCTURE FICHIERS (POUR RÉFÉRENCE)

```
/home/claude/leadforce/
├── Backend (Racine)
│   ├── server.js                    (Express principal)
│   ├── package.json                 (Dépendances)
│   ├── .env                         (À créer)
│   ├── database.sql                 (DB schema)
│   ├── chatbot.js                   (Claude)
│   ├── emailService.js              (Emails)
│   ├── whatsappService.js           (WhatsApp)
│   ├── gmailService.js              (Gmail)
│   ├── stripeService.js             (Stripe)
│   ├── queue.js                     (Bull)
│   ├── scheduler.js                 (Jobs)
│   └── ... autres services
│
├── Frontend
│   ├── public/index.html
│   ├── src/
│   │   ├── App.js                   (Main)
│   │   ├── pages/                   (Dashboard, Settings, etc)
│   │   ├── components/              (LeadCard, Onboarding, etc)
│   │   └── styles/                  (CSS)
│   └── package.json
│
└── Documentation
    ├── README.md
    ├── QUICK_START.md               ⭐ START HERE
    ├── SETUP_GUIDE_COMPLET.md       (Detailed)
    ├── DEPLOYMENT.md                (Deploy)
    └── ... autres guides
```

---

## 📊 COMMANDES UTILES

```bash
# Vérifier Node.js/npm versions
node --version
npm --version

# Aller au projet
cd /home/claude/leadforce

# Installer dépendances
npm install

# Démarrer backend (dev mode)
npm run dev

# Démarrer frontend
cd frontend && npm start

# Vérifier DB
psql leadforce -c "\dt"

# Supprimer et recréer DB
dropdb leadforce && createdb leadforce && psql leadforce < database.sql

# Voir logs temps réel
tail -f logs/*.log

# Kill processus sur port
lsof -i :3000 && kill -9 <PID>
```

---

## ✅ CHECKLIST RAPIDE

- [ ] `cd /home/claude/leadforce`
- [ ] `npm install && cd frontend && npm install && cd ..`
- [ ] `createdb leadforce && psql leadforce < database.sql`
- [ ] `cp .env.example .env`
- [ ] Éditer .env avec tes clés API
- [ ] Terminal 1: `npm run dev`
- [ ] Terminal 2: `cd frontend && npm start`
- [ ] Ouvrir http://localhost:3000
- [ ] S'inscrire avec test@example.com
- [ ] Voir le Dashboard!

---

## 🎬 NEXT STEPS

1. **Configure les APIs** (Stripe, Gmail, WhatsApp)
2. **Teste les intégrations** (connect Gmail, WhatsApp)
3. **Teste un lead** (envoi message test)
4. **Génère un score** (envoie formulaire)
5. **Reçois notification** (check email)
6. **Deploy sur Vercel** (quand prêt)

---

## 💬 BESOIN D'AIDE?

Consulte ces fichiers:
- **QUICK_START.md** - 5 min guide
- **SETUP_GUIDE_COMPLET.md** - Détails complets
- **README.md** - Features overview
- **TESTING.md** - Test cases

---

**Ahmed Youssef Berred | LeadForce | Mai 2026**

**Ready? Open your terminal and paste the commands above! 🚀**
