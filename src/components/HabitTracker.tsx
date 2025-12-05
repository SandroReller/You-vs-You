import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Flame } from 'lucide-react';
import { getHabits, saveHabits } from '../utils/api';

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  createdAt: string;
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load habits from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await getHabits();
        if (data.habits) {
          setHabits(data.habits);
        }
      } catch (error) {
        console.error('Error loading habits:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save habits to Supabase
  useEffect(() => {
    if (!isLoading && habits.length >= 0) {
      saveHabits(habits).catch(error => {
        console.error('Error saving habits:', error);
      });
    }
  }, [habits, isLoading]);

  const today = new Date().toDateString();

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;

      const isCompletedToday = habit.completedDates.includes(today);
      
      return {
        ...habit,
        completedDates: isCompletedToday
          ? habit.completedDates.filter(date => date !== today)
          : [...habit.completedDates, today],
      };
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const isCompletedToday = (habit: Habit) => habit.completedDates.includes(today);

  const getStreak = (habit: Habit) => {
    let streak = 0;
    const sortedDates = [...habit.completedDates].sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    let currentDate = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setHours(0, 0, 0, 0);
      
      const completedDate = new Date(sortedDates[i]);
      completedDate.setHours(0, 0, 0, 0);

      if (checkDate.getTime() === completedDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const todayCompletionRate = habits.length > 0
    ? (habits.filter(isCompletedToday).length / habits.length) * 100
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-center mb-4 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
          Habit Tracker
        </h1>
        <p className="text-center text-gray-600">
          Baue positive Gewohnheiten auf und tracke deinen Fortschritt
        </p>
      </div>

      {/* Stats Card */}
      {habits.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="mb-4 text-gray-800">Heutige Statistik</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-2">Abgeschlossen</p>
              <p className="text-3xl text-green-500">
                {habits.filter(isCompletedToday).length} / {habits.length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Fortschritt</p>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${todayCompletionRate}%` }}
                    />
                  </div>
                </div>
                <span className="text-gray-800">{todayCompletionRate.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Habit Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h3 className="mb-6 text-gray-800 flex items-center space-x-2">
          <Plus size={24} />
          <span>Neues Habit hinzufügen</span>
        </h3>
        <form onSubmit={addHabit} className="flex gap-4">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="z.B. 30 Minuten lesen, 10.000 Schritte gehen..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-shadow whitespace-nowrap"
          >
            Hinzufügen
          </button>
        </form>
      </div>

      {/* Habits List */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="mb-6 text-gray-800">Deine Habits</h3>
        {habits.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Noch keine Habits erstellt. Füge dein erstes Habit hinzu!
          </p>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const completed = isCompletedToday(habit);
              const streak = getStreak(habit);

              return (
                <div
                  key={habit.id}
                  className={`p-5 rounded-lg border-2 transition-all ${
                    completed
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className="flex-shrink-0"
                      >
                        {completed ? (
                          <CheckCircle className="text-green-500" size={32} />
                        ) : (
                          <Circle className="text-gray-400 hover:text-gray-600" size={32} />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`${completed ? 'text-gray-800 line-through' : 'text-gray-800'}`}>
                          {habit.name}
                        </p>
                        {streak > 0 && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Flame className="text-orange-500" size={16} />
                            <span className="text-sm text-orange-600">
                              {streak} Tag{streak !== 1 ? 'e' : ''} Streak!
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-red-500 hover:text-red-600 p-2 flex-shrink-0"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
