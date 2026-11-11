import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface FarmerProfile {
  id: string;
  full_name: string;
  state?: string;
  district?: string;
  village?: string;
  preferred_language: 'en' | 'kn' | 'hi';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: FarmerProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (email: string, password: string, fullName: string, language: 'en' | 'kn' | 'hi') => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateProfileState: (updated: Partial<FarmerProfile>) => void;
  isDemoUser: boolean;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage for demo user
    const savedDemo = localStorage.getItem('krishi_demo_user');
    if (savedDemo) {
      const demoData = JSON.parse(savedDemo);
      setUser(demoData.user);
      setProfile(demoData.profile);
      setIsDemoUser(true);
      setIsLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
      } else {
        setProfile({
          id: userId,
          full_name: user?.user_metadata?.full_name || 'Farmer',
          preferred_language: 'en'
        });
      }
    } catch {
      setProfile({
        id: userId,
        full_name: 'Farmer',
        preferred_language: 'en'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      loginAsDemo();
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const register = async (email: string, password: string, fullName: string, language: 'en' | 'kn' | 'hi') => {
    if (!isSupabaseConfigured) {
      loginAsDemo();
      return { error: null };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          preferred_language: language
        }
      }
    });
    return { error };
  };

  const loginAsDemo = () => {
    const demoUser = {
      id: 'demo-farmer-id-1234',
      email: 'farmer.demo@krishimitra.gov.in',
      app_metadata: {},
      user_metadata: { full_name: 'Ramesh Patel' },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as User;

    const demoProfile: FarmerProfile = {
      id: 'demo-farmer-id-1234',
      full_name: 'Ramesh Patel',
      state: 'Karnataka',
      district: 'Dharwad',
      village: 'Navalgund',
      preferred_language: 'en'
    };

    localStorage.setItem('krishi_demo_user', JSON.stringify({ user: demoUser, profile: demoProfile }));
    setUser(demoUser);
    setProfile(demoProfile);
    setIsDemoUser(true);
    setIsLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem('krishi_demo_user');
    setIsDemoUser(false);
    setUser(null);
    setProfile(null);
    setSession(null);
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  };

  const updateProfileState = (updated: Partial<FarmerProfile>) => {
    setProfile(prev => prev ? { ...prev, ...updated } : null);
    if (isDemoUser && profile) {
      const newProf = { ...profile, ...updated };
      localStorage.setItem('krishi_demo_user', JSON.stringify({ user, profile: newProf }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        login,
        register,
        logout,
        updateProfileState,
        isDemoUser,
        loginAsDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

