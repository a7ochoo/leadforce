# LeadForce - Setup Guide pour WINDOWS

## 🪟 Tu es sur Windows! (Pas Linux)

Les commandes Linux ne fonctionnent pas sur Windows PowerShell.
Ce guide est spécifique à Windows.

---

## 📍 OÙ SONT TES FICHIERS?

Les fichiers LeadForce ont été créés sur le serveur Claude (Linux).
Tu dois les **télécharger** ou les **recréer** sur ton ordinateur Windows.

### Option 1: Télécharger les Fichiers (RECOMMANDÉ)

**TA QUESTION:** "Où télécharger les fichiers LeadForce?"

**RÉPONSE:** Les fichiers sont créés dans mon environnement serveur.
Tu dois les exporter/télécharger vers ton PC Windows.

Pour cela, je peux créer un **ZIP** avec tous les fichiers!

---

## 🪟 SETUP WINDOWS (Pas en ligne de commande, mais graphique)

### Étape 1: Installer les Prérequis

**A) Node.js (Important!)**
```
1. Va sur https://nodejs.org/
2. Télécharge "LTS" version
3. Run l'installer
4. Follow les steps (next, next, finish)
5. Redémarre ton PC
```

**B) PostgreSQL (Important!)**
```
1. Va sur https://www.postgresql.org/download/windows/
2. Télécharge l'installer
3. Run et suivre les instructions
4. Username: postgres
5. Password: (choisis un)
6. Port: 5432 (par défaut)
```

**Vérifier que c'est installé:**
```powershell
node --version      # Doit afficher v18+
npm --version       # Doit afficher 9+
psql --version      # Doit afficher PostgreSQL
```

### Étape 2: Créer le Dossier du Projet

Sur Windows (graphique):
```
1. Ouvrir "Explorateur de fichiers"
2. Aller à: C:\Users\Administrateur\Documents
3. Créer un nouveau dossier: leadforce
4. Double-clic pour entrer dedans
```

Ou en PowerShell:
```powershell
mkdir "C:\Users\Administrateur\Documents\leadforce"
cd "C:\Users\Administrateur\Documents\leadforce"
```

### Étape 3: Télécharger les Fichiers LeadForce

**Option A: Si je crée un ZIP**
```
1. Attendre que je crée le ZIP
2. Télécharger le fichier
3. Décompresser dans C:\Users\Administrateur\Documents\leadforce\
4. Continue à Étape 4
```

**Option B: Créer manuellement**
Si tu veux créer les fichiers manuellement, je peux t'aider.

### Étape 4: Ouvrir PowerShell dans le Dossier

```powershell
# Option 1: Via PowerShell
cd "C:\Users\Administrateur\Documents\leadforce"

# Option 2: Via Windows Explorer
# 1. Ouvrir C:\Users\Administrateur\Documents\leadforce\
# 2. Right-click → "Open PowerShell window here"
```

### Étape 5: Installer les Dépendances

```powershell
# Aller au dossier
cd "C:\Users\Administrateur\Documents\leadforce"

# Installer backend
npm install

# Installer frontend
cd frontend
npm install
cd ..
```

⏱️ **Cela prendra 5-10 minutes** (attend patiemment!)

### Étape 6: Créer la Base de Données

```powershell
# Ouvrir PostgreSQL command line
psql -U postgres

# Dans psql:
CREATE DATABASE leadforce;
\c leadforce
\i database.sql

# Quitter
\q
```

**OU graphique (PgAdmin):**
```
1. Ouvrir PgAdmin (installé avec PostgreSQL)
2. Login avec le password que tu as choisi
3. Right-click "Databases" → Create → Database
4. Name: leadforce
5. Click Create
6. Right-click leadforce → Restore
7. Select database.sql file
8. Restore
```

### Étape 7: Créer le Fichier .env

**Via PowerShell:**
```powershell
# Aller au dossier
cd "C:\Users\Administrateur\Documents\leadforce"

# Copier le template
Copy-Item .env.example -Destination .env

# Éditer avec le bloc-notes
notepad .env
```

**Contenu de .env:**
```env
# DATABASE
DB_HOST=localhost
DB_PORT=5432
DB_NAME=leadforce
DB_USER=postgres
DB_PASSWORD=ton_password_postgres

# JWT
JWT_SECRET=my_super_secret_key_min_32_characters_long

# APIS (À obtenir)
CLAUDE_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_...
GMAIL_CLIENT_ID=...
WHATSAPP_BUSINESS_TOKEN=...
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# APP
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# REACT
REACT_APP_API_URL=http://localhost:3000
```

### Étape 8: Démarrer le Backend

**Terminal 1 (PowerShell):**
```powershell
cd "C:\Users\Administrateur\Documents\leadforce"
npm run dev
```

**Attendu:**
```
🚀 LeadForce server running on port 3000
📧 Scheduler initialized
🔄 Queues ready
```

### Étape 9: Démarrer le Frontend

