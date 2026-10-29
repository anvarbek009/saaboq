'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { DataStore } from '@/lib/store';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (username: string) => Promise<void>;
  register: (username: string, displayName: string, role?: 'viewer' | 'creator') => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchUser: (username: string) => void;
  guestActionPrompt: (actionName: string) => void;
  promptModalOpen: boolean;
  promptMessage: string;
  closePromptModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');

  useEffect(() => {
    DataStore.init();
    const currentUser = DataStore.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (username: string) => {
    const loggedIn = DataStore.loginUser(username);
    setUser(loggedIn);
  };

  const register = async (username: string, displayName: string, role: 'viewer' | 'creator' = 'viewer') => {
    const registered = DataStore.registerUser(username, displayName, role);
    setUser(registered);
  };

  const logout = () => {
    DataStore.logoutUser();
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = DataStore.updateProfile(user.id, updates);
    if (updated) {
      setUser(updated);
    }
  };

  const switchUser = (username: string) => {
    const target = DataStore.getUserByUsername(username);
    if (target) {
      DataStore.setCurrentUser(target);
      setUser(target);
    }
  };

  const guestActionPrompt = (actionName: string) => {
    setPromptMessage(`An account is required to ${actionName}. Please log in or create a free account to continue.`);
    setPromptModalOpen(true);
  };

  const closePromptModal = () => {
    setPromptModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        switchUser,
        guestActionPrompt,
        promptModalOpen,
        promptMessage,
        closePromptModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
