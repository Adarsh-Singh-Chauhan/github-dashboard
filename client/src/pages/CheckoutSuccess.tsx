import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';

/**
 * Checkout Success Page
 * Displays after a successful payment
 */
export default function CheckoutSuccess() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Auto-redirect to home after 5 seconds
    const timer = setTimeout(() => {
      setLocation('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto backdrop-blur-md bg-white/80 border border-white/20 shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-20"></div>
                <CheckCircle className="w-16 h-16 text-green-500 relative z-10" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Payment Successful!
            </h1>
            <p className="text-slate-600 mb-8">
              Thank you for your purchase. Your account has been upgraded with the new features.
            </p>

            {/* Details */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-8 border border-green-200">
              <p className="text-sm text-slate-600 mb-2">
                A confirmation email has been sent to your email address.
              </p>
              <p className="text-sm text-slate-600">
                You can now access all premium features immediately.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => setLocation('/')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Return to Dashboard
              </Button>
              <Button
                onClick={() => setLocation('/pricing')}
                variant="outline"
                className="w-full"
              >
                View All Plans
              </Button>
            </div>

            {/* Auto-redirect notice */}
            <p className="text-xs text-slate-500 mt-6">
              Redirecting to dashboard in 5 seconds...
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
