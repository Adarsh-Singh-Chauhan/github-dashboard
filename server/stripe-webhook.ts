import Stripe from 'stripe';
import { Request, Response } from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * Stripe Webhook Handler
 * Processes Stripe events like successful payments, subscription changes, etc.
 * 
 * This handler should be registered at POST /api/stripe/webhook
 * with express.raw({ type: 'application/json' }) middleware
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    console.warn('[Stripe Webhook] Missing signature header');
    return res.status(400).json({ error: 'Missing signature' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error('[Stripe Webhook] Signature verification failed:', error);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  // Handle test events for webhook testing
  if (event.id.startsWith('evt_test_')) {
    console.log('[Stripe Webhook] Test event detected:', event.type);
    return res.json({ verified: true });
  }

  try {
    // Route events to appropriate handlers
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log('[Stripe Webhook] Unhandled event type:', event.type);
    }

    // Acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error processing event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handle successful checkout session
 * This event fires when a customer completes a payment
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('[Stripe Webhook] Checkout session completed:', {
    sessionId: session.id,
    customerId: session.customer,
    clientReferenceId: session.client_reference_id,
    paymentStatus: session.payment_status,
  });

  // TODO: Update user's subscription status in database
  // const userId = session.metadata?.user_id;
  // if (userId) {
  //   await db.updateUserSubscription(userId, {
  //     stripeSessionId: session.id,
  //     stripeCustomerId: session.customer as string,
  //     status: 'active',
  //   });
  // }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('[Stripe Webhook] Payment intent succeeded:', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    metadata: paymentIntent.metadata,
  });

  // TODO: Log payment in database for audit trail
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('[Stripe Webhook] Subscription created:', {
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    status: subscription.status,
    metadata: subscription.metadata,
  });

  // TODO: Store subscription details in database
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('[Stripe Webhook] Subscription updated:', {
    subscriptionId: subscription.id,
    status: subscription.status,
    cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
  });

  // TODO: Update subscription status in database
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('[Stripe Webhook] Subscription deleted:', {
    subscriptionId: subscription.id,
    customerId: subscription.customer,
  });

  // TODO: Mark subscription as cancelled in database
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('[Stripe Webhook] Invoice paid:', {
    invoiceId: invoice.id,
    customerId: invoice.customer,
    amount: invoice.amount_paid,
    currency: invoice.currency,
  });

  // TODO: Log invoice payment in database
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('[Stripe Webhook] Invoice payment failed:', {
    invoiceId: invoice.id,
    customerId: invoice.customer,
    attemptCount: invoice.attempt_count,
  });

  // TODO: Notify user of failed payment
  // TODO: Update subscription status if necessary
}
