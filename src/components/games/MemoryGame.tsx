import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getGameScore, saveGameScore } from '../../utils/api';
import { Button } from '../ui/button';

interface MemoryGameProps {
  onBack: () => void;
}

type GameState = 'memorize' | 'recall' | 'result';

export function MemoryGame({ onBack }: MemoryGameProps) {
  const gridSize = 5;
  const cellCount = gridSize * gridSize;

  const [level, setLevel] = useState(1);
  const [bestLevel, setBestLevel] = useState(0);
  const [gameState, setGameState] = useState<GameState>('memorize');

  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [visibleCell, setVisibleCell] = useState<number | null>(null);

  /* ---------------- Score ---------------- */

  useEffect(() => {
    getGameScore('memory')
      .then(data => {
        if (data.score > 0) setBestLevel(data.score);
      })
      .catch(console.error);
  }, []);

  /* ---------------- Pattern ---------------- */

  const generatePattern = (lvl: number) => {
    const length = Math.min(3 + lvl, 15);
    const result: number[] = [];

    while (result.length < length) {
      const n = Math.floor(Math.random() * cellCount);
      if (!result.includes(n)) result.push(n);
    }

    return result;
  };

  const startLevel = (lvl: number) => {
    const newPattern = generatePattern(lvl);
    setPattern(newPattern);
    setUserPattern([]);
    setVisibleCell(null);
    setGameState('memorize');
  };

  /* ---------------- Auto-Start beim Laden ---------------- */

  useEffect(() => {
    startLevel(1);
  }, []);

  /* ---------------- Memorize-Phase ---------------- */

  useEffect(() => {
    if (gameState !== 'memorize' || pattern.length === 0) return;

    let i = 0;
    setVisibleCell(null);

    const interval = setInterval(() => {
      setVisibleCell(pattern[i]);
      i++;

      if (i >= pattern.length) {
        clearInterval(interval);
        setTimeout(() => {
          setVisibleCell(null);
          setGameState('recall');
        }, 400);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [gameState, pattern]);

  /* ---------------- Input ---------------- */

  const handleCellClick = (index: number) => {
    if (gameState !== 'recall') return;
    if (userPattern.includes(index)) return;

    // OHNE Reihenfolge: nur prüfen, ob Feld im Pattern ist
    if (!pattern.includes(index)) {
      endGame();
      return;
    }

    const nextUserPattern = [...userPattern, index];
    setUserPattern(nextUserPattern);

    if (nextUserPattern.length === pattern.length) {
      setTimeout(() => {
        setLevel(prev => {
          const next = prev + 1;
          startLevel(next);
          return next;
        });
      }, 500);
    }
  };

  const endGame = () => {
    setGameState('result');

    if (level > bestLevel) {
      setBestLevel(level);
      saveGameScore('memory', level).catch(console.error);
    }
  };

  const restart = () => {
    setLevel(1);
    startLevel(1);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8"
      >
        <ArrowLeft size={20} />
        <span>Zurück</span>
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Visuelles Gedächtnis</h2>
        <p className="text-gray-600">
          Merke dir die Felder und klicke sie danach an
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-gray-500">Level</p>
          <p className="text-2xl font-bold">{level}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-gray-500">Bestes Level</p>
          <p className="text-2xl font-bold">{bestLevel}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        {gameState === 'result' && (
          <div className="text-center mb-6">
            <p className="text-xl mb-4">Level {level} erreicht</p>
            <Button
  variant="secondary"
  size="default"
  onClick={restart}
>
  Nochmal spielen
</Button>

          </div>
        )}

        {(gameState === 'memorize' || gameState === 'recall') && (
          <>
            <p className="text-center mb-4 font-medium">
              {gameState === 'memorize'
                ? 'Merken...'
                : `Eingabe (${userPattern.length}/${pattern.length})`}
            </p>

            <div
              className={`grid gap-3 max-w-lg mx-auto ${
                gameState !== 'recall'
                  ? 'pointer-events-none opacity-70'
                  : ''
              }`}
              style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
              {Array.from({ length: cellCount }).map((_, index) => {
                let bgClass = 'bg-gray-200';

                if (index === visibleCell) bgClass = 'bg-blue-500';
                else if (userPattern.includes(index))
                  bgClass = 'bg-green-500';

                return (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    className={`aspect-square rounded-lg transition-all ${bgClass}`}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
