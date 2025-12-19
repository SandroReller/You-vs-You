import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getGameScore, saveGameScore } from '../../utils/api';

interface NumberMemoryGameProps {
  onBack: () => void;
}

type GameState = 'start' | 'memorize' | 'recall' | 'result';

export function NumberMemoryGame({ onBack }: NumberMemoryGameProps) {
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>('start');
  const [number, setNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [bestLevel, setBestLevel] = useState(0)

  useEffect(() => {
    const loadBestScore = async () => {
      try {
        const data = await getGameScore('number-memory');
        if (data.score > 0) {
          setBestLevel(data.score);
        }
      } catch (error) {
        console.error('Error loading number memory best level:', error);
      }
    };
    
    loadBestScore();
  }, []);

  const generateNumber = () => {
    const digits = level + 2;
    let num = '';
    for (let i = 0; i < digits; i++) {
      num += Math.floor(Math.random() * 10).toString();
    }
    return num;
  };

  const startLevel = () => {
    const newNumber = generateNumber();
    setNumber(newNumber);
    setUserInput('');
    setGameState('memorize');

    const displayTime = 1000 + level * 300;
    setTimeout(() => {
      setGameState('recall');
    }, displayTime);
  };

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userInput === number) {
      // Correct!
      setTimeout(() => {
        setLevel(level + 1);
        startLevel();
      }, 500);
    } else {
      // Wrong
      setGameState('result');
      if (level > bestLevel) {
        setBestLevel(level);
        saveGameScore('number-memory', level).catch(error => {
          console.error('Error saving number memory score:', error);
        });
      }
    }
  };

  const restart = () => {
    setLevel(1);
    setGameState('start');
    setUserInput('');
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
        <h2 className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Zahlen Gedächtnis
        </h2>
        <p className="text-gray-600">
          Merke dir die Zahlenfolge und gib sie korrekt ein!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600 mb-2">Aktuelles Level</p>
          <p className="text-3xl text-purple-600">{level}</p>
          <p className="text-sm text-gray-500 mt-2">{level + 2} Ziffern</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600 mb-2">Bestes Level</p>
          <p className="text-3xl text-green-600">{bestLevel}</p>
          <p className="text-sm text-gray-500 mt-2">
            {bestLevel > 0 ? `${bestLevel + 2} Ziffern` : '-'}
          </p>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {gameState === 'start' && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700 mb-8">
              Teste dein Zahlengedächtnis!
            </p>
            <button
              onClick={startLevel}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              Spiel starten
            </button>
          </div>
        )}

        {gameState === 'memorize' && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">Merke dir diese Zahl:</p>
            <p className="text-6xl tracking-widest text-purple-600 mb-4">
              {number}
            </p>
          </div>
        )}

        {gameState === 'recall' && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">Gib die Zahl ein:</p>
            <form onSubmit={checkAnswer} className="max-w-md mx-auto">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Zahlenfolge eingeben..."
                className="w-full border-2 border-purple-300 rounded-xl px-6 py-4 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-shadow"
              >
                Bestätigen
              </button>
            </form>
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-800 mb-4">
              Level {level} erreicht!
            </p>
            <p className="text-gray-600 mb-2">
              Die richtige Zahl war: <span className="text-purple-600">{number}</span>
            </p>
            <p className="text-gray-600 mb-8">
              Deine Eingabe war: <span className="text-red-600">{userInput}</span>
            </p>
            <p className="text-gray-600 mb-8">
              {level > bestLevel ? '🎉 Neuer Rekord!' : 'Versuch es nochmal!'}
            </p>
            <button
              onClick={restart}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              Nochmal spielen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
