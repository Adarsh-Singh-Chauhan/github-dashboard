/**
 * Product and pricing configuration for Stripe integration
 * These products represent offerings available for purchase or subscription
 * Prices are in cents (e.g., 9900 = $99.00)
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  type: 'one-time' | 'subscription';
  prices: Price[];
  features?: string[];
  icon?: string;
}

export interface Price {
  id: string;
  amount: number; // in cents
  currency: string;
  interval?: 'month' | 'year'; // for subscriptions
  displayAmount: string;
}

/**
 * GitHub Dashboard Products
 * Includes one-time purchases and subscription tiers
 */
export const products: Product[] = [
  {
    id: 'product_github_pro',
    name: 'GitHub Pro Analysis',
    description: 'Advanced analytics and insights for your GitHub repositories',
    type: 'one-time',
    prices: [
      {
        id: 'price_github_pro_once',
        amount: 2999, // $29.99
        currency: 'usd',
        displayAmount: '$29.99',
      },
    ],
    features: [
      'Detailed repository analytics',
      'Contributor insights',
      'Commit history analysis',
      'Performance metrics',
      'Export reports',
    ],
  },
  {
    id: 'product_github_premium',
    name: 'GitHub Premium Subscription',
    description: 'Monthly subscription for continuous analytics and monitoring',
    type: 'subscription',
    prices: [
      {
        id: 'price_github_premium_month',
        amount: 999, // $9.99/month
        currency: 'usd',
        interval: 'month',
        displayAmount: '$9.99/month',
      },
      {
        id: 'price_github_premium_year',
        amount: 9999, // $99.99/year
        currency: 'usd',
        interval: 'year',
        displayAmount: '$99.99/year',
      },
    ],
    features: [
      'Real-time repository monitoring',
      'Weekly analytics reports',
      'Team collaboration tools',
      'Advanced filtering and search',
      'API access',
      'Priority support',
      'Custom dashboards',
    ],
  },
  {
    id: 'product_github_enterprise',
    name: 'GitHub Enterprise',
    description: 'Enterprise-grade analytics for large organizations',
    type: 'subscription',
    prices: [
      {
        id: 'price_github_enterprise_month',
        amount: 29999, // $299.99/month
        currency: 'usd',
        interval: 'month',
        displayAmount: '$299.99/month',
      },
      {
        id: 'price_github_enterprise_year',
        amount: 299999, // $2999.99/year
        currency: 'usd',
        interval: 'year',
        displayAmount: '$2999.99/year',
      },
    ],
    features: [
      'Everything in Premium',
      'Unlimited team members',
      'Advanced security analytics',
      'Compliance reporting',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'On-premise deployment option',
    ],
  },
];

/**
 * Get a product by ID
 */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/**
 * Get a price by ID
 */
export function getPriceById(id: string): Price | undefined {
  for (const product of products) {
    const price = product.prices.find((p) => p.id === id);
    if (price) return price;
  }
  return undefined;
}

/**
 * Get all subscription products
 */
export function getSubscriptionProducts(): Product[] {
  return products.filter((p) => p.type === 'subscription');
}

/**
 * Get all one-time purchase products
 */
export function getOneTimeProducts(): Product[] {
  return products.filter((p) => p.type === 'one-time');
}
