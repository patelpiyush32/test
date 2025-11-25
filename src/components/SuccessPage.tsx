import { CheckCircle2, ExternalLink, Copy, QrCode, Edit, ArrowRight } from 'lucide-react';
import { useState } from 'react';

type SuccessPageProps = {
  hotelSlug: string;
  onGoToDashboard: () => void;
};

export default function SuccessPage({ hotelSlug, onGoToDashboard }: SuccessPageProps) {
  const [copied, setCopied] = useState(false);
  const websiteUrl = `http://localhost:5173/hotel/${hotelSlug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Website is Ready!
          </h1>
          <p className="text-xl text-gray-600">
            Congratulations! Your hotel website is now live and ready to accept bookings.
          </p>    
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Website URL
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 font-mono text-blue-600">
                {websiteUrl}
              </div>
              <button
                onClick={copyToClipboard}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
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

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <a
              href={websiteUrl}
              className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              <ExternalLink className="h-5 w-5" />
              <span>View Website</span>
            </a>
            <button className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              <QrCode className="h-5 w-5" />
              <span>Download QR</span>
            </button>
            <button
              onClick={onGoToDashboard}
              className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Website</span>
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Next Steps:</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Share Your Website</p>
                  <p className="text-sm text-gray-600">Share the URL on social media, WhatsApp, and Google My Business</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add to Google Maps</p>
                  <p className="text-sm text-gray-600">Link your website in your Google My Business profile for more visibility</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Customize Your Site</p>
                  <p className="text-sm text-gray-600">Use the dashboard to update photos, prices, and customize colors</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onGoToDashboard}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-lg font-semibold inline-flex items-center"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white text-center">
          <p className="text-lg font-semibold mb-2">Need Help?</p>
          <p className="text-blue-100 mb-4">Watch our quick tutorial or contact support</p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium">
              Watch Tutorial
            </button>
            <button className="px-6 py-2 border-2 border-white text-white rounded-lg hover:bg-blue-800 transition font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
