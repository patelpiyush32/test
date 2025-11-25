import { Hotel, Sparkles, Zap, Shield, Globe, CreditCard, BarChart3, ChevronRight } from 'lucide-react';
import { useState } from 'react';

type LandingPageProps = {
  onGetStarted: () => void;
  onSignIn: () => void;
};

export default function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Hotel className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">HotelAutoSite</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition">Pricing</a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition">FAQ</a>
              <button
                onClick={onSignIn}
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Launch Your Hotel Website in 30 Seconds</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Auto Website & Booking Engine for Hotels
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              No coding required. No designer needed. Just fill in your details and get a professional hotel website with integrated booking system instantly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-lg font-semibold flex items-center justify-center"
              >
                Create Your Website
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition text-lg font-semibold">
                View Demo
              </button>
            </div>
          </div>
          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl p-8 shadow-xl">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                    <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                    <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center text-sm text-gray-600">yourhotel.hotelsite.com</div>
                </div>
                <div className="h-96 bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <Hotel className="h-24 w-24 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500">Your Beautiful Hotel Website Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600">Powerful features built for hotel owners</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Website Generation</h3>
              <p className="text-gray-600">Fill in your hotel details and get a fully functional website in under 30 seconds. No technical skills required.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <CreditCard className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Integrated Booking Engine</h3>
              <p className="text-gray-600">Accept direct bookings with built-in payment gateway. UPI, cards, and all major payment methods supported.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Google Maps Integration</h3>
              <p className="text-gray-600">Automatically embed Google Maps with your hotel location. Guests can find you easily.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dashboard & Analytics</h3>
              <p className="text-gray-600">Track bookings, revenue, and guest reviews from a simple, powerful dashboard.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security. Your data and payments are protected with industry standards.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Beautiful Templates</h3>
              <p className="text-gray-600">Choose from professionally designed templates. Customize colors, fonts, and layouts instantly.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹999</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">1 Hotel Website</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Basic Templates</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Booking Engine</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">UPI Payments</span>
                </li>
              </ul>
              <button className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold">
                Get Started
              </button>
            </div>
            <div className="bg-blue-600 p-8 rounded-xl shadow-lg border-2 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">₹1,999</span>
                <span className="text-blue-100">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-white">3 Hotel Websites</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Premium Templates</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Advanced Analytics</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-white">All Payment Methods</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Priority Support</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition font-semibold">
                Get Started
              </button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹4,999</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Unlimited Websites</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">All Templates</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Custom Branding</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">API Access</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Dedicated Support</span>
                </li>
              </ul>
              <button className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'How quickly can I get my website live?',
                a: 'Your website can be live in under 30 seconds. Simply fill in your hotel details, upload photos, and choose a template. The system automatically generates your website instantly.'
              },
              {
                q: 'Do I need technical knowledge?',
                a: 'No technical knowledge required. Our platform is designed for hotel owners with no coding experience. Everything is point-and-click simple.'
              },
              {
                q: 'Can I accept payments directly?',
                a: 'Yes, we provide integrated payment processing. Accept UPI, credit cards, debit cards, and all major payment methods. Payments go directly to your account.'
              },
              {
                q: 'Can I customize my website?',
                a: 'Absolutely! You can customize colors, fonts, photos, room details, pricing, and more. Changes update instantly on your live website.'
              },
              {
                q: 'Is there a commission on bookings?',
                a: 'No commission! You only pay the monthly subscription fee. All booking revenue is 100% yours.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronRight className={`h-5 w-5 text-gray-400 transform transition ${openFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Launch Your Hotel Website?</h2>
          <p className="text-xl text-blue-100 mb-10">Join thousands of hotels already using HotelAutoSite</p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition text-lg font-semibold inline-flex items-center"
          >
            Get Started Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Hotel className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-white">HotelAutoSite</span>
              </div>
              <p className="text-sm">Automatic website generation for hotels worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Templates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 HotelAutoSite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
