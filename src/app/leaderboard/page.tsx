import type { Metadata } from 'next';
import { Trophy } from 'lucide-react';
import { LeaderboardClient } from '@/components/leaderboard/LeaderboardClient';

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'See the top players and high scores on ZyBytee Games.',
};

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Top players across all games</p>
        </div>
      </div>

      <LeaderboardClient />
    </div>
  );
}
