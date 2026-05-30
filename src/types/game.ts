export type CategorySlug =
  | 'arcade'
  | 'racing'
  | 'puzzle'
  | 'action'
  | 'adventure'
  | 'sports'
  | 'multiplayer'
  | 'educational'
  | 'strategy'
  | 'board-games';

export interface GameControls {
  type: 'keyboard' | 'mouse' | 'touch' | 'gamepad';
  keys?: Record<string, string>;
}

export interface GameSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructions: string;
  category: CategorySlug;
  tags: string[];
  thumbnail: string;
  featured: boolean;
  trending: boolean;
  isNew: boolean;
  rating: number;
  playCount: number;
  releaseDate: string;
  lastUpdated: string;
  developer: string;
  hasImplementation: boolean;
  controls: GameControls;
  seo: GameSEO;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  gameCount: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  gameId: string;
  score: number;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}
