import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { useState } from 'react';

export function PricingPage() {
  const { subscription, setSubscription } = useAuthStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (plan: 'free' | 'premium') => {
    // Placeholder for payment integration (e.g., Stripe)
    setSubscription(plan);
  };

  const plans = {
    free: {
      title: 'Free Plan',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Access to free courses',
        'Basic course materials',
        'Community support',
      ],
    },
    premium: {
      title: 'Premium Plan',
      monthlyPrice: 29.99,
      yearlyPrice: 299.88, // ~$24.99/month if paid yearly (16% discount)
      features: [
        'Unlimited access to all courses',
        'Premium course materials',
        'Priority support',
        'Course completion certificates',
        'Downloadable resources',
        'Exclusive webinars',
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Find the Perfect Plan for Your Learning Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock your potential with flexible pricing options designed for every learner.
          </p>
          {/* Billing Toggle */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex bg-gray-200 rounded-full p-1">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly <span className="ml-1 text-xs bg-green-100 text-green-700 px-1 rounded">Save 16%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{plans.free.title}</h3>
            <p className="text-4xl font-extrabold text-gray-900 mb-6">
              ${billingCycle === 'monthly' ? plans.free.monthlyPrice : plans.free.yearlyPrice}
              <span className="text-base font-normal text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
            </p>
            <ul className="space-y-4 mb-8">
              {plans.free.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full rounded-full py-3 text-lg font-semibold border-gray-300 hover:bg-gray-100"
              onClick={() => handleSubscribe('free')}
              disabled={subscription === 'free'}
            >
              {subscription === 'free' ? 'Current Plan' : 'Start for Free'}
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-500 relative overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-bl-lg">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{plans.premium.title}</h3>
            <p className="text-4xl font-extrabold text-gray-900 mb-6">
              ${billingCycle === 'monthly' ? plans.premium.monthlyPrice : plans.premium.yearlyPrice}
              <span className="text-base font-normal text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
            </p>
            <ul className="space-y-4 mb-8">
              {plans.premium.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full rounded-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleSubscribe('premium')}
              disabled={subscription === 'premium'}
            >
              {subscription === 'premium' ? 'Current Plan' : 'Upgrade Now'}
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: 'What’s included in the Free Plan?',
                answer: 'The Free Plan gives you access to a selection of free courses, basic materials, and community support.',
              },
              {
                question: 'Can I switch plans later?',
                answer: 'Yes! You can upgrade or downgrade your plan at any time from your account settings.',
              },
              {
                question: 'Is there a refund policy?',
                answer: 'We offer a 30-day money-back guarantee for the Premium Plan if you’re not satisfied.',
              },
              {
                question: 'How do certificates work?',
                answer: 'Upon completing a Premium course, you’ll receive a downloadable certificate to showcase your skills.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-gray-800 font-semibold">
                    {faq.question}
                    <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 py-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Skills?</h2>
          <p className="text-lg mb-6 max-w-xl mx-auto">
            Join thousands of learners and start mastering in-demand skills today.
          </p>
          <Button
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            onClick={() => handleSubscribe('premium')}
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}