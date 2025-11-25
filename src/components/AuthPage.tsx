import { useState } from 'react';
import { Hotel, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AuthPageProps = {
  onBack: () => void;
  onSuccess: () => void;
  initialMode?: 'signin' | 'signup';
};

export default function AuthPage({ onBack, onSuccess, initialMode = 'signup' }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          onSuccess();
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onSuccess();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md animate-slide-up">
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-slate-600 hover:text-slate-900 transition font-medium group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="bg-white rounded-2xl premium-shadow-xl p-10 border border-slate-100 hover-lift">
          <div className="flex items-center justify-center space-x-3 mb-8 animate-scale-in">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <Hotel className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-slate-900 tracking-tight">HotelAutoSite</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 text-center mb-3 tracking-tight">
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-600 text-center mb-10">
            {mode === 'signup'
              ? 'Start building your hotel website in seconds'
              : 'Sign in to manage your hotel website'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition bg-white text-slate-900 placeholder-slate-400 hover:border-slate-300"
                  placeholder="hotel@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition bg-white text-slate-900 placeholder-slate-400 hover:border-slate-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition bg-white text-slate-900 placeholder-slate-400 hover:border-slate-300"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-lg hover:bg-slate-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed premium-shadow mt-6 hover:scale-105"
            >
              {loading
                ? 'Please wait...'
                : mode === 'signup'
                  ? 'Create Account'
                  : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              {mode === 'signup'
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
