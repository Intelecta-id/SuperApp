'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

const DEFAULT_OPERATOR = {
  id: 'a0000000-0000-0000-0000-000000000001',
  uuid: 'a0000000-0000-0000-0000-000000000001',
  name: 'Fabian S.',
  email: 'admin@intelecta.id',
  role: 'super_admin',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  department: 'Executive Operations',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(DEFAULT_OPERATOR);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Check active Supabase session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        // Fetch profile details from Supabase profiles table
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();

          setUser({
            id: session.user.id,
            uuid: session.user.id,
            name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Operator',
            email: session.user.email,
            role: profile?.role || session.user.user_metadata?.role || 'super_admin',
            avatar_url: profile?.avatar_url || DEFAULT_OPERATOR.avatar_url,
            department: profile?.department || 'Executive Operations',
          });
        } catch (e) {
          console.warn('Failed to fetch profile details:', e);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setSession(session);
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();

          setUser({
            id: session.user.id,
            uuid: session.user.id,
            name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Operator',
            email: session.user.email,
            role: profile?.role || session.user.user_metadata?.role || 'super_admin',
            avatar_url: profile?.avatar_url || DEFAULT_OPERATOR.avatar_url,
            department: profile?.department || 'Executive Operations',
          });
        } catch (e) {
          console.warn('Failed to fetch profile on auth change:', e);
        }
      } else if (!session) {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        // First try official Supabase signInWithPassword
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle();

          setUser({
            id: data.user.id,
            uuid: data.user.id,
            name: profile?.name || data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email,
            role: profile?.role || 'super_admin',
            avatar_url: profile?.avatar_url || DEFAULT_OPERATOR.avatar_url,
            department: profile?.department || 'Executive Operations',
          });
          setSession(data.session);
          setLoading(false);
          return { success: true };
        }
      } catch (err) {
        console.warn('Supabase auth sign-in warning:', err.message);
      }

      // If auth user not in auth.users yet, check public.profiles for demo / development operator
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (profile) {
          setUser({
            id: profile.id,
            uuid: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            avatar_url: profile.avatar_url || DEFAULT_OPERATOR.avatar_url,
            department: profile.department || 'Executive Operations',
          });
          setLoading(false);
          return { success: true };
        }
      } catch (e) {
        console.warn('Profile check error:', e);
      }
    }

    // Default fallback operator
    setUser(DEFAULT_OPERATOR);
    setLoading(false);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    setUser(null);
    setSession(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('intelecta_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
