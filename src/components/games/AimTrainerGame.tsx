import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowLeft, Target } from 'lucide-react';
import { getGameScore, saveGameScore } from '../../utils/api';

interface AimTrainerGameProps {
  onBack: () => void;
}

interface TargetPosition {
  x: number;
  y: number;
  size: number;
}

type GameState = 'playing' | 'result';

export function AimTrainerGame({ onBack }: AimTrainerGameProps) {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [target, setTarget] = useState<TargetPosition | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [bestScore, setBestScore] = useState(0);
  const [clickTimes, setClickTimes] = useState<number[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const lastClickRef = useRef<number>(Date.now());

  /* ---------------- Load Best Score ---------------- */
  useEffect(() => {
    getGameScore('aim-trainer')
      .then(data => {
        if (data.score > 0) setBestScore(data.score);
      })
      .catch(console.error);
  }, []);

  /* ---------------- Timer ---------------- */
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
  }, [timeLeft, gameState]);

  /* ---------------- Generate Target ---------------- */
  const generateTarget = () => {
    if (!gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return; // Defensive

    const minSize = 40;
    const maxSize = 80;
    const size = Math.random() * (maxSize - minSize) + minSize;

    const x = Math.random() * (rect.width - size);
    const y = Math.random() * (rect.height - size);

    setTarget({ x, y, size });
  };

  /* ---------------- Generate Target on Mount / Restart ---------------- */
  useLayoutEffect(() => {
    if (gameState === 'playing') {
      generateTarget();
    }
  }, [gameState]);

  /* ---------------- Start / Restart ---------------- */
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setClickTimes([]);
    lastClickRef.current = Date.now();
  };

  const handleTargetClick = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickRef.current;

    setClickTimes(prev => [...prev, timeSinceLastClick]);
    setScore(prev => prev + 1);
    lastClickRef.current = now;

    generateTarget();
  };

  const endGame = () => {
    setGameState('result');
    if (score > bestScore) {
      setBestScore(score);
      saveGameScore('aim-trainer', score).catch(console.error);
    }
  };

  const averageTime = clickTimes.length > 0
    ? Math.round(clickTimes.reduce((a, b) => a + b, 0) / clickTimes.length)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8"
      >
        <ArrowLeft size={20} />
        <span>Zurück zu Games</span>
      </button>

      <div className="mb-8 text-center">
        <h2 className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
          Aim Trainer
        </h2>
        <p className="text-gray-600">
          Klicke so viele Ziele wie möglich in 30 Sekunden!
        </p>
      </div>

      {/* Stats */}
      {gameState === 'playing' && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <p className="text-gray-600">Score</p>
            <p className="text-3xl text-green-600">{score}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <p className="text-gray-600">Zeit</p>
            <p className="text-3xl text-blue-600">{timeLeft}s</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <p className="text-gray-600">Bester Score</p>
            <p className="text-3xl text-purple-600">{bestScore}</p>
          </div>
        </div>
      )}

      {/* Game Area */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {gameState === 'playing' && (
          <div
            ref={gameAreaRef}
            className="relative bg-gradient-to-br from-gray-50 to-gray-100 cursor-crosshair"
            style={{ height: '500px' }}
          >
            {target && (
              <button
                onClick={handleTargetClick}
                className="absolute bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                style={{
                  left: `${target.x}px`,
                  top: `${target.y}px`,
                  width: `${target.size}px`,
                  height: `${target.size}px`,
                }}
              >
                <div className="w-full h-full rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-1/3 h-1/3 bg-white rounded-full" />
                </div>
              </button>
            )}
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center py-20">
            <p className="text-3xl text-gray-800 mb-4">Spiel vorbei!</p>
            <p className="text-5xl text-green-600 mb-8">{score} Treffer</p>
            
            <div className="max-w-md mx-auto mb-8 space-y-4">
              {averageTime && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-600">Durchschnittliche Reaktionszeit</p>
                  <p className="text-2xl text-gray-800">{averageTime} ms</p>
                </div>
              )}
              
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-600">Bester Score</p>
                <p className="text-2xl text-purple-600">
                  {bestScore} {score >= bestScore && score > 0 ? '🎉 Neuer Rekord!' : ''}
                </p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              Nochmal spielen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
