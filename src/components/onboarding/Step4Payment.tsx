import { CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';

type Step4Props = {
  data: {
    upiId: string;
    paymentMethod: string;
  };
  onChange: (data: Partial<Step4Props['data']>) => void;
};

export default function Step4Payment({ data, onChange }: Step4Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Setup</h2>
        <p className="text-gray-600">Configure how you'll receive payments from bookings</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-green-800">
              <strong>0% Commission:</strong> Unlike OTAs, we don't charge any commission on bookings. You receive 100% of the payment directly to your account.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Choose Payment Method</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => onChange({ paymentMethod: 'upi' })}
            className={`p-6 rounded-lg border-2 transition text-left ${
              data.paymentMethod === 'upi'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-blue-600'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <Smartphone className="h-8 w-8 text-blue-600" />
              {data.paymentMethod === 'upi' && (
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">UPI Payment</h4>
            <p className="text-sm text-gray-600">
              Accept payments via UPI. Instant settlement, no processing fees.
            </p>
          </button>

          <button
            onClick={() => onChange({ paymentMethod: 'gateway' })}
            className={`p-6 rounded-lg border-2 transition text-left ${
              data.paymentMethod === 'gateway'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-blue-600'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <CreditCard className="h-8 w-8 text-blue-600" />
              {data.paymentMethod === 'gateway' && (
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Payment Gateway</h4>
            <p className="text-sm text-gray-600">
              Accept cards, UPI, wallets. Powered by Razorpay/Paytm.
            </p>
          </button>
        </div>
      </div>

      {data.paymentMethod === 'upi' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID *
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={data.upiId}
                onChange={(e) => onChange({ upiId: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="yourname@paytm"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Enter your UPI ID where you want to receive booking payments
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> When a customer books, they'll pay via UPI. The payment goes directly to your UPI ID. You'll receive instant WhatsApp/email notifications.
            </p>
          </div>
        </div>
      )}

      {data.paymentMethod === 'gateway' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-3">
              <strong>Payment Gateway Setup:</strong> You'll need to connect your Razorpay or Paytm account to accept online payments.
            </p>
            <p className="text-sm text-blue-800">
              Don't worry! We'll guide you through the complete setup process after your website is created. It takes only 5 minutes.
            </p>
          </div>

          <div className="border border-gray-300 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Supported Payment Methods:</h4>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                Credit/Debit Cards
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                UPI (All Apps)
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                Net Banking
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                Wallets (Paytm, etc.)
              </div>
            </div>
          </div>
        </div>
      )}

      {!data.paymentMethod && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Select a payment method to continue</p>
        </div>
      )}
    </div>
  );
}
