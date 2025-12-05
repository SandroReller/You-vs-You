import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Helper to get user ID from request (simple version without auth)
function getUserId(c: any): string {
  // For now, use a header or default to 'default-user'
  // Later this can be replaced with proper auth
  return c.req.header('X-User-Id') || 'default-user';
}

// Meals endpoints
app.get('/make-server-c7ad6a82/meals', async (c) => {
  try {
    const userId = getUserId(c);
    const key = `user:${userId}:meals`;
    const meals = await kv.get(key) || [];
    return c.json({ meals });
  } catch (error) {
    console.error('Error fetching meals:', error);
    return c.json({ error: 'Failed to fetch meals' }, 500);
  }
});

app.post('/make-server-c7ad6a82/meals', async (c) => {
  try {
    const userId = getUserId(c);
    const key = `user:${userId}:meals`;
    const body = await c.req.json();
    const { meals } = body;
    
    await kv.set(key, meals);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving meals:', error);
    return c.json({ error: 'Failed to save meals' }, 500);
  }
});

// Habits endpoints
app.get('/make-server-c7ad6a82/habits', async (c) => {
  try {
    const userId = getUserId(c);
    const key = `user:${userId}:habits`;
    const habits = await kv.get(key) || [];
    return c.json({ habits });
  } catch (error) {
    console.error('Error fetching habits:', error);
    return c.json({ error: 'Failed to fetch habits' }, 500);
  }
});

app.post('/make-server-c7ad6a82/habits', async (c) => {
  try {
    const userId = getUserId(c);
    const key = `user:${userId}:habits`;
    const body = await c.req.json();
    const { habits } = body;
    
    await kv.set(key, habits);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving habits:', error);
    return c.json({ error: 'Failed to save habits' }, 500);
  }
});

// Settings endpoints (calorie goal)
app.get('/make-server-c7ad6a82/settings', async (c) => {
  try {
    const userId = getUserId(c);
    const key = `user:${userId}:settings`;
    const settings = await kv.get(key) || { calorieGoal: 2000 };
    return c.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

app.post('/make-server-c7ad6a82/settings', async (c) => {
  try {
    const userId = getUserId(c);
    const key = `user:${userId}:settings`;
    const body = await c.req.json();
    const { settings } = body;
    
    await kv.set(key, settings);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return c.json({ error: 'Failed to save settings' }, 500);
  }
});

// Game scores endpoints
app.get('/make-server-c7ad6a82/game-scores/:gameName', async (c) => {
  try {
    const userId = getUserId(c);
    const gameName = c.req.param('gameName');
    const key = `user:${userId}:game:${gameName}`;
    const score = await kv.get(key) || 0;
    return c.json({ score });
  } catch (error) {
    console.error('Error fetching game score:', error);
    return c.json({ error: 'Failed to fetch game score' }, 500);
  }
});

app.post('/make-server-c7ad6a82/game-scores/:gameName', async (c) => {
  try {
    const userId = getUserId(c);
    const gameName = c.req.param('gameName');
    const key = `user:${userId}:game:${gameName}`;
    const body = await c.req.json();
    const { score } = body;
    
    await kv.set(key, score);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving game score:', error);
    return c.json({ error: 'Failed to save game score' }, 500);
  }
});

// Health check
app.get('/make-server-c7ad6a82/health', (c) => {
  return c.json({ status: 'ok' });
});

Deno.serve(app.fetch);
