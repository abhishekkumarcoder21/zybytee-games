'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Play, Heart, Gamepad2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/hooks/useGameStore';
import type { Game } from '@/types/game';

interface GameCardProps {
  game: Game;
  index?: number;
  variant?: 'default' | 'compact' | 'large';
}

export function GameCard({ game, index = 0, variant = 'default' }: GameCardProps) {
  const { isFavorite, toggleFavorite } = useGameStore();
  const fav = isFavorite(game.id);

  const formatPlayCount = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <Link href={`/games/${game.slug}`} className="block">
        <div className="relative overflow-hidden rounded-xl bg-card border border-white/5 game-card-hover">
          {/* Thumbnail */}
          <div className={`relative overflow-hidden ${variant === 'large' ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 via-neon-purple/20 to-neon-pink/20 flex items-center justify-center">
              <Gamepad2 className="h-12 w-12 text-white/20" />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neon-blue/90 shadow-lg shadow-neon-blue/30">
                <Play className="h-6 w-6 text-white ml-0.5" fill="white" />
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex gap-1.5">
              {game.featured && (
                <Badge className="bg-neon-orange/90 text-white border-0 text-[10px] px-1.5">
                  Featured
                </Badge>
              )}
              {game.isNew && (
                <Badge className="bg-neon-green/90 text-black border-0 text-[10px] px-1.5">
                  New
                </Badge>
              )}
              {game.trending && !game.featured && (
                <Badge className="bg-neon-purple/90 text-white border-0 text-[10px] px-1.5">
                  Trending
                </Badge>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-semibold text-sm truncate group-hover:text-neon-blue transition-colors">
              {game.title}
            </h3>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-muted-foreground capitalize">
                {game.category.replace('-', ' ')}
              </span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 text-yellow-400" fill="currentColor" />
                  {game.rating}
                </span>
                <span>{formatPlayCount(game.playCount)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(game.id);
        }}
        className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${fav ? 'text-red-500 fill-red-500' : 'text-white'}`}
        />
      </button>
    </motion.div>
  );
}
