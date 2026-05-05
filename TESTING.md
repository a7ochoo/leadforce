# LeadForce Testing Guide

## Testing Local Setup

### 1. Backend Setup

```bash
# Install dependencies
cd leadforce
npm install

# Setup PostgreSQL
createdb leadforce
psql leadforce < database.sql

# Copy environment variables
cp .env.example .env

# Edit .env with local values
DB_HOST=localhost
DB_PORT=5432
DB_NAME=leadforce
DB_USER=postgres
DB_PASSWORD=password

# Start backend
npm run dev
# Server runs on http://localhost:3000
```

### 2. Frontend Setup

```bash
cd leadforce/frontend
npm install

# Create .env.local
echo "REACT_APP_API_URL=http://localhost:3000" > .env.local

# Start frontend
npm start
# App runs on http://localhost:3000
```

### 3. Test User Accounts

**Account 1 - Agent Solo:**
```
Email: agent@example.com
Password: test123456
Plan: agent
```

**Account 2 - Agence:**
```
Email: agence@example.com
Password: test123456
Plan: agence
```

**Account 3 - Admin:**
```
Email: admin@example.com
Password: test123456
Plan: admin
```

## API Testing (cURL)

### Auth Endpoints

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get profile
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Conversation Endpoints

```bash
# Get conversations
curl -X GET "http://localhost:3000/api/conversations?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get conversation details
curl -X GET http://localhost:3000/api/conversations/CONVERSATION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Integration Endpoints

```bash
# Get integrations
curl -X GET http://localhost:3000/api/integrations \
  -H "Authorization: Bearer YOUR_TOKEN"

# Connect WhatsApp
curl -X POST http://localhost:3000/api/whatsapp-business/connect \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+33612345678",
    "apiToken": "your_token"
  }'
```

### Stripe Endpoints

```bash
# Create checkout session
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan": "agent"}'

# Get billing portal
curl -X POST http://localhost:3000/api/stripe/billing-portal \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Frontend Testing

### Manual Test Cases

**Authentication Flow:**
1. [ ] Load login page
2. [ ] Register new account
3. [ ] Verify email confirmation
4. [ ] Login with credentials
5. [ ] Check trial badge shows
6. [ ] Logout

**Onboarding Flow:**
1. [ ] Show onboarding on first login
2. [ ] Go through all 10 steps
3. [ ] Complete onboarding
4. [ ] Onboarding doesn't show again

**Dashboard Flow:**
1. [ ] Load dashboard with mock leads
2. [ ] Filter by classification (BON/MOYEN/FAIBLE)
3. [ ] View lead details
4. [ ] See conversation history
5. [ ] Close lead details modal

**Settings/Integrations:**
1. [ ] Load settings page
2. [ ] Click "Connect Gmail Pro"
3. [ ] Authorize Gmail (test mode)
4. [ ] Verify connection shows
5. [ ] Disconnect Gmail
6. [ ] Fill WhatsApp form
7. [ ] Submit WhatsApp connection
8. [ ] Verify connected

**Reports:**
1. [ ] Load reports page
2. [ ] View daily stats
3. [ ] See breakdown (Répondeurs/Demandeurs)
4. [ ] View top lead
5. [ ] See trends

**Pricing/Checkout:**
1. [ ] Load pricing page
2. [ ] Click "Commencer gratuitement"
3. [ ] Redirect to Stripe (test mode)
4. [ ] Complete payment (use test card)
5. [ ] Verify subscription active

### Test Data

**Test Conversation (Répondeur):**
```json
{
  "prospect_name": "Marie Dupont",
  "prospect_email": "marie@example.com",
  "prospect_phone": "06 12 34 56 78",
  "type": "respondeur",
  "channel": "whatsapp_business",
  "classification": "bon",
  "score": 68,
  "annonce_id": "12345"
}
```

**Test Conversation (Demandeur):**
```json
{
  "prospect_name": "Jean Martin",
  "prospect_email": "jean@example.com",
  "prospect_phone": "06 98 76 54 32",
  "type": "demandeur",
  "channel": "gmail_pro",
  "classification": "moyen",
  "score": 45
}
```

## Stripe Testing

### Test Cards

```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
Amex: 3782 822463 10005
```

All with:
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

### Test Webhook

```bash
# Test webhook locally using ngrok
npm install -g ngrok
ngrok http 3000

# Update Stripe webhook URL to ngrok URL
# https://ngrok.io/YOUR_ID/api/webhooks/stripe

# Send test event
curl -X POST http://localhost:3000/api/stripe/webhook \
  -H "stripe-signature: test_signature" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_123",
        "subscription": "sub_test_123",
        "metadata": {"userId": "user-id"}
      }
    }
  }'
```

## Performance Testing

```bash
# Load test with Apache Bench
ab -n 100 -c 10 http://localhost:3000/api/health

# Monitor memory usage
node --max-old-space-size=2048 server.js
```

## Browser DevTools Testing

1. **Network Tab:**
   - Check all API calls succeed
   - Verify no 401/403 errors
   - Check load times

2. **Console Tab:**
   - No JavaScript errors
   - No CORS errors
   - Clean logs

3. **Application Tab:**
   - Check localStorage token saved
   - Verify cookies set

4. **Performance Tab:**
   - Measure load time
   - Check Core Web Vitals

## Database Testing

```bash
# Connect to local DB
psql leadforce

# Check tables created
\dt

# Count users
SELECT COUNT(*) FROM users;

# Count conversations
SELECT COUNT(*) FROM conversations;

# Check last 5 conversations
SELECT * FROM conversations ORDER BY created_at DESC LIMIT 5;

# Verify scores calculated
SELECT * FROM scores ORDER BY created_at DESC LIMIT 5;
```

## Checklist Final

### Backend
- [ ] All endpoints respond 200
- [ ] Auth tokens work correctly
- [ ] Database queries run without errors
- [ ] Webhooks receive data properly
- [ ] Email notifications send
- [ ] Scheduled jobs run

### Frontend
- [ ] All pages load
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] API integration works
- [ ] No console errors
- [ ] Responsive design works

### Integration
- [ ] Gmail OAuth flow works
- [ ] WhatsApp API integration works
- [ ] Stripe checkout completes
- [ ] Trial activation works
- [ ] Subscription renewal works

### User Flow
- [ ] Complete signup → login → onboarding
- [ ] Trial period shows correctly
- [ ] Checkout works end-to-end
- [ ] Dashboard displays leads
- [ ] Reports generate correctly