**Terminal 2 (PowerShell NOUVEAU):**
```powershell
cd "C:\Users\Administrateur\Documents\leadforce\frontend"
npm start
```

**Attendu:**
```
compiled successfully!
Compiled successfully!
On Your Network: http://localhost:3000
```

### Étape 10: Ouvrir dans le Navigateur

```
http://localhost:3000
```

Tu devrais voir la page de login LeadForce!

---

## 🔑 OBTENIR LES CLÉS API (Windows)

### 1. Claude API
```
1. Va sur https://console.anthropic.com
2. Sign in ou Create account
3. API Keys → Create New Key
4. Copier la clé (sk-ant-...)
5. Coller dans .env à CLAUDE_API_KEY=
```

### 2. Stripe (Test Mode)
```
1. Va sur https://dashboard.stripe.com
2. Sign up ou Login
3. Developers → API Keys
4. Copier Secret Key (sk_test_...)
5. Coller dans .env à STRIPE_SECRET_KEY=
```

### 3. Gmail OAuth
```
1. Va sur https://console.cloud.google.com
2. Create new project
3. Search "Gmail API" → Enable
4. Credentials → Create OAuth 2.0 Client
5. Authorized URIs:
   - http://localhost:3000/api/auth/gmail/callback
6. Copy credentials
7. Coller dans .env
```

### 4. WhatsApp Business
```
1. Va sur https://developers.facebook.com
2. Create App
3. Add WhatsApp Business API
4. Copy Phone Number ID et Access Token
5. Coller dans .env
```

---

## 🧪 TESTER RAPIDEMENT

### Test Backend

Ouvre un **3ème PowerShell** et run:

```powershell
# Test health
Invoke-WebRequest -Uri http://localhost:3000/api/health

# Ou via curl (si installé)
curl http://localhost:3000/api/health
```

### Test Frontend

Ouvre navigateur:
```
http://localhost:3000
```

S'inscrire avec:
```
Email: test@example.com
Password: test123456
```

---

## 🪟 COMMANDES WINDOWS (PowerShell)

```powershell
# Aller au dossier
cd "C:\Users\Administrateur\Documents\leadforce"

# Installer dépendances
npm install
cd frontend
npm install
cd ..

# Démarrer backend
npm run dev

# Démarrer frontend (dans backend folder)
cd frontend
npm start

# Vérifier PostgreSQL
psql -U postgres

# Vérifier Node
node --version
npm --version
```

---

## 🛠️ SI QUELQUE CHOSE NE MARCHE PAS

### "npm: commande non trouvée"
```
Solution: Node.js n'est pas installé
1. Télécharge Node.js depuis https://nodejs.org/
2. Installe-le
3. Redémarre PowerShell
4. Réessaye
```

### "createdb: commande non trouvée"
```
Solution: PostgreSQL n'est pas dans le PATH
1. Ouvrir une invite de commande PostgreSQL
2. Ou utiliser PgAdmin (graphique)
```

### "Cannot find path"
```
Solution: Le chemin n'existe pas
1. Vérifier que le dossier existe
2. Vérifier l'orthographe du chemin
3. Utiliser explorer pour naviguer
```

### "Port 3000 already in use"
```
Solution: Quelque chose utilise le port
1. Fermer tous les PowerShell
2. Redémarrer ton PC
3. Réessayer
```

---

## 📋 STRUCTURE WINDOWS

Sur ton PC Windows, ça ressemblera à:

```
C:\Users\Administrateur\Documents\leadforce\
├── frontend\
│   ├── src\
│   ├── public\
│   └── package.json
├── server.js
├── chatbot.js
├── package.json
├── database.sql
├── .env (À créer!)
└── ... autres fichiers
```

---

## ✅ CHECKLIST WINDOWS

- [ ] Node.js installé
- [ ] PostgreSQL installé
- [ ] Dossier leadforce créé
- [ ] Fichiers téléchargés/copiés
- [ ] npm install (backend)
- [ ] npm install (frontend)
- [ ] createdb leadforce
- [ ] database.sql importé
- [ ] .env créé avec clés API
- [ ] Terminal 1: npm run dev (backend)
- [ ] Terminal 2: npm start (frontend)
- [ ] http://localhost:3000 marche!

---

## 🚀 NEXT STEPS

1. **Télécharger Node.js** https://nodejs.org/
2. **Télécharger PostgreSQL** https://www.postgresql.org/download/windows/
3. **Créer le dossier** C:\Users\Administrateur\Documents\leadforce\
4. **Me dire** que tu as besoin des fichiers (ZIP)
5. **Suivre les étapes ci-dessus**

---

## 💬 BESOIN D'AIDE?

1. Copie-colle le message d'erreur exact
2. Me dis sur quelle étape tu es bloqué
3. Je vais te aider à fixer

**Exemple:**
```
Je suis à l'étape 5, quand je run npm install:
[ERROR MESSAGE HERE]
```

---

**Créé pour Ahmed sur Windows**
**LeadForce Setup**
**Mai 2026**
