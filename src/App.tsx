import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import OnboardingWizard from './components/OnboardingWizard';
import SuccessPage from './components/SuccessPage';
import HotelDashboard from './components/HotelDashboard';
import AdminDashboard from './components/AdminDashboard';
import PublicHotelWebsite from './components/PublicHotelWebsite';
import GuestBookings from './components/GuestBookings';
import { supabase } from './lib/supabase';

type AppState = 'landing' | 'auth' | 'onboarding' | 'success' | 'dashboard' | 'admin' | 'public-hotel' | 'guest-bookings';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [appState, setAppState] = useState<AppState>('landing');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [hotelSlug, setHotelSlug] = useState('');
  const [hasHotel, setHasHotel] = useState(false);
  const [checkingHotel, setCheckingHotel] = useState(true);
  const [publicHotelSlug, setPublicHotelSlug] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    
    // Public routes - no auth check needed
    if (path.startsWith('/hotel/')) {
      const slug = path.replace('/hotel/', '');
      setPublicHotelSlug(slug);
      setAppState('public-hotel');
      setCheckingHotel(false);
      return;
    }

    if (path === '/my-bookings') {
      setAppState('guest-bookings');
      setCheckingHotel(false);
      return;
    }

    // Admin route
    if (path === '/admin') {
      setAppState('admin');
      setCheckingHotel(false);
      return;
    }

    // Wait for auth to load
    if (authLoading) {
      return;
    }

    // No user - show landing
    if (!user) {
      setAppState('landing');
      setCheckingHotel(false);
      return;
    }

    // User exists - check hotel
    checkUserHotel();
  }, [user, authLoading]);

  const checkUserHotel = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('hotels')
      .select('slug')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setHasHotel(true);
      setHotelSlug(data.slug);
      setAppState('dashboard');
    } else {
      setHasHotel(false);
      setAppState('onboarding');
    }
    setCheckingHotel(false);
  };

  const handleGetStarted = () => {
    if (user && !hasHotel) {
      setAppState('onboarding');
    } else if (user && hasHotel) {
      setAppState('dashboard');
    } else {
      setAuthMode('signup');
      setAppState('auth');
    }
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setAppState('auth');
  };

  const handleAuthSuccess = () => {
    setAppState('onboarding');
  };

  const handleOnboardingComplete = (slug: string) => {
    setHotelSlug(slug);
    setHasHotel(true);
    setAppState('success');
  };

  const handleGoToDashboard = () => {
    setAppState('dashboard');
  };

  if (authLoading || checkingHotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (appState === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} onSignIn={handleSignIn} />;
  }

  if (appState === 'auth') {
    return (
      <AuthPage
        onBack={() => setAppState('landing')}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    );
  }

  if (appState === 'onboarding' && user && !hasHotel) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  if (appState === 'success') {
    return <SuccessPage hotelSlug={hotelSlug} onGoToDashboard={handleGoToDashboard} />;
  }

  if (appState === 'dashboard' && user && hasHotel) {
    return <HotelDashboard />;
  }

  if (appState === 'public-hotel' && publicHotelSlug) {
    return <PublicHotelWebsite hotelSlug={publicHotelSlug} />;
  }

  if (appState === 'admin') {
    return <AdminDashboard />;
  }

  if (appState === 'guest-bookings') {
    return <GuestBookings />;
  }

  return <LandingPage onGetStarted={handleGetStarted} onSignIn={handleSignIn} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
