import { Home, Apple, CheckSquare, Gamepad2, User } from 'lucide-react';

type Page = 'home' | 'calories' | 'habits' | 'games' | 'account';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home' as Page, icon: Home, label: 'Home' },
    { id: 'calories' as Page, icon: Apple, label: 'Kalorien' },
    { id: 'habits' as Page, icon: CheckSquare, label: 'Habits' },
    { id: 'games' as Page, icon: Gamepad2, label: 'Games' },
    { id: 'account' as Page, icon: User, label: 'Account' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg">
              <span className="tracking-tight">You<span className="opacity-70">vs</span>You</span>
            </div>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}