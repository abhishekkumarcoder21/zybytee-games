'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlaySessionRecord {
  gameId: string;
  gameSlug: string;
  gameTitle: string;
  gameThumbnail: string;
  gameCategory: string;
  lastPlayed: string;
  playCount: number;
}

interface GameStore {
  // Favorites
  favorites: string[];
  addFavorite: (gameId: string) => void;
  removeFavorite: (gameId: string) => void;
  isFavorite: (gameId: string) => boolean;
  toggleFavorite: (gameId: string) => void;

  // Recently played
  recentlyPlayed: PlaySessionRecord[];
  addRecentlyPlayed: (session: Omit<PlaySessionRecord, 'lastPlayed' | 'playCount'>) => void;

  // UI state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // High Scores & Play Time
  highScores: Record<string, number>;
  playTimes: Record<string, number>;
  submitScore: (gameId: string, score: number) => void;
  incrementPlayTime: (gameId: string, seconds: number) => void;
  resetStats: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Favorites
      favorites: [],
      addFavorite: (gameId) =>
        set((state) => ({
          favorites: state.favorites.includes(gameId)
            ? state.favorites
            : [...state.favorites, gameId],
        })),
      removeFavorite: (gameId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== gameId),
        })),
      isFavorite: (gameId) => get().favorites.includes(gameId),
      toggleFavorite: (gameId) => {
        const { favorites } = get();
        if (favorites.includes(gameId)) {
          set({ favorites: favorites.filter((id) => id !== gameId) });
        } else {
          set({ favorites: [...favorites, gameId] });
        }
      },

      // Recently played
      recentlyPlayed: [],
      addRecentlyPlayed: (session) =>
        set((state) => {
          const existing = state.recentlyPlayed.findIndex(
            (s) => s.gameId === session.gameId
          );
          const newSession: PlaySessionRecord = {
            ...session,
            lastPlayed: new Date().toISOString(),
            playCount: existing >= 0 ? state.recentlyPlayed[existing].playCount + 1 : 1,
          };
          const updated =
            existing >= 0
              ? [
                  newSession,
                  ...state.recentlyPlayed.filter((s) => s.gameId !== session.gameId),
                ]
              : [newSession, ...state.recentlyPlayed];
          return { recentlyPlayed: updated.slice(0, 50) }; // Keep last 50
        }),

      // UI
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // High Scores & Play Time
      highScores: {},
      playTimes: {},
      submitScore: (gameId, score) =>
        set((state) => {
          const currentBest = state.highScores[gameId] || 0;
          if (score > currentBest) {
            return {
              highScores: { ...state.highScores, [gameId]: score },
            };
          }
          return {};
        }),
      incrementPlayTime: (gameId, seconds) =>
        set((state) => {
          const current = state.playTimes[gameId] || 0;
          return {
            playTimes: { ...state.playTimes, [gameId]: current + seconds },
          };
        }),
      resetStats: () =>
        set({
          highScores: {},
          playTimes: {},
          favorites: [],
          recentlyPlayed: [],
        }),
    }),
    {
      name: 'zybytee-games-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyPlayed: state.recentlyPlayed,
        highScores: state.highScores,
        playTimes: state.playTimes,
      }),
    }
  )
);
