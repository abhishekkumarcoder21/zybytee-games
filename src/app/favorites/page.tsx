'use client';
import { Heart, Gamepad2 } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { games } from '@/data/games';
import { GameGrid } from '@/components/game/GameGrid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  const { favorites } = useGameStore();
  const favoriteGames = games.filter((g) => favorites.includes(g.id));

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-500">
          <Heart className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Favorites</h1>
          <p className="text-sm text-muted-foreground">{favoriteGames.length} saved games</p>
        </div>
      </div>

      {favoriteGames.length > 0 ? (
        <GameGrid games={favoriteGames} columns={5} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Click the heart icon on any game to save it here.
          </p>
          <Link href="/games">
            <Button className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
              <Gamepad2 className="h-4 w-4" /> Browse Games
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
