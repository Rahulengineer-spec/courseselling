import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  subscription: 'free' | 'premium' | null;
  setUser: (user: User | null) => void;
  setSubscription: (subscription: 'free' | 'premium' | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  subscription: null,
  setUser: (user) => set({ user }),
  setSubscription: (subscription) => set({ subscription }),
}));