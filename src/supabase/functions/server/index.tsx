import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Helper to get user ID from JWT token
async function getUserId(c: any): Promise<string | null> {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }
  
  return user.id;
}

// Auth endpoints
app.post('/make-server-c7ad6a82/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });
    
    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ user: data.user });
  } catch (error) {
    console.error('Error during signup:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

app.get('/make-server-c7ad6a82/user', async (c) => {
  try {
    const userId = await getUserId(c);
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
    if (error || !user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

// Meals endpoints
app.get('/make-server-c7ad6a82/meals', async (c) => {
  try {
    const userId = await getUserId(c);
    if (!userId) {
      return c.json({ error: 'Unauthorized - Please log in' }, 401);
    }
    
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
    const userId = await getUserId(c);
    if (!userId) {
      return c.json({ error: 'Unauthorized - Please log in' }, 401);
    }
    
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
    const userId = await getUserId(c);
    if (!userId) {
      return c.json({ error: 'Unauthorized - Please log in' }, 401);
    }
    
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
    const userId = await getUserId(c);
    if (!userId) {
      return c.json({ error: 'Unauthorized - Please log in' }, 401);
    }
    
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
    const userId = await getUserId(c);
    if (!userId) {
      return c.json({ error: 'Unauthorized - Please log in' }, 401);
    }
    
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
    const userId = await getUserId(c);
    if (!userId) {
      return c.json({ error: 'Unauthorized - Please log in' }, 401);
    }
    
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
    const userId = await getUserId(c);
    if (!userId) {
      return c.json({ error: 'Unauthorized - Please log in' }, 401);
    }
    
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
    const userId = await getUserId(c);
    if (!userId) {
      return c.json({ error: 'Unauthorized - Please log in' }, 401);
    }
    
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