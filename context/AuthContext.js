'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext({
  user: null,
  profile: null,
  session: null,
  loading: true,
  isConfigured: false,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  demoLogin: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session and auth state
  useEffect(() => {
    // Check local storage for persistent demo user if Supabase env is not configured yet
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('parcl_auth_user') : null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setProfile(parsed);
      } catch (e) {
        // Fallback
      }
    }

    if (isSupabaseConfigured) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          const initialUser = formatUserData(session.user);
          setUser(initialUser);
          fetchProfile(session.user.id, initialUser);
        }
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session?.user) {
          const updatedUser = formatUserData(session.user);
          setUser(updatedUser);
          fetchProfile(session.user.id, updatedUser);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  // Helper to format Supabase user object and replace internal system 'authenticated' role
  const formatUserData = (rawUser) => {
    const defaultRole = rawUser.email === 'shashwat@parclintel.io' 
      ? 'Admin & Lead ML Engineer' 
      : (rawUser.user_metadata?.role || 'Real Estate ML Analyst');

    return {
      ...rawUser,
      full_name: rawUser.user_metadata?.full_name || rawUser.email?.split('@')[0],
      // Override Supabase system role ('authenticated') with readable application role
      role: defaultRole,
      app_role: defaultRole,
    };
  };

  // Fetch public.profiles from Supabase database
  const fetchProfile = async (userId, baseUserObj) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile(data);
        setUser((prev) => ({
          ...(prev || baseUserObj),
          ...data,
          // Guarantee readable role from database, ignoring Supabase system 'authenticated'
          role: data.role && data.role !== 'authenticated' ? data.role : (baseUserObj?.role || 'Real Estate ML Analyst'),
          app_role: data.role && data.role !== 'authenticated' ? data.role : (baseUserObj?.role || 'Real Estate ML Analyst'),
        }));
      }
    } catch (err) {
      console.warn('Profile fetch error:', err);
    }
  };

  // Sign In with Email/Password
  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      return demoLogin(email);
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  // Sign Up with Email/Password
  const signUp = async (email, password, fullName) => {
    if (!isSupabaseConfigured) {
      return demoLogin(email, fullName);
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'Real Estate ML Analyst',
        },
      },
    });
    if (error) throw error;
    return data;
  };

  // Sign In with Google OAuth
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return demoLogin('google.user@gmail.com', 'Google Demo User');
    }
    const redirectUri = typeof window !== 'undefined' 
      ? `${window.location.origin}/overview` 
      : 'http://localhost:3000/overview';

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
      },
    });
    if (error) throw error;
    return data;
  };

  // Sign Out
  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('parcl_auth_user');
    }
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  // Instant Demo Login
  const demoLogin = (email = 'shashwat@parclintel.io', fullName = 'Shashwat') => {
    const demoUser = {
      id: `demo-${Date.now()}`,
      email,
      full_name: fullName || email.split('@')[0],
      role: email === 'shashwat@parclintel.io' ? 'Admin & Lead ML Engineer' : 'Real Estate ML Analyst',
      app_role: email === 'shashwat@parclintel.io' ? 'Admin & Lead ML Engineer' : 'Real Estate ML Analyst',
      tier: 'PRO',
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('parcl_auth_user', JSON.stringify(demoUser));
    }
    setUser(demoUser);
    setProfile(demoUser);
    return { user: demoUser };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
