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
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-slate-100 z-50 animate-slide-down">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center hover-grow">
                <Hotel className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">HotelAutoSite</span>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <a href="#features" className="text-slate-600 hover:text-emerald-600 font-medium hover-grow">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-emerald-600 font-medium hover-grow">Pricing</a>
              <a href="#faq" className="text-slate-600 hover:text-emerald-600 font-medium hover-grow">FAQ</a>
              <button
                onClick={onSignIn}
                className="text-slate-600 hover:text-emerald-600 font-medium hover-grow"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-600 font-medium premium-shadow hover-glow"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto animate-bounce-in">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-900 px-5 py-2.5 rounded-full mb-8 border border-emerald-200 animate-glow">
              <Sparkles className="h-4 w-4 text-emerald-600 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-sm font-semibold">Launch Your Hotel Website in 30 Seconds</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              Auto Website & Booking Engine for Hotels
            </h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              No coding required. No designer needed. Just fill in your details and get a professional hotel website with integrated booking system instantly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 text-lg font-semibold flex items-center justify-center premium-shadow-lg group hover-glow"
              >
                Create Your Website
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="border-2 border-slate-900 text-slate-900 px-8 py-4 rounded-lg hover:bg-slate-900 hover:text-white text-lg font-semibold hover-grow">
                View Demo
              </button>
            </div>
          </div>

          {/* Preview Mockup */}
          <div className="mt-20 relative animate-fade-in">
            <div className="bg-slate-50 rounded-2xl p-8 premium-shadow-xl border border-slate-200">
              <div className="bg-white rounded-xl premium-shadow-lg overflow-hidden border border-slate-200">
                <div className="bg-slate-50 px-4 py-3 flex items-center space-x-2 border-b border-slate-200">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 bg-slate-300 rounded-full"></div>
                    <div className="h-3 w-3 bg-slate-300 rounded-full"></div>
                    <div className="h-3 w-3 bg-slate-300 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center text-sm text-slate-500 font-medium">yourhotel.hotelsite.com</div>
                </div>
                <div className="h-96 bg-white flex items-center justify-center border-t border-slate-100">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Hotel className="h-12 w-12 text-white" />
                    </div>
                    <p className="text-slate-500 font-medium">Your Beautiful Hotel Website Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">Everything You Need to Succeed</h2>
            <p className="text-xl text-slate-600">Powerful features built for hotel owners</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Instant Website Generation',
                description: 'Fill in your hotel details and get a fully functional website in under 30 seconds. No technical skills required.'
              },
              {
                icon: CreditCard,
                title: 'Integrated Booking Engine',
                description: 'Accept direct bookings with built-in payment gateway. UPI, cards, and all major payment methods supported.'
              },
              {
                icon: Globe,
                title: 'Google Maps Integration',
                description: 'Automatically embed Google Maps with your hotel location. Guests can find you easily.'
              },
              {
                icon: BarChart3,
                title: 'Dashboard & Analytics',
                description: 'Track bookings, revenue, and guest reviews from a simple, powerful dashboard.'
              },
              {
                icon: Shield,
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security. Your data and payments are protected with industry standards.'
              },
              {
                icon: Sparkles,
                title: 'Beautiful Templates',
                description: 'Choose from professionally designed templates. Customize colors, fonts, and layouts instantly.'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl premium-shadow hover-lift border border-slate-100 group animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600">Choose the plan that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-2xl premium-shadow border-2 border-slate-200 hover:border-slate-300 hover-lift animate-slide-in-left">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
              <div className="mb-8">
                <span className="text-5xl font-bold text-slate-900">₹999</span>
                <span className="text-slate-600 ml-2">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['1 Hotel Website', 'Basic Templates', 'Booking Engine', 'UPI Payments'].map((item, idx) => (
                  <li key={idx} className="flex items-start group">
                    <ChevronRight className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 border-2 border-slate-900 text-slate-900 rounded-lg hover:bg-slate-50 transition font-semibold hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-slate-900 p-8 rounded-2xl premium-shadow-xl border-2 border-slate-900 relative transform md:scale-105 animate-scale-in hover-lift">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-5 py-1.5 rounded-full text-sm font-bold animate-pulse">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">₹1,999</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['3 Hotel Websites', 'Premium Templates', 'Advanced Analytics', 'All Payment Methods', 'Priority Support'].map((item, idx) => (
                  <li key={idx} className="flex items-start group">
                    <ChevronRight className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition font-semibold hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-2xl premium-shadow border-2 border-slate-200 hover:border-slate-300 hover-lift animate-slide-in-right">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <div className="mb-8">
                <span className="text-5xl font-bold text-slate-900">₹4,999</span>
                <span className="text-slate-600 ml-2">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited Websites', 'All Templates', 'Custom Branding', 'API Access', 'Dedicated Support'].map((item, idx) => (
                  <li key={idx} className="flex items-start group">
                    <ChevronRight className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 border-2 border-slate-900 text-slate-900 rounded-lg hover:bg-slate-50 transition font-semibold hover:scale-105">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
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
              <div key={idx} className="bg-white rounded-xl premium-shadow border border-slate-100 overflow-hidden hover-lift animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-slate-50 transition-all group"
                >
                  <span className="font-semibold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors">{faq.q}</span>
                  <ChevronRight className={`h-5 w-5 text-slate-400 group-hover:text-emerald-600 transform transition-all ${openFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-8 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center animate-slide-up">
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">Ready to Launch Your Hotel Website?</h2>
          <p className="text-xl text-slate-400 mb-12">Join thousands of hotels already using HotelAutoSite</p>
          <button
            onClick={onGetStarted}
            className="bg-white text-slate-900 px-8 py-4 rounded-lg hover:bg-slate-100 transition text-lg font-semibold inline-flex items-center premium-shadow-lg group hover:scale-105"
          >
            Get Started Now
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Hotel className="h-5 w-5 text-slate-900" />
                </div>
                <span className="text-xl font-bold text-white">HotelAutoSite</span>
              </div>
              <p className="text-sm leading-relaxed">Automatic website generation for hotels worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Templates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2024 HotelAutoSite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
