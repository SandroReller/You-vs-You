import { useState, useEffect } from 'react';
import { Plus, Trash2, Target, TrendingUp } from 'lucide-react';
import { getMeals, saveMeals, getSettings, saveSettings } from '../utils/api';

interface Meal {
  id: string;
  name: string;
  calories: number;
  timestamp: string;
}

export function CalorieTracker() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState('2000');
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load meals
        const mealsData = await getMeals();
        if (mealsData.meals) {
          // Filter meals from today only
          const today = new Date().toDateString();
          const todayMeals = mealsData.meals.filter((meal: Meal) => 
            new Date(meal.timestamp).toDateString() === today
          );
          setMeals(todayMeals);
        }
        
        // Load settings
        const settingsData = await getSettings();
        if (settingsData.settings?.calorieGoal) {
          setDailyGoal(settingsData.settings.calorieGoal);
          setTempGoal(settingsData.settings.calorieGoal.toString());
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save meals to Supabase
  useEffect(() => {
    if (!isLoading && meals.length > 0) {
      saveMeals(meals).catch(error => {
        console.error('Error saving meals:', error);
      });
    }
  }, [meals, isLoading]);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const progress = (totalCalories / dailyGoal) * 100;

  const addMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim() || !mealCalories) return;

    const newMeal: Meal = {
      id: Date.now().toString(),
      name: mealName,
      calories: Number(mealCalories),
      timestamp: new Date().toISOString(),
    };

    setMeals([...meals, newMeal]);
    setMealName('');
    setMealCalories('');
  };

  const deleteMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const saveGoal = async () => {
    const goal = Number(tempGoal);
    if (goal > 0) {
      setDailyGoal(goal);
      try {
        await saveSettings({ calorieGoal: goal });
      } catch (error) {
        console.error('Error saving goal:', error);
      }
      setIsEditingGoal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-center mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          Kalorien Tracker
        </h1>
        <p className="text-center text-gray-600">
          Verfolge deine tägliche Kalorienaufnahme und erreiche deine Ziele
        </p>
      </div>

      {/* Daily Goal Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Target className="text-orange-500" size={32} />
            <div>
              <h3 className="text-gray-800">Tagesziel</h3>
              {!isEditingGoal ? (
                <p className="text-gray-600">{dailyGoal} Kalorien</p>
              ) : (
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="number"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 w-32"
                  />
                  <button
                    onClick={saveGoal}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                  >
                    Speichern
                  </button>
                </div>
              )}
            </div>
          </div>
          {!isEditingGoal && (
            <button
              onClick={() => setIsEditingGoal(true)}
              className="text-orange-500 hover:text-orange-600"
            >
              Bearbeiten
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Fortschritt</span>
            <span className="text-gray-800">
              {totalCalories} / {dailyGoal} Kalorien
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                progress > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-orange-400 to-red-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">{progress.toFixed(1)}% erreicht</span>
            {progress > 100 && (
              <span className="text-sm text-red-500">
                {totalCalories - dailyGoal} über dem Ziel
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add Meal Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h3 className="mb-6 text-gray-800 flex items-center space-x-2">
          <Plus size={24} />
          <span>Mahlzeit hinzufügen</span>
        </h3>
        <form onSubmit={addMeal} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Name der Mahlzeit</label>
            <input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="z.B. Frühstück, Mittagessen..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Kalorien</label>
            <input
              type="number"
              value={mealCalories}
              onChange={(e) => setMealCalories(e.target.value)}
              placeholder="z.B. 450"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg hover:shadow-lg transition-shadow"
          >
            Mahlzeit hinzufügen
          </button>
        </form>
      </div>

      {/* Meals List */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="mb-6 text-gray-800 flex items-center space-x-2">
          <TrendingUp size={24} />
          <span>Heutige Mahlzeiten</span>
        </h3>
        {meals.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Noch keine Mahlzeiten heute. Füge deine erste Mahlzeit hinzu!
          </p>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="text-gray-800">{meal.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(meal.timestamp).toLocaleTimeString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-orange-600">{meal.calories} kcal</span>
                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="text-red-500 hover:text-red-600 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
