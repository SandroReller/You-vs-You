import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}

// Sign up a new user
export async function signup(email: string, password: string, name: string): Promise<{ error?: string }> {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/make-server-c7ad6a82/signup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || 'Signup failed' };
    }

    return {};
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'Failed to sign up. Please try again.' };
  }
}

// Sign in an existing user
export async function signin(email: string, password: string): Promise<{ session?: AuthSession; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return { error: error?.message || 'Login failed' };
    }

    return {
      session: {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
        },
        accessToken: data.session.access_token,
      },
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { error: 'Failed to sign in. Please try again.' };
  }
}

// Sign out the current user
export async function signout(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

// Get current session
export async function getSession(): Promise<AuthSession | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return null;
    }

    return {
      user: {
        id: data.session.user.id,
        email: data.session.user.email!,
        name: data.session.user.user_metadata?.name,
      },
      accessToken: data.session.access_token,
    };
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (session: AuthSession | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      callback({
        user: {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
        },
        accessToken: session.access_token,
      });
    } else {
      callback(null);
    }
  });
}
