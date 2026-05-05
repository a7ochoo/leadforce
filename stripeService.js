const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Stripe checkout session
async function createCheckoutSession(userId, email, plan) {
  try {
    const prices = {
      'agent': 'price_agent_monthly', // 49€/mois
      'admin': 'price_admin_monthly', // 1€/mois
      'agence': 'price_agence_monthly' // 199€/mois
    };

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: prices[plan] || prices.agent,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/cancel`,
      metadata: {
        userId: userId,
        plan: plan,
      },
    });

    return session;
  } catch (err) {
    console.error('Stripe checkout error:', err);
    throw err;
  }
}

// Handle Stripe webhook
async function handleStripeWebhook(event) {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // Payment successful
        const session = event.data.object;
        console.log('Payment completed:', session);
        // TODO: Activate user subscription in DB
        return { success: true, action: 'activate' };

      case 'customer.subscription.updated':
        // Subscription updated
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription);
        return { success: true, action: 'update' };

      case 'customer.subscription.deleted':
        // Subscription cancelled
        const cancelledSub = event.data.object;
        console.log('Subscription cancelled:', cancelledSub);
        // TODO: Deactivate user access in DB
        return { success: true, action: 'deactivate' };

      case 'invoice.payment_succeeded':
        // Recurring payment successful
        const invoice = event.data.object;
        console.log('Invoice paid:', invoice);
        return { success: true, action: 'payment_received' };

      case 'invoice.payment_failed':
        // Payment failed
        const failedInvoice = event.data.object;
        console.log('Invoice payment failed:', failedInvoice);
        // TODO: Notify user about failed payment
        return { success: true, action: 'payment_failed' };

      default:
        console.log(`Unhandled event type: ${event.type}`);
        return { success: false };
    }
  } catch (err) {
    console.error('Stripe webhook error:', err);
    throw err;
  }
}

// Get customer portal session
async function createCustomerPortalSession(customerId) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL}/dashboard`,
    });

    return session;
  } catch (err) {
    console.error('Customer portal error:', err);
    throw err;
  }
}

// Get subscription details
async function getSubscriptionDetails(customerId) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return null;
    }

    return subscriptions.data[0];
  } catch (err) {
    console.error('Get subscription error:', err);
    throw err;
  }
}

// Create price objects (run once in Stripe dashboard or via this)
async function createPrices() {
  try {
    // Agent - 49€/month
    const agentPrice = await stripe.prices.create({
      currency: 'eur',
      unit_amount: 4900, // 49€ in cents
      recurring: { interval: 'month' },
      product_data: {
        name: 'LeadForce Agent',
        description: 'Single agent qualification',
      },
    });

    // Admin - 1€/month
    const adminPrice = await stripe.prices.create({
      currency: 'eur',
      unit_amount: 100, // 1€ in cents
      recurring: { interval: 'month' },
      product_data: {
        name: 'LeadForce Admin',
        description: 'Admin account',
      },
    });

    // Agence - 199€/month for 5 agents
    const agencePrice = await stripe.prices.create({
      currency: 'eur',
      unit_amount: 19900, // 199€ in cents
      recurring: { interval: 'month' },
      product_data: {
        name: 'LeadForce Agence',
        description: 'Agency plan (5 agents included)',
      },
    });

    console.log('Prices created:');
    console.log('Agent:', agentPrice.id);
    console.log('Admin:', adminPrice.id);
    console.log('Agence:', agencePrice.id);

    return {
      agent: agentPrice.id,
      admin: adminPrice.id,
      agence: agencePrice.id,
    };
  } catch (err) {
    console.error('Create prices error:', err);
    throw err;
  }
}

module.exports = {
  createCheckoutSession,
  handleStripeWebhook,
  createCustomerPortalSession,
  getSubscriptionDetails,
  createPrices,
};
