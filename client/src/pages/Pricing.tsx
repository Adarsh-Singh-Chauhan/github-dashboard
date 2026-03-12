import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Zap } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';

/**
 * Pricing Page
 * Displays available products and subscription plans with Stripe integration
 */
export default function Pricing() {
  const { user } = useAuth();
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'month' | 'year'>('month');
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  // Fetch products
  const { data: products, isLoading } = trpc.stripe.getProducts.useQuery();

  // Create checkout session mutation
  const createCheckout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.success('Redirecting to checkout...');
        window.open(data.url, '_blank');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create checkout session');
    },
  });

  const handleCheckout = (priceId: string) => {
    if (!user) {
      toast.error('Please log in to continue');
      return;
    }

    setLoadingPriceId(priceId);
    const origin = window.location.origin;

    createCheckout.mutate({
      priceId,
      successUrl: `${origin}/checkout-success`,
      cancelUrl: `${origin}/pricing`,
    });

    setLoadingPriceId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-16">
      {/* Header */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the perfect plan for your GitHub analytics needs
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1">
            <button
              onClick={() => setSelectedBillingCycle('month')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedBillingCycle === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedBillingCycle('year')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedBillingCycle === 'year'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products?.map((product, index) => {
            // Get the price for the selected billing cycle
            const price = product.prices.find((p) =>
              selectedBillingCycle === 'month'
                ? p.interval === 'month' || !p.interval
                : p.interval === 'year'
            );

            if (!price) return null;

            const isPopular = index === 1; // Make the middle plan (Premium) popular

            return (
              <div
                key={product.id}
                className={`relative transition-transform duration-300 ${
                  isPopular ? 'md:scale-105' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <Card
                  className={`h-full backdrop-blur-md border transition-all duration-300 overflow-hidden flex flex-col ${
                    isPopular
                      ? 'bg-gradient-to-br from-indigo-50 to-cyan-50 border-indigo-300 shadow-2xl'
                      : 'bg-white/80 border-white/20 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="p-8 flex flex-col h-full">
                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-slate-900">
                          ${(price.amount / 100).toFixed(2)}
                        </span>
                        {price.interval && (
                          <span className="text-slate-600">/{price.interval}</span>
                        )}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleCheckout(price.id)}
                      disabled={loadingPriceId === price.id || createCheckout.isPending}
                      className={`w-full mb-8 font-semibold py-2 ${
                        isPopular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                      }`}
                    >
                      {loadingPriceId === price.id ? 'Processing...' : 'Get Started'}
                    </Button>

                    {/* Features */}
                    <div className="space-y-4 flex-1">
                      <p className="text-sm font-semibold text-slate-900 mb-4">
                        What's included:
                      </p>
                      {product.features?.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 mt-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Can I change my plan anytime?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 30-day money-back guarantee on all subscriptions. Contact support for details.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, American Express) through Stripe.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, all subscription plans come with a 14-day free trial. No credit card required to start.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="container mx-auto px-4 mt-20">
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-indigo-100 mb-8">
            Join thousands of developers using GitHub Dashboard for better insights
          </p>
          <Button className="bg-white text-indigo-600 hover:bg-slate-100 font-semibold px-8 py-3">
            Start Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
}
