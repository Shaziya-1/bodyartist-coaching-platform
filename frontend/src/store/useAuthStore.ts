import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthState {
  id: string | null;
  name: string | null;
  email: string | null;
  role: 'coach' | 'athlete' | null;
  accessToken: string | null;
  refreshToken: string | null;
  
  setAuth: (authData: {
    id: string;
    name: string;
    email: string;
    role: 'coach' | 'athlete';
    accessToken: string;
    refreshToken: string;
  }) => void;
  
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      id: null,
      name: null,
      email: null,
      role: null,
      accessToken: null,
      refreshToken: null,
      
      setAuth: (authData) =>
        set({
          id: authData.id,
          name: authData.name,
          email: authData.email,
          role: authData.role,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
        }),
        
      clearAuth: () =>
        set({
          id: null,
          name: null,
          email: null,
          role: null,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: 'coach-athlete-auth-storage',
    }
  )
);
