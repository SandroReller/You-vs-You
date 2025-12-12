import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { CalorieTracker } from './components/CalorieTracker';
import { HabitTracker } from './components/HabitTracker';
import { GameSpace } from './components/GameSpace';
import { Navigation } from './components/Navigation';
import { Login } from './components/Login';
import { Account } from './components/Account';
import * as auth from './utils/auth';
import { setAccessToken } from './utils/api';
import type { AuthSession } from './utils/auth';

type Page = 'home' | 'calories' | 'habits' | 'games' | 'account';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string>();

  useEffect(() => {
    // Check for existing session on mount
    auth.getSession().then((existingSession) => {
      if (existingSession) {
        setSession(existingSession);
        setAccessToken(existingSession.accessToken);
      }
      setLoading(false);
    });

    // Listen to auth state changes
    const { data: { subscription } } = auth.onAuthStateChange((newSession) => {
      setSession(newSession);
      setAccessToken(newSession?.accessToken || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setAuthError(undefined);
    const { session: newSession, error } = await auth.signin(email, password);
    
    if (error) {
      setAuthError(error);
    } else if (newSession) {
      setSession(newSession);
      setAccessToken(newSession.accessToken);
    }
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    setAuthError(undefined);
    const { error } = await auth.signup(email, password, name);
    
    if (error) {
      setAuthError(error);
    } else {
      // After successful signup, auto-login
      await handleLogin(email, password);
    }
  };

  const handleLogout = async () => {
    await auth.signout();
    setSession(null);
    setAccessToken(null);
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl mb-4">
            <span className="text-2xl tracking-tight">You<span className="opacity-70">vs</span>You</span>
          </div>
          <p className="text-gray-600">Lädt...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!session) {
    return (
      <Login 
        onLogin={handleLogin} 
        onSignup={handleSignup} 
        error={authError}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'calories':
        return <CalorieTracker />;
      case 'habits':
        return <HabitTracker />;
      case 'games':
        return <GameSpace />;
      case 'account':
        return <Account user={session.user} onLogout={handleLogout} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pb-20">
        {renderPage()}
      </main>
    </div>
  );
}