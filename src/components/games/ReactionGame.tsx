import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { getGameScore, saveGameScore } from '../../utils/api';

interface ReactionGameProps {
  onBack: () => void;
}

type GameState = 'waiting' | 'ready' | 'green' | 'result' | 'tooearly';

export function ReactionGame({ onBack }: ReactionGameProps) {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadBestScore = async () => {
      try {
        const data = await getGameScore('reaction');
        if (data.score > 0) {
          setBestTime(data.score);
        }
      } catch (error) {
        console.error('Error loading reaction best time:', error);
      }
    };
    
    loadBestScore();
  }, []);

  const startGame = () => {
    setGameState('ready');
    const delay = 2000 + Math.random() * 3000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState('green');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      startGame();
    } else if (gameState === 'ready') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setGameState('tooearly');
    } else if (gameState === 'green' && startTimeRef.current) {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setAttempts([...attempts, time]);
      
      if (!bestTime || time < bestTime) {
        setBestTime(time);
        saveGameScore('reaction', time).catch(error => {
          console.error('Error saving reaction score:', error);
        });
      }
      
      setGameState('result');
    } else if (gameState === 'result' || gameState === 'tooearly') {
      setGameState('waiting');
      setReactionTime(null);
    }
  };

  const averageTime = attempts.length > 0
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
    : null;

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-red-500';
      case 'green':
        return 'bg-green-500';
      case 'result':
        return 'bg-yellow-500';
      case 'tooearly':
        return 'bg-orange-500';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'waiting':
        return 'Klicke um zu starten';
      case 'ready':
        return 'Warte auf Grün...';
      case 'green':
        return 'KLICK!';
      case 'result':
        return `${reactionTime} ms`;
      case 'tooearly':
        return 'Zu früh! Warte auf Grün.';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8"
      >
        <ArrowLeft size={20} />
        <span>Zurück zu Games</span>
      </button>

      <div className="mb-8 text-center">
        <h2 className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          Reaktionszeit Test
        </h2>
        <p className="text-gray-600">
          Klicke so schnell wie möglich, wenn der Bildschirm grün wird!
        </p>
      </div>

      {/* Game Area */}
      <div
        onClick={handleClick}
        className={`${getBackgroundColor()} rounded-2xl shadow-xl cursor-pointer transition-colors min-h-[400px] flex items-center justify-center mb-8`}
      >
        <div className="text-center text-white">
          <p className="text-4xl mb-4">{getMessage()}</p>
          {gameState === 'result' && reactionTime && (
            <p className="text-xl opacity-90">
              {reactionTime < 200 ? 'Blitzschnell! ⚡' :
               reactionTime < 300 ? 'Sehr gut! 🎯' :
               reactionTime < 400 ? 'Gut! 👍' : 'Übe weiter! 💪'}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Trophy className="mx-auto mb-3 text-yellow-500" size={32} />
          <p className="text-gray-600 mb-2">Beste Zeit</p>
          <p className="text-2xl text-gray-800">
            {bestTime ? `${bestTime} ms` : '-'}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600 mb-2">Durchschnitt</p>
          <p className="text-2xl text-gray-800">
            {averageTime ? `${averageTime} ms` : '-'}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600 mb-2">Versuche</p>
          <p className="text-2xl text-gray-800">{attempts.length}</p>
        </div>
      </div>

      {attempts.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="mb-4 text-gray-800">Letzte Versuche</h3>
          <div className="flex flex-wrap gap-2">
            {attempts.slice(-10).reverse().map((time, index) => (
              <div
                key={index}
                className="bg-gray-100 px-4 py-2 rounded-lg"
              >
                {time} ms
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
