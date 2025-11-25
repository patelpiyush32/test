import { CheckCircle2, ExternalLink, Copy, QrCode, Edit, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { getHotelWebsiteUrl } from '../lib/config';

type SuccessPageProps = {
  hotelSlug: string;
  onGoToDashboard: () => void;
};

export default function SuccessPage({ hotelSlug, onGoToDashboard }: SuccessPageProps) {
  const [copied, setCopied] = useState(false);
  const websiteUrl = getHotelWebsiteUrl(hotelSlug);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-3xl w-full animate-slide-up">
        {/* Success Icon & Header */}
        <div className="text-center mb-10 animate-scale-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-600 rounded-2xl mb-8 premium-shadow-xl animate-pulse">
            <CheckCircle2 className="h-14 w-14 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Your Website is Ready!
          </h1>
          <p className="text-xl text-slate-600">
            Congratulations! Your hotel website is now live and ready to accept bookings.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl premium-shadow-xl p-10 mb-6 border border-slate-100 hover-lift">
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-900 mb-3">
              Your Website URL
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-emerald-50 border-2 border-emerald-200 rounded-lg px-5 py-4 font-mono text-emerald-700 font-semibold hover:border-emerald-300 transition-colors">
                {websiteUrl}
              </div>
              <button
                onClick={copyToClipboard}
                className="px-5 py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center font-semibold premium-shadow whitespace-nowrap hover:scale-105"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 px-5 py-4 border-2 border-slate-900 text-slate-900 rounded-lg hover:bg-slate-50 transition font-semibold hover:scale-105 group"
            >
              <ExternalLink className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>View Website</span>
            </a>
            <button className="flex items-center justify-center space-x-2 px-5 py-4 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-semibold hover:scale-105 group">
              <QrCode className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Download QR</span>
            </button>
            <button
              onClick={onGoToDashboard}
              className="flex items-center justify-center space-x-2 px-5 py-4 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-semibold hover:scale-105 group"
            >
              <Edit className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Edit Website</span>
            </button>
          </div>

          {/* Next Steps */}
          <div className="border-t border-slate-100 pt-8">
            <h3 className="font-bold text-slate-900 mb-6 text-lg">Next Steps:</h3>
            <div className="space-y-5">
              {[
                {
                  step: '1',
                  title: 'Share Your Website',
                  description: 'Share the URL on social media, WhatsApp, and Google My Business'
                },
                {
                  step: '2',
                  title: 'Add to Google Maps',
                  description: 'Link your website in your Google My Business profile for more visibility'
                },
                {
                  step: '3',
                  title: 'Customize Your Site',
                  description: 'Use the dashboard to update photos, prices, and customize colors'
                }
              ].map((item) => (
                <div key={item.step} className="flex items-start group">
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-4 mt-0.5 group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-1">{item.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Button */}
        <div className="text-center mb-8">
          <button
            onClick={onGoToDashboard}
            className="bg-slate-900 text-white px-10 py-4 rounded-lg hover:bg-slate-800 transition text-lg font-bold inline-flex items-center premium-shadow-lg group hover:scale-105"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white text-center premium-shadow-xl hover-lift">
          <p className="text-lg font-bold mb-2">Need Help?</p>
          <p className="text-slate-400 mb-6">Watch our quick tutorial or contact support</p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition font-semibold hover:scale-105">
              Watch Tutorial
            </button>
            <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-slate-800 transition font-semibold hover:scale-105">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
