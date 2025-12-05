import { useState } from 'react';
import { Home } from './components/Home';
import { CalorieTracker } from './components/CalorieTracker';
import { HabitTracker } from './components/HabitTracker';
import { GameSpace } from './components/GameSpace';
import { Navigation } from './components/Navigation';

type Page = 'home' | 'calories' | 'habits' | 'games';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

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
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <main className="pb-20">
        <Home />
      </main>
    </div>
  );
}