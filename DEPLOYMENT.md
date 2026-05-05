# Déploiement LeadForce

## Guide de déploiement complet pour Vercel + Supabase

### 1. Préparation Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Login à Vercel
vercel login

# Deploy (depuis le dossier root)
vercel
```

### 2. Configuration Base de Données (Supabase)

```bash
# Créer un projet Supabase sur https://supabase.com
# Récupérer DATABASE_URL depuis Project Settings → Database → Connection String
```

**Dans Vercel Dashboard:**
- Project Settings → Environment Variables
- Ajouter les variables:
  ```
  DATABASE_URL=postgresql://...
  CLAUDE_API_KEY=sk-ant-...
  STRIPE_SECRET_KEY=sk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  JWT_SECRET=your_random_secret_key
  GMAIL_CLIENT_ID=...
  GMAIL_CLIENT_SECRET=...
  WHATSAPP_BUSINESS_TOKEN=...
  SMTP_USER=your_email@gmail.com
  SMTP_PASSWORD=app_specific_password
  ```

### 3. Stripe Setup

```bash
# Créer compte Stripe sur https://stripe.com

# Récupérer les clés depuis Dashboard
# Copier dans Vercel Environment Variables

# Créer les produits et prices
# Agent: 49€/mois
# Agence: 199€/mois  
# Admin: 1€/mois

# Récupérer les Price IDs et mettre dans stripeService.js
```

### 4. Gmail OAuth Setup

```bash
# Sur https://console.cloud.google.com

# Créer un nouveau projet
# Activer Gmail API
# Créer OAuth 2.0 Client ID (type: Web application)

# Authorized redirect URIs:
# https://your-domain.vercel.app/api/auth/gmail/callback
# http://localhost:3000/api/auth/gmail/callback

# Copier Client ID et Secret dans Vercel
```

### 5. WhatsApp Business Setup

```bash
# Sur https://developers.facebook.com

# Créer une app
# Ajouter WhatsApp Business API
# Récupérer Phone Number ID et Access Token

# Configurer webhook
# Webhook URL: https://your-domain.vercel.app/api/webhooks/whatsapp
# Verify Token: (créer un token aléatoire)
```

### 6. Deploy Frontend

```bash
# Le frontend est servi par Vercel automatiquement
# depuis frontend/public

# Build frontend en local d'abord pour tester:
cd frontend
npm install
npm run build
```

### 7. Vérifier le déploiement

```bash
# Check health endpoint
curl https://your-domain.vercel.app/api/health

# Check webhook WhatsApp
curl -X GET "https://your-domain.vercel.app/api/webhooks/whatsapp?hub.verify_token=YOUR_TOKEN&hub.challenge=test_challenge"
```

### 8. Configurer Domaine Custom

**Dans Vercel Dashboard:**
- Project Settings → Domains
- Ajouter votre domaine
- Ajouter les records DNS selon les instructions Vercel

### 9. Variables d'Environnement Production

```env
# Backend
NODE_ENV=production
PORT=3000
DB_HOST=db.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DATABASE_URL=postgresql://...

# APIs
CLAUDE_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=random_strong_key_min_32_chars

# Gmail
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REDIRECT_URI=https://your-domain.vercel.app/api/auth/gmail/callback

# WhatsApp
WHATSAPP_BUSINESS_ACCOUNT_ID=...
WHATSAPP_BUSINESS_TOKEN=...
WHATSAPP_BUSINESS_PHONE_NUMBER_ID=...
WHATSAPP_BUSINESS_WEBHOOK_TOKEN=random_token

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=app_password

# Frontend
REACT_APP_API_URL=https://your-domain.vercel.app
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_...

# App
APP_NAME=LeadForce
APP_URL=https://your-domain.vercel.app
```

### 10. Monitoring & Logs

```bash
# Voir les logs en temps réel
vercel logs

# Accéder au dashboard
# https://vercel.com/dashboard
```

### 11. Maintenance

```bash
# Redeploy après changements
vercel

# Rollback version précédente
vercel rollback

# Voir versions déployées
vercel list
```

### 12. Checklist Final

- [ ] Base de données configurée et migratée
- [ ] Variables d'environnement toutes définies
- [ ] Stripe prices créés et IDs configurés
- [ ] Gmail OAuth configuré et redirect URIs
- [ ] WhatsApp webhook URL configurée
- [ ] Domain DNS pointant vers Vercel
- [ ] SSL certificate auto-généré par Vercel
- [ ] Health check endpoint répond 200
- [ ] Webhooks reçoivent les données correctement
- [ ] Frontend charge correctement
- [ ] Login/Register fonctionne
- [ ] Trial activation fonctionne

### Troubleshooting

**Les webhooks ne reçoivent rien?**
- Vérifier que le webhook URL est correct
- Vérifier que le token de vérification est bon
- Vérifier les logs Vercel pour les erreurs

**Erreur base de données?**
- Vérifier DATABASE_URL est correct
- Vérifier les migrations SQL ont été exécutées
- Vérifier les permissions de la DB

**Stripe ne fonctionne pas?**
- Vérifier les clés Stripe sont en mode LIVE
- Vérifier les Prices IDs sont corrects
- Vérifier le webhook secret

**Email ne s'envoie pas?**
- Vérifier SMTP credentials
- Vérifier Gmail a activé "Less secure apps" ou App Passwords
- Vérifier les logs pour les erreurs SMTP
