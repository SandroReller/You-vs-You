import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, name: string) => Promise<void>;
  error?: string;
}

interface PasswordCriteria {
  label: string;
  test: (password: string) => boolean;
}

const passwordCriteria: PasswordCriteria[] = [
  { label: 'Mindestens 8 Zeichen', test: (p) => p.length >= 8 },
  { label: 'Mindestens ein Großbuchstabe', test: (p) => /[A-Z]/.test(p) },
  { label: 'Mindestens ein Kleinbuchstabe', test: (p) => /[a-z]/.test(p) },
  { label: 'Mindestens eine Zahl', test: (p) => /[0-9]/.test(p) },
  { label: 'Mindestens ein Sonderzeichen', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

function calculatePasswordStrength(password: string): {
  strength: number;
  color: string;
  label: string;
} {
  if (!password) {
    return { strength: 0, color: 'bg-gray-200', label: '' };
  }

  const metCriteria = passwordCriteria.filter(c => c.test(password)).length;
  const percentage = (metCriteria / passwordCriteria.length) * 100;

  if (percentage === 100) {
    return { strength: 100, color: 'bg-green-500', label: 'Sehr stark' };
  } else if (percentage >= 80) {
    return { strength: percentage, color: 'bg-lime-500', label: 'Stark' };
  } else if (percentage >= 60) {
    return { strength: percentage, color: 'bg-yellow-500', label: 'Mittel' };
  } else if (percentage >= 40) {
    return { strength: percentage, color: 'bg-orange-500', label: 'Schwach' };
  } else {
    return { strength: percentage, color: 'bg-red-500', label: 'Sehr schwach' };
  }
}

export function Login({ onLogin, onSignup, error }: LoginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = calculatePasswordStrength(password);
  const isPasswordValid = passwordCriteria.every(c => c.test(password));
  const unmetCriteria = passwordCriteria.filter(c => !c.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup && !isPasswordValid) return;

    setLoading(true);

    try {
      if (isSignup) {
        await onSignup(email, password, name);
      } else {
        await onLogin(email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl mb-4">
            <span className="text-2xl tracking-tight">You<span className="opacity-70">vs</span>You</span>
          </div>
          <h1 className="text-gray-800 mb-2">
            {isSignup ? 'Account erstellen' : 'Willkommen zurück'}
          </h1>
          <p className="text-gray-600">
            {isSignup 
              ? 'Starte deine Self-Improvement Journey' 
              : 'Melde dich an, um fortzufahren'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="name"
                  type="text"
                  placeholder="Dein Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email">E-Mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="email"
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Passwort</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isSignup ? 8 : 6}
                className="pl-10"
              />
            </div>

            {/* Password Strength Indicator */}
            {isSignup && (
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Passwort-Stärke</span>
                    <span
                      className={`text-sm font-medium ${
                        passwordStrength.strength === 100
                          ? 'text-green-600'
                          : passwordStrength.strength >= 80
                          ? 'text-lime-600'
                          : passwordStrength.strength >= 60
                          ? 'text-yellow-600'
                          : passwordStrength.strength >= 40
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.strength === 100
                          ? 'bg-green-500'
                          : passwordStrength.strength >= 80
                          ? 'bg-lime-500'
                          : passwordStrength.strength >= 60
                          ? 'bg-yellow-500'
                          : passwordStrength.strength >= 40
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>

                {/* Unmet Criteria */}
                {unmetCriteria.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <p className="text-sm text-gray-700">Noch benötigt:</p>
                    {unmetCriteria.map((criterion, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <X size={16} className="text-red-500 flex-shrink-0" />
                        <span>{criterion.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* All Criteria Met */}
                {isPasswordValid && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-sm text-green-700">
                      <Check size={16} className="text-green-600 flex-shrink-0" />
                      <span>Alle Anforderungen erfüllt!</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || (isSignup && !isPasswordValid)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Lädt...'
            ) : isSignup ? (
              <>
                <UserPlus size={20} className="mr-2" />
                Registrieren
              </>
            ) : (
              <>
                <LogIn size={20} className="mr-2" />
                Anmelden
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-purple-600 hover:text-purple-700 transition-colors"
          >
            {isSignup 
              ? 'Bereits ein Account? Jetzt anmelden' 
              : 'Noch kein Account? Jetzt registrieren'}
          </button>
        </div>
      </Card>
    </div>
  );
}
