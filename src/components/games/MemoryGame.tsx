import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getGameScore, saveGameScore } from '../../utils/api';

interface MemoryGameProps {
  onBack: () => void;
}

type GameState = 'start' | 'memorize' | 'recall' | 'result';

export function MemoryGame({ onBack }: MemoryGameProps) {
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>('start');
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [bestLevel, setBestLevel] = useState(0);

  const gridSize = 5;
  const cellCount = gridSize * gridSize;

  useEffect(() => {
    const loadBestScore = async () => {
      try {
        const data = await getGameScore('memory');
        if (data.score > 0) {
          setBestLevel(data.score);
        }
      } catch (error) {
        console.error('Error loading memory best level:', error);
      }
    };
    
    loadBestScore();
  }, []);

  const generatePattern = () => {
    const squares = Math.min(3 + level, 15);
    const newPattern: number[] = [];
    
    while (newPattern.length < squares) {
      const num = Math.floor(Math.random() * cellCount);
      if (!newPattern.includes(num)) {
        newPattern.push(num);
      }
    }
    
    return newPattern;
  };

  const startLevel = () => {
    const newPattern = generatePattern();
    setPattern(newPattern);
    setUserPattern([]);
    setGameState('memorize');

    setTimeout(() => {
      setGameState('recall');
    }, 2000 + level * 200);
  };

  const handleCellClick = (index: number) => {
    if (gameState !== 'recall') return;

    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);

    // Check if the pattern is correct so far
    const isCorrect = pattern.slice(0, newUserPattern.length).every(
      (val, idx) => val === newUserPattern[idx]
    );

    if (!isCorrect) {
      // Wrong answer
      setGameState('result');
      if (level > bestLevel) {
        setBestLevel(level);
        saveGameScore('memory', level).catch(error => {
          console.error('Error saving memory score:', error);
        });
      }
    } else if (newUserPattern.length === pattern.length) {
      // Completed the level
      setTimeout(() => {
        setLevel(level + 1);
        startLevel();
      }, 500);
    }
  };

  const restart = () => {
    setLevel(1);
    setGameState('start');
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
        <h2 className="mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Visuelles Gedächtnis
        </h2>
        <p className="text-gray-600">
          Merke dir das Muster und klicke die Felder in der gleichen Reihenfolge!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600 mb-2">Aktuelles Level</p>
          <p className="text-3xl text-blue-600">{level}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600 mb-2">Bestes Level</p>
          <p className="text-3xl text-green-600">{bestLevel}</p>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {gameState === 'start' && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700 mb-8">
              Bist du bereit, dein visuelles Gedächtnis zu testen?
            </p>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              Spiel starten
            </button>
          </div>
        )}

        {gameState === 'memorize' && (
          <div className="text-center mb-6">
            <p className="text-xl text-blue-600">Merke dir das Muster...</p>
          </div>
        )}

        {gameState === 'recall' && (
          <div className="text-center mb-6">
            <p className="text-xl text-green-600">
              Klicke die Felder! ({userPattern.length}/{pattern.length})
            </p>
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-800 mb-4">
              Level {level} erreicht!
            </p>
            <p className="text-gray-600 mb-8">
              {level > bestLevel ? '🎉 Neuer Rekord!' : 'Versuch es nochmal!'}
            </p>
            <button
              onClick={restart}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              Nochmal spielen
            </button>
          </div>
        )}

        {(gameState === 'memorize' || gameState === 'recall') && (
          <div
            className="grid gap-3 max-w-lg mx-auto"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            }}
          >
            {Array.from({ length: cellCount }).map((_, index) => {
              const isInPattern = pattern.includes(index);
              const isClicked = userPattern.includes(index);
              const shouldShow = gameState === 'memorize' && isInPattern;

              return (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  disabled={gameState !== 'recall'}
                  className={`aspect-square rounded-lg transition-all ${
                    shouldShow
                      ? 'bg-blue-500'
                      : isClicked
                      ? 'bg-green-500'
                      : 'bg-gray-200 hover:bg-gray-300'
                  } ${gameState === 'recall' ? 'cursor-pointer' : ''}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
