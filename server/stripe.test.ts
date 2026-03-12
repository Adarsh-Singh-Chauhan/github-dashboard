import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

type AuthenticatedUser = NonNullable<TrpcContext['user']>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: 'test-user',
    email: 'test@example.com',
    name: 'Test User',
    loginMethod: 'manus',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext['res'],
  };

  return ctx;
}

describe('Stripe Router', () => {
  describe('stripe.getProducts', () => {
    it('should return all available products', async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const products = await caller.stripe.getProducts();

      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);

      // Check product structure
      const product = products[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('type');
      expect(product).toHaveProperty('prices');
      expect(product).toHaveProperty('features');
    });

    it('should return products with valid price information', async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const products = await caller.stripe.getProducts();

      products.forEach((product) => {
        expect(product.prices.length).toBeGreaterThan(0);

        product.prices.forEach((price) => {
          expect(price).toHaveProperty('id');
          expect(price).toHaveProperty('amount');
          expect(price).toHaveProperty('currency');
          expect(price).toHaveProperty('displayAmount');
          expect(typeof price.amount).toBe('number');
          expect(price.amount).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('stripe.getProduct', () => {
    it('should return a specific product by ID', async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // First get all products to get a valid ID
      const products = await caller.stripe.getProducts();
      const productId = products[0].id;

      const product = await caller.stripe.getProduct({ productId });

      expect(product).toBeDefined();
      expect(product.id).toBe(productId);
      expect(product.name).toBeDefined();
      expect(product.description).toBeDefined();
    });

    it('should throw error for invalid product ID', async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.stripe.getProduct({ productId: 'invalid_product_id' });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('NOT_FOUND');
        expect(error.message).toContain('Product not found');
      }
    });
  });

  describe('stripe.getPaymentHistory', () => {
    it('should require authentication', async () => {
      const ctx = createAuthContext();
      ctx.user = null;

      const caller = appRouter.createCaller(ctx);

      try {
        await caller.stripe.getPaymentHistory();
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });

    it('should return payment history for authenticated user', async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const history = await caller.stripe.getPaymentHistory();

      expect(history).toBeDefined();
      expect(history).toHaveProperty('charges');
      expect(Array.isArray(history.charges)).toBe(true);
    });
  });

  describe('stripe.getSubscriptionStatus', () => {
    it('should require authentication', async () => {
      const ctx = createAuthContext();
      ctx.user = null;

      const caller = appRouter.createCaller(ctx);

      try {
        await caller.stripe.getSubscriptionStatus();
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });

    it('should return subscription status for authenticated user', async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const status = await caller.stripe.getSubscriptionStatus();

      expect(status).toBeDefined();
      expect(status).toHaveProperty('hasActiveSubscription');
      expect(typeof status.hasActiveSubscription).toBe('boolean');

      if (status.hasActiveSubscription && status.subscription) {
        expect(status.subscription).toHaveProperty('id');
        expect(status.subscription).toHaveProperty('status');
        expect(status.subscription).toHaveProperty('currentPeriodStart');
        expect(status.subscription).toHaveProperty('currentPeriodEnd');
      }
    });
  });

  describe('stripe.createCheckoutSession', () => {
    it('should require authentication', async () => {
      const ctx = createAuthContext();
      ctx.user = null;

      const caller = appRouter.createCaller(ctx);

      try {
        await caller.stripe.createCheckoutSession({
          priceId: 'price_test',
          successUrl: 'https://example.com/success',
          cancelUrl: 'https://example.com/cancel',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });

    it('should throw error for invalid price ID', async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.stripe.createCheckoutSession({
          priceId: 'invalid_price_id',
          successUrl: 'https://example.com/success',
          cancelUrl: 'https://example.com/cancel',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('BAD_REQUEST');
        expect(error.message).toContain('Invalid price ID');
      }
    });
  });

  describe('stripe.cancelSubscription', () => {
    it('should require authentication', async () => {
      const ctx = createAuthContext();
      ctx.user = null;

      const caller = appRouter.createCaller(ctx);

      try {
        await caller.stripe.cancelSubscription({
          subscriptionId: 'sub_test',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });
  });
});
