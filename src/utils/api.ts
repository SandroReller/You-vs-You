import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c7ad6a82`;

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error(`API error on ${endpoint}:`, error);
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Meals API
export async function getMeals() {
  return apiCall('/meals');
}

export async function saveMeals(meals: any[]) {
  return apiCall('/meals', {
    method: 'POST',
    body: JSON.stringify({ meals }),
  });
}

// Habits API
export async function getHabits() {
  return apiCall('/habits');
}

export async function saveHabits(habits: any[]) {
  return apiCall('/habits', {
    method: 'POST',
    body: JSON.stringify({ habits }),
  });
}

// Settings API
export async function getSettings() {
  return apiCall('/settings');
}

export async function saveSettings(settings: any) {
  return apiCall('/settings', {
    method: 'POST',
    body: JSON.stringify({ settings }),
  });
}

// Game Scores API
export async function getGameScore(gameName: string) {
  return apiCall(`/game-scores/${gameName}`);
}

export async function saveGameScore(gameName: string, score: number) {
  return apiCall(`/game-scores/${gameName}`, {
    method: 'POST',
    body: JSON.stringify({ score }),
  });
}
