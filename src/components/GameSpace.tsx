import { useState } from 'react';
import { Zap, Brain, Eye, Target } from 'lucide-react';
import { ReactionGame } from './games/ReactionGame';
import { MemoryGame } from './games/MemoryGame';
import { NumberMemoryGame } from './games/NumberMemoryGame';
import { AimTrainerGame } from './games/AimTrainerGame';

type Game = 'menu' | 'reaction' | 'memory' | 'number' | 'aim';

export function GameSpace() {
  const [currentGame, setCurrentGame] = useState<Game>('menu');

  const games = [
    {
      id: 'reaction' as Game,
      name: 'Reaktionszeit',
      description: 'Teste deine Reaktionsgeschwindigkeit',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: 'memory' as Game,
      name: 'Visuelles Gedächtnis',
      description: 'Merke dir das Muster',
      icon: Eye,
      color: 'from-blue-400 to-indigo-500',
    },
    {
      id: 'number' as Game,
      name: 'Zahlen Gedächtnis',
      description: 'Merke dir die Zahlenfolge',
      icon: Brain,
      color: 'from-purple-400 to-pink-500',
    },
    {
      id: 'aim' as Game,
      name: 'Aim Trainer',
      description: 'Verbessere deine Zielgenauigkeit',
      icon: Target,
      color: 'from-green-400 to-emerald-500',
    },
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'reaction':
        return <ReactionGame onBack={() => setCurrentGame('menu')} />;
      case 'memory':
        return <MemoryGame onBack={() => setCurrentGame('menu')} />;
      case 'number':
        return <NumberMemoryGame onBack={() => setCurrentGame('menu')} />;
      case 'aim':
        return <AimTrainerGame onBack={() => setCurrentGame('menu')} />;
      default:
        return null;
    }
  };

  if (currentGame !== 'menu') {
    return renderGame();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Game Space
        </h1>
        <p className="text-gray-600 text-lg">
          Trainiere deine kognitiven Fähigkeiten mit spannenden Mini-Spielen
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {games.map((game) => {
          const Icon = game.icon;
          
          return (
            <button
              key={game.id}
              onClick={() => setCurrentGame(game.id)}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all text-left group"
            >
              <div className={`bg-gradient-to-br ${game.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className="text-white" size={32} />
              </div>
              <h3 className="mb-3 text-gray-800">{game.name}</h3>
              <p className="text-gray-600">{game.description}</p>
              <div className="mt-6 text-purple-600 flex items-center space-x-2">
                <span>Spiel starten</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
        <h2 className="mb-4">Warum Brain Training?</h2>
        <p className="text-lg opacity-90 mb-4">
          Regelmäßiges Training deiner kognitiven Fähigkeiten kann dir helfen:
        </p>
        <ul className="space-y-2 opacity-90">
          <li>• Deine Reaktionszeit zu verbessern</li>
          <li>• Dein Gedächtnis zu stärken</li>
          <li>• Deine Konzentration zu erhöhen</li>
          <li>• Deine Hand-Auge-Koordination zu optimieren</li>
        </ul>
      </div>
    </div>
  );
}
