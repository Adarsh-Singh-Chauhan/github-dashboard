import Stripe from 'stripe';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from './_core/trpc';
import { TRPCError } from '@trpc/server';
import { products, getPriceById } from './products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

/**
 * Stripe payment router
 * Handles checkout sessions, payment intents, and subscription management
 */
export const stripeRouter = router({
  /**
   * Create a checkout session for a product or subscription
   * Returns the checkout URL to redirect the user
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        priceId: z.string().describe('Stripe price ID'),
        successUrl: z.string().url().describe('URL to redirect after successful payment'),
        cancelUrl: z.string().url().describe('URL to redirect if user cancels'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const price = getPriceById(input.priceId);
      if (!price) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid price ID',
        });
      }

      try {
        const session = await stripe.checkout.sessions.create({
          mode: price.interval ? 'subscription' : 'payment',
          payment_method_types: ['card'],
          line_items: [
            {
              price: input.priceId,
              quantity: 1,
            },
          ],
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || '',
            customer_name: ctx.user.name || '',
          },
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          allow_promotion_codes: true,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error('[Stripe] Checkout session creation failed:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create checkout session',
        });
      }
    }),

  /**
   * Get all available products and prices
   * Public endpoint - no authentication required
   */
  getProducts: publicProcedure.query(async () => {
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      type: product.type,
      features: product.features || [],
      prices: product.prices.map((price) => ({
        id: price.id,
        amount: price.amount,
        currency: price.currency,
        interval: price.interval,
        displayAmount: price.displayAmount,
      })),
    }));
  }),

  /**
   * Get a specific product by ID
   */
  getProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => {
      const product = products.find((p) => p.id === input.productId);
      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        });
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        type: product.type,
        features: product.features || [],
        prices: product.prices.map((price) => ({
          id: price.id,
          amount: price.amount,
          currency: price.currency,
          interval: price.interval,
          displayAmount: price.displayAmount,
        })),
      };
    }),

  /**
   * Get user's payment history
   * Returns list of completed charges
   */
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Fetch charges for this user
      const charges = await stripe.charges.list({
        limit: 50,
      });

      // Filter charges by user metadata
      const userCharges = charges.data.filter(
        (charge: Stripe.Charge) => charge.metadata?.user_id === ctx.user.id.toString()
      );

      return {
        charges: userCharges.map((charge: Stripe.Charge) => ({
          id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          status: charge.status,
          created: new Date(charge.created * 1000),
          description: charge.description,
          receiptUrl: charge.receipt_url,
        })),
      };
    } catch (error) {
      console.error('[Stripe] Failed to fetch payment history:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch payment history',
      });
    }
  }),

  /**
   * Get subscription status for the current user
   */
  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Fetch subscriptions for this user
      const subscriptions = await stripe.subscriptions.list({
        limit: 10,
      });

      const userSubscriptions = subscriptions.data.filter(
        (sub: Stripe.Subscription) => sub.metadata?.user_id === ctx.user.id.toString()
      );

      const activeSubscription = userSubscriptions.find(
        (sub: Stripe.Subscription) => sub.status === 'active' || sub.status === 'trialing'
      );

      if (!activeSubscription) {
        return {
          hasActiveSubscription: false,
          subscription: null,
        };
      }

      return {
        hasActiveSubscription: true,
        subscription: {
          id: activeSubscription.id,
          status: activeSubscription.status,
          currentPeriodStart: new Date((activeSubscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((activeSubscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: (activeSubscription as any).cancel_at_period_end,
        },
      };
    } catch (error) {
      console.error('[Stripe] Failed to fetch subscription status:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch subscription status',
      });
    }
  }),

  /**
   * Cancel a subscription
   */
  cancelSubscription: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const subscription = await stripe.subscriptions.retrieve(input.subscriptionId);

        // Verify the subscription belongs to the current user
        if (subscription.metadata?.user_id !== ctx.user.id.toString()) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to cancel this subscription',
          });
        }

        const cancelled = await stripe.subscriptions.update(input.subscriptionId, {
          cancel_at_period_end: true,
        });

        return {
          success: true,
          subscription: {
            id: cancelled.id,
            status: cancelled.status,
          },
        };
      } catch (error) {
        console.error('[Stripe] Failed to cancel subscription:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to cancel subscription',
        });
      }
    }),
});
