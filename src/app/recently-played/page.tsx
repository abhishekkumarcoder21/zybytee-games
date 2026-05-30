'use client';

import { Clock, Gamepad2 } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RecentlyPlayedPage() {
  const { recentlyPlayed } = useGameStore();

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Recently Played</h1>
          <p className="text-sm text-muted-foreground">{recentlyPlayed.length} games</p>
        </div>
      </div>

      {recentlyPlayed.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentlyPlayed.map((session) => (
            <Link key={session.gameId} href={`/games/${session.gameSlug}`}>
              <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-card p-4 game-card-hover">
                <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center shrink-0">
                  <Gamepad2 className="h-6 w-6 text-neon-blue/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{session.gameTitle}</h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {session.gameCategory.replace('-', ' ')}
                  </p>
                  <p className="text-[10px] text-neon-blue mt-1">
                    Played {session.playCount}x • {new Date(session.lastPlayed).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Clock className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No games played yet</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Start playing games and they&apos;ll appear here.
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
