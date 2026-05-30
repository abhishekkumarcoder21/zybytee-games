import type { Metadata } from 'next';
import { games } from '@/data/games';
import { GameGrid } from '@/components/game/GameGrid';
import { Gamepad2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Games',
  description: 'Browse all free online games at ZyBytee Games. Arcade, puzzle, racing, action, and more!',
};

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple">
          <Gamepad2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">All Games</h1>
          <p className="text-sm text-muted-foreground">{games.length} games available</p>
        </div>
      </div>
      <GameGrid games={games} columns={5} />
    </div>
  );
}
