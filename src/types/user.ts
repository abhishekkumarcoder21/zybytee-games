import type { Achievement } from './game';

export interface PlaySession {
  gameId: string;
  lastPlayed: string;
  totalPlayTime: number;
  highScore?: number;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalPlayTime: number;
  achievementsUnlocked: number;
  favoriteCategory: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  joinedAt: string;
  level: number;
  xp: number;
  achievements: Achievement[];
  favorites: string[];
  recentlyPlayed: PlaySession[];
  stats: UserStats;
}
