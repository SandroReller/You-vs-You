import { LogOut, User as UserIcon, Mail, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { User } from '../utils/auth';

interface AccountProps {
  user: User;
  onLogout: () => void;
}

export function Account({ user, onLogout }: AccountProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-gray-800">Mein Account</h1>
        <p className="text-gray-600">Verwalte deine Kontoinformationen</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center">
                <UserIcon className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-gray-800">{user.name || 'Benutzer'}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-purple-600 mt-1" size={20} />
              <div>
                <p className="text-gray-700">E-Mail-Adresse</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <UserIcon className="text-purple-600 mt-1" size={20} />
              <div>
                <p className="text-gray-700">Name</p>
                <p className="text-gray-900">{user.name || 'Nicht angegeben'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="text-purple-600 mt-1" size={20} />
              <div>
                <p className="text-gray-700">Account-ID</p>
                <p className="text-gray-900 text-sm font-mono">{user.id.slice(0, 20)}...</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Info Card */}
        <Card className="p-6">
          <h2 className="mb-4 text-gray-800">Deine Daten</h2>
          <p className="text-gray-600 mb-4">
            Alle deine Daten (Kalorien, Habits, Game-Scores) werden sicher in der Cloud gespeichert 
            und sind geräteübergreifend synchronisiert. Du kannst dich von jedem Gerät aus anmelden 
            und hast Zugriff auf deine komplette Journey.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-900">
              🔒 Deine Daten sind privat und nur für dich sichtbar.
            </p>
          </div>
        </Card>

        {/* Logout Card */}
        <Card className="p-6">
          <h2 className="mb-4 text-gray-800">Account-Aktionen</h2>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={20} className="mr-2" />
            Abmelden
          </Button>
        </Card>
      </div>
    </div>
  );
}
